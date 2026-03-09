from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import select
from db import SessionDep
from utils.job.upload import upload_file
from models import User
from config import settings
from schema.users import LoginRequest, UserCreate
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


# uploading id or important document

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

