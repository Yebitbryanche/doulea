from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from config import settings
from sqlmodel import delete, func, select
from utils.job.upload import generate_embedding, upload_file
from schema.job import JobCreate,JobUpdate, LikeRequest
from schema.users import UserPublic
from models.job import Job, JobLike
from models.user import User,EmployerRating
from db import SessionDep
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from utils.userUtills import get_current_user

router = APIRouter(
    prefix='/job',
    tags=['Jobs']
)

def allowed_file(filename: str):
    return filename.split(".")[-1].lower() in settings.ALLOWED_EXTENSIONS

## ----------------
## upload job image
## ----------------

@router.post('/upload_image/{job_id}')
async def upload_image(job_id:str, session:SessionDep, file: UploadFile = File(...)):
    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG and WEBP files are allowed"
        )

    image_url = await upload_file(file)

    job = session.exec(select(Job).where(Job.id == job_id)).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )
    
    job.cover_image_URL = image_url

    session.add(job)
    session.commit()
    session.refresh(job)

    return {
        "success": True,
        "image_url": image_url,
        "job": job
    }


@router.post('/upload_job')
def upload_job(job: JobCreate, session: SessionDep,currentUser = Depends(get_current_user)):
    if not currentUser:
        raise HTTPException(status_code=401, detail="unauthorized user")
    # Convert JobCreate (Schema) into Job (Table Model)
    # .model_dump() extracts the data as a dictionary
    db_job = Job(**job.model_dump(),employer_id=currentUser.id)
    db_job.embedding = generate_embedding(db_job)

    session.add(db_job)
    session.commit()
    session.refresh(db_job)

    return {"Job":db_job,
            "user":UserPublic.model_validate(currentUser)}

## ------------
## update job
## ------------

@router.put('/update_job/{job_id}')
def update_job(job_id:str, job:JobUpdate, session:SessionDep):
    existing_job = session.exec(select(Job).where(Job.id == job_id)).first()

    if not existing_job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )
    
    job_update = job.model_dump(exclude_unset=True)

    for key, value in job_update.items():
        setattr(existing_job, key, value)

    session.add(existing_job)
    session.commit()
    session.refresh(existing_job)

    return existing_job

## ------------
## get all jobs
## ------------

@router.get("/get_jobs")
def get_jobs(
    session: SessionDep,
    limit: int = 10,
    offset: int = 0
):
    query = (
        select(Job, User)
        .join(User, Job.employer_id == User.id)
        .order_by(Job.created_at.desc())
        .offset(offset)
        .limit(limit)
    )

    rows = session.exec(query).all()

    total = session.exec(
        select(func.count()).select_from(Job)
    ).one()

    result = []

    for job, employer in rows:
        average_rating = session.exec(
            select(func.avg(EmployerRating.rating)).where(EmployerRating.employer_id == employer.id)
        ).one()
        result.append({
            "id": job.id,
            "title": job.title,
            "employer_id": job.employer_id,
            "location": job.location,
            "payment": job.payment,
            "description": job.description,
            "category": job.category,
            "cover_image_URL": job.cover_image_URL,
            "created_at": job.created_at,
            "employer_rating":average_rating,
            "employer": employer
        })

    return {
        "data": result,
        "pagination": {
            "total": total,
            "limit": limit,
            "offset": offset,
            "has_more": offset + limit < total
        }
    }


#----------------------
# select particular job
#----------------------

@router.get('/job/{id}')
def getSingleJob(session:SessionDep, id:str):
    job = session.exec(select(Job).where(Job.id == id)).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    employer = session.exec(select(User).where(User.id == job.employer_id)).first()
    return {
        "job":job,
        "employer":employer
    }

#---------------------------------------
#get favourite job for a particular user
#---------------------------------------

@router.get('/liked_jobs')
def get_likedJobs(user_id:str, session:SessionDep):
    #user = session.exec(select(User).where(User.id == user_id)).first()
    jobs = session.exec(select(Job).join(JobLike,Job.id==JobLike.job_id).where(JobLike.job_seeker_id == user_id)).all()

    return(jobs)
    


#-----------------------
# like job
#-----------------------
@router.post('/like_job/{user_id}')
def like_job(user_id: str, data: LikeRequest, session: SessionDep):

    user = session.get(User, user_id)
    job = session.get(Job, data.job_id)

    if not user or not job:
        raise HTTPException(status_code=404, detail="User or Job not found")

    existing_like = session.exec(
        select(JobLike).where(
            JobLike.job_seeker_id == user_id,
            JobLike.job_id == data.job_id
        )
    ).first()

    if existing_like:
        return {"message": "Already liked"}

    like = JobLike(
        job_id=data.job_id,
        job_seeker_id=user_id
    )

    session.add(like)
    session.commit()
    session.refresh(like)

    return like
#---------------------
# remove like || unlike
#---------------------

@router.delete('/unlike_job/{user_id}')
def UnlikeJob(user_id: str, job_id: str, session: SessionDep):

    liked_job = session.exec(select(JobLike).where(
        JobLike.job_seeker_id == user_id,
        JobLike.job_id == job_id)).first()
    if not liked_job:
        raise HTTPException(status_code=404, detail="Like not found")
    
    session.delete(liked_job)
    session.commit()

    return {"message":"job unliked successfully"}

#------------------------------------------------------------
# recommend user recommendations based on like and saved jobs
#------------------------------------------------------------
@router.get("/recommendations/{user_id}")
def recommend_jobs(user_id: str, session: SessionDep):

    # -----------------------------
    # 1. Get liked jobs
    # -----------------------------
    liked = session.exec(
        select(JobLike).where(JobLike.job_seeker_id == user_id)
    ).all()

    if not liked:
        return session.exec(select(Job).limit(10)).all()

    liked_jobs = []
    like_embeddings = []
    liked_job_ids = []

    for j in liked:
        job = session.get(Job, j.job_id)
        if job:
            liked_jobs.append(job)
            liked_job_ids.append(job.id)
            if job.embedding:
                like_embeddings.append(job.embedding)

    if not like_embeddings:
        return session.exec(select(Job).limit(10)).all()

    # -----------------------------
    # 2. Build user vector
    # -----------------------------
    user_vector = np.mean(like_embeddings, axis=0)

    # -----------------------------
    # 3. Extract preferences
    # -----------------------------
    preferred_categories = set()

    for job in liked_jobs:
        if job.category:
            if isinstance(job.category, list):
                preferred_categories.update(job.category)  # flatten
            else:
                preferred_categories.add(job.category)

    preferred_locations = set(
        job.location for job in liked_jobs if job.location
    )

    # -----------------------------
    # 4. Get all jobs
    # -----------------------------
    all_jobs = session.exec(select(Job)).all()

    filtered_jobs = [job for job in all_jobs if job.embedding]

    if not filtered_jobs:
        return session.exec(select(Job).limit(10)).all()

    job_vectors = [job.embedding for job in filtered_jobs]

    similarities = cosine_similarity([user_vector], job_vectors)[0]

    # -----------------------------
    # 5. Get employer ratings (OPTIMIZED)
    # -----------------------------
    employer_ids = list(set(job.employer_id for job in filtered_jobs))

    ratings_data = session.exec(
        select(
            EmployerRating.employer_id,
            func.avg(EmployerRating.rating)
        )
        .where(EmployerRating.employer_id.in_(employer_ids))
        .group_by(EmployerRating.employer_id)
    ).all()

    employer_avg_map = {
        emp_id: float(avg)
        for emp_id, avg in ratings_data
    }

    # -----------------------------
    # 5B. Fetch employers (OPTIMIZED)
    # -----------------------------
    employer_ids = list(set(job.employer_id for job in filtered_jobs))

    employers = session.exec(
        select(User).where(User.id.in_(employer_ids))
    ).all()

    employer_map = {emp.id: emp for emp in employers}

    # -----------------------------
    # 6. Learn user rating preference
    # -----------------------------
    liked_employer_ratings = []

    for job in liked_jobs:
        avg = employer_avg_map.get(job.employer_id)
        if avg:
            liked_employer_ratings.append(avg)

    avg_rating_preference = (
        sum(liked_employer_ratings) / len(liked_employer_ratings)
        if liked_employer_ratings else 0
    )

    # -----------------------------
    # 7. Score jobs
    # -----------------------------
    scored_jobs = []

    for idx, job in enumerate(filtered_jobs):

        if job.id in liked_job_ids:
            continue  # skip already liked

        score = similarities[idx]

        # -------- CATEGORY BOOST --------
        # CATEGORY BOOST
        if job.category:
            if isinstance(job.category, list):
                if any(cat in preferred_categories for cat in job.category):
                    score += 0.2
            else:
                if job.category in preferred_categories:
                    score += 0.2

        # -------- LOCATION BOOST --------
        if job.location in preferred_locations:
            score += 0.2

        # -------- EMPLOYER RATING BOOST --------
        avg_rating = employer_avg_map.get(job.employer_id)

        if avg_rating:
            # Smooth scaling (better than hard threshold)
            score += (avg_rating / 5) * 0.3

            # Optional strict preference enforcement
            if avg_rating < avg_rating_preference:
                score -= 0.1

        scored_jobs.append((job, score))

    # -----------------------------
    # 8. Sort & return
    # -----------------------------
    scored_jobs.sort(key=lambda x: x[1], reverse=True)

    recommended = []

    for job, score in scored_jobs[:10]:

        employer = employer_map.get(job.employer_id)
        avg_rating = employer_avg_map.get(job.employer_id)

        recommended.append({
            "job": {
                "id": job.id,
                "title": job.title,
                "description": job.description,
                "category": job.category,
                "location": job.location,
                "created_at": job.created_at,
            },
            "employer": {
                "id": employer.id if employer else None,
                "name": employer.user_name if employer else None,
                "email": employer.email if employer else None,
                "avatar": getattr(employer, "avatar", None),  # optional
            },
            "employer_rating": avg_rating,
            "score": float(score)  # useful for debugging / tuning
        })

    return recommended


#------------------------------------
# get post for a particular employer
#------------------------------------

@router.get('/uploads/{user_id}')
def get_uploads_by_id(user_id:str, session:SessionDep):
    query = select(User).where(User.id == user_id)
    user = session.exec(query).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="user not found"
        )
    jobquery = select(Job).where(Job.employer_id == user_id)
    job = session.exec(jobquery).all()

    return job



@router.delete('/delete/job/{job_id}')
def delete_job(job_id: str, session: SessionDep):

    job = session.get(Job, job_id)

    if not job:
        raise HTTPException(status_code=404, detail='job not found')

    # -----------------------------
    # DELETE DEPENDENCIES FIRST
    # -----------------------------
    session.exec(
        delete(JobLike).where(JobLike.job_id == job_id)
    )


    # -----------------------------
    # DELETE JOB
    # -----------------------------
    session.delete(job)
    session.commit()

    return {"message": "delete successful"}