from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from config import settings
from sqlmodel import func, select
from utils.job.upload import generate_embedding, upload_file
from schema.job import JobCreate,JobUpdate, LikeRequest
from schema.users import UserPublic
from models.job import Job, JobLike
from models.user import User,EmployerRating
from db import SessionDep
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


#get favourite job for a particular user
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


# recommend user recommendations based on like and saved jobs
@router.get("/recommendations/{user_id}")
def recommend_jobs(user_id: str, session: SessionDep):

    liked = session.exec(
        select(JobLike).where(JobLike.job_seeker_id == user_id)
    ).all()

    # saved = session.exec(
    #     select(SavedJob).where(SavedJob.job_seeker_id == user_id)
    # ).all()

    job_ids = [j.job_id for j in liked]

    like_embeddings = []

    for j in liked:
        job = session.get(Job, j.job_id)
        if job and job.embedding:
            like_embeddings.append(job.embedding)

    # for j in saved:
    #     job = session.get(Job, j.job_id)
    #     if job and job.embedding:
    #         save_embeddings.append(job.embedding)

    if not like_embeddings:
        return session.exec(select(Job).limit(10)).all()

    import numpy as np

    user_vector = (
        2 * np.mean(like_embeddings, axis=0)
    ) / 3

    all_jobs = session.exec(select(Job)).all()

    from sklearn.metrics.pairwise import cosine_similarity

    job_vectors = [job.embedding for job in all_jobs if job.embedding]

    similarities = cosine_similarity([user_vector], job_vectors)[0]

    ranked = np.argsort(similarities)[::-1]

    recommended = []
    seen_ids = set(job_ids)

    for i in ranked:
        job = all_jobs[i]

        if job.id not in seen_ids:
            recommended.append(job)

        if len(recommended) == 10:
            break

    return recommended
    