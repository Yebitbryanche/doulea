from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import select, func
from db import SessionDep
from utils.job.upload import upload_file
from models import User,EmployerRating
from models.job import Job
from config import settings
from schema.users import LoginRequest, ReviewModel, UserCreate, UserUpdate
from utils.userUtills import hash_password, authenticate_user, create_access_token,get_current_user,send_document_email


router = APIRouter(
    prefix='/users',
    tags=['users']
)

def allowed_file(filename: str):
    return filename.split(".")[-1].lower() in settings.ALLOWED_EXTENSIONS


# user routes // Job seekers

# ctreate a new user in the system

@router.post('/create_user')
def create_user(user: UserCreate, session: SessionDep):
    existing_user = session.exec(select(User).where(User.email == user.email)).first()
    existing_number = session.exec(select(User).where(User.phone == user.phone)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="This email has been taken")
    if existing_number:
        raise HTTPException(status_code=400, detail='Number already exists')

    new_user = User(
        user_name=user.user_name,
        email=user.email,
        password_hash=hash_password(user.password),
        phone=user.phone,
        address=user.address,
        profile_URL=user.profile_URL,
        role=user.role
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return {"user":new_user,
            "status":"Success"}


#   signin user authentication

@router.post('/signin')
async def login_user(session:SessionDep, data:LoginRequest):

    user = authenticate_user(session, data.email, data.password)

    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(
        data={"sub":user.email},
    )

    return {
        "status": True,
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "user_name": user.user_name,
            "role": user.role
        }
    }

# ----------------------------------
# uploading id or important document
# ----------------------------------

@router.post('upload_doc/{user_id}')
async def upload_doc(
    session:SessionDep,
    user_id:str,
    document: UploadFile = File()
    ):
    user = session.get(User,user_id)

    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    
    if not user.role:
        raise HTTPException(status_code=400, detail="Employers Only")
    
    content = await document.read()

    send_document_email(
        user.user_name,
        user.email,
        user.phone,
        document.filename,
        content,
        document.content_type
    )

    return {"status": "Document uploaded successfully"}

@router.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

#------------------------------
# upload avatar
# ----------------------------

@router.post('/upload_avatar/{user_id}')
async def upload_avatar(user_id:str, session:SessionDep, file: UploadFile = File(...)):
    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG and WEBP files are allowed"
        )

    image_url = await upload_file(file)

    user = session.exec(select(User).where(User.id == user_id)).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )
    
    user.profile_URL = image_url

    session.add(user)
    session.commit()
    session.refresh(user)

    return {
        "success": True,
        "image_url": image_url,
        "user": user
    }


#------------------------------------------
# edit user profile
#------------------------------------------

@router.put('/update_profile/{user_id}')
def updateProfile(user_id:str, user:UserUpdate, session:SessionDep):
    existing_user = session.exec(select(User).where(User.id == user_id)).first()

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    profile_update = user.model_dump(exclude_unset=True)

    for key, value in profile_update.items():
        setattr(existing_user, key, value)

    session.add(existing_user)
    session.commit()
    session.refresh(existing_user)

    return existing_user


#--------------------------
# write a review for an employer
#---------------------------


@router.post("/review/{user_id}")
def write_review(
    user_id: str,
    review: ReviewModel,
    session: SessionDep
):
    # check if employer exists
    existing_employer = session.exec(select(User).where(User.id == review.employer_id)).first()
    if not existing_employer:
        raise HTTPException(status_code=404, detail="Employer not found")

    # check if user exists
    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Assign foreign keys
    review_db = EmployerRating(
        job_seeker_id=user_id,
        employer_id=review.employer_id,
        rating=review.rating,
        review = review.review,
        comment=review.comment
    )

    # Add to DB
    session.add(review_db)
    session.commit()
    session.refresh(review_db)
    return {"message": "Review submitted successfully", "review": review}



#--------------------------
#get Employer and reviews
# route /users/employer/{user_id}
#-------------------------


@router.get("/employer/{user_id}")
def get_employer_reviews(
    user_id: str,
    session: SessionDep,
    limit: int = 5,
    offset: int = 0
):
    # 1️⃣ Fetch employer info
    employer = session.get(User, user_id)
    if not employer:
        raise HTTPException(status_code=404, detail="Employer not found")

    # 2️⃣ Fetch jobs/posts assigned to this employer
    jobs = session.exec(
        select(Job).where(Job.employer_id == user_id)
    ).all()

    # 3️⃣ Fetch reviews for this employer
    reviews_query = (
        select(EmployerRating, User)
        .join(User, EmployerRating.job_seeker_id == User.id)  # user who wrote review
        .where(EmployerRating.employer_id == user_id)
        .order_by(EmployerRating.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    reviews_data = session.exec(reviews_query).all()

    reviews = []
    for review, reviewer in reviews_data:
        reviews.append({
            "id": review.id,
            "rating": review.rating,
            "comment": review.comment,
            "review":review.review,
            "created_at": review.created_at,
            "reviewer": {
                "id": reviewer.id,
                "name": reviewer.user_name,
                "avatar": reviewer.profile_URL
            }
        })

    # 4️⃣ Calculate average rating
    avg_rating = session.exec(
        select(func.avg(EmployerRating.rating)).where(EmployerRating.employer_id == user_id)
    ).one()

    return {
        "employer": {
            "id": employer.id,
            "name": employer.user_name,
            "email": getattr(employer, "email", None),
            "avatar": employer.profile_URL,
            "bio":employer.bio
        },
        "average_rating": avg_rating or 0,
        "jobs": [{"id": job.id, "title": job.title} for job in jobs],
        "reviews": reviews,
        "total_reviews": session.exec(
            select(func.count()).where(EmployerRating.employer_id == user_id)
        ).one()
    }