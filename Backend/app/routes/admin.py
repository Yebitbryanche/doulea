from fastapi import APIRouter, HTTPException
from sqlmodel import SQLModel, select
from models import User, Notification
from schema.job import CreateNotiification
from db import SessionDep

router = APIRouter(
    prefix='/admin',
    tags=['Admin']
)

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
    
