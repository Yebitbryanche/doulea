from fastapi import APIRouter, HTTPException
from sqlmodel import SQLModel, select
from app.models.user import User, Notification
from app.schema.job import CreateNotiification
from app.db import SessionDep

router = APIRouter(
    prefix='/admin',
    tags=['Admin']
)


########### creating general notification ###########

@router.post('/notification/{id}')
def create_general_notification(id:str,notification:CreateNotiification,session:SessionDep):
    user = session.exec(select(User).where(User.id == id)).first()
    if user.role != 'admin':
        raise HTTPException(detail="Unauthorized admin", status_code=401)
    new_notification = Notification(
        title=notification.title,
        message=notification.message
    )

    session.add(new_notification)
    session.commit()
#
#----------------------------------------
# verify employer
# 
@router.patch('/verify_employer')
def verify_employer(email: str, session: SessionDep):

    user = session.exec(
        select(User).where(User.email == email)
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Employer does not exist"
        )

    user.is_verified = True

    session.add(user)
    session.commit()
    session.refresh(user)

    return {
        "message": "Employer verified successfully",
        "email": user.email,
        "is_verified": user.is_verified
    }