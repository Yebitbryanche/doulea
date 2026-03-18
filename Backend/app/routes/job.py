from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from config import settings
from sqlmodel import select
from utils.job.upload import upload_file
from schema.job import JobCreate,JobUpdate
from schema.users import UserPublic
from models.job import Job
from models import User
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
def get_jobs(session: SessionDep):

    jobs = session.exec(select(Job)).all()

    result = []

    for job in jobs:

        employer = session.get(User, job.employer_id)

        result.append({
            "id": job.id,
            "title": job.title,
            "employer_id":job.employer_id,
            "location": job.location,
            "payment": job.payment,
            "description": job.description,
            "category": job.category,
            "cover_image_URL": job.cover_image_URL,
            "created_at":job.created_at,
            "employer": employer
        })

    return result



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