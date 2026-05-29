from fastapi import APIRouter, HTTPException
from sqlmodel import SQLModel, select
from models import User, Notification
from schema.job import CreateNotiification
from db import SessionDep

router = APIRouter(
    prefix='/admin',
    tags=['Admin']
)

@router.post('/notification')
def create_general_notification(notification:CreateNotiification,session:SessionDep):
    user = session.exec(select(User).where(User.role == "admin")).first()
    if not user:
        raise HTTPException(detail="Admin not found", status_code=404)
    new_notification = Notification(
        title=notification.title,
        message=notification.message
    )

    session.add(new_notification)
    session.commit()
    
