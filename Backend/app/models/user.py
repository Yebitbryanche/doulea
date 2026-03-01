from datetime import datetime
from typing import Optional
from sqlmodel import Field,ForeignKey, SQLModel
from utils.dbUtils import generate_job_id

class User(SQLModel,table=True):
    __tablename___ = "users"

    id:str = Field( unique=True, default_factory=generate_job_id, index=True, primary_key=True)
    user_name:str = Field(index=True)
    email:str = Field(unique=True,nullable=False)
    phone:str = Field(unique=True, nullable=False)
    password_hash:str = Field(nullable=False)
    address:Optional[str] = Field(index=True)
    profile_URL:Optional[str] = Field(index=True)
    is_verified:bool = Field(default=False)
    role:bool = Field(default=False)


### Emploer ratings table
class EmployerRating(SQLModel,table=True):
    __tablename__ = "employer_ratings"

    id:int = Field(primary_key=True)
    employer_id:str = Field(ForeignKey("users.id"))
    job_seeker_id:str = Field(ForeignKey("users.id"))
    rating:int = Field(index=True)# 1–5
    review:str = Field(index=True)
    created_at:datetime = Field(default=datetime.utcnow)


class Subscription(SQLModel,table=True):
    __tablename__ = "subscriptions"

    id:int = Field(primary_key=True)
    job_seeker_id:str = Field(ForeignKey("users.id"))
    amount:float = Field(default=1000)
    is_active:bool = Field(default=True)
    expires_at:datetime = Field(index=True)


class Payment(SQLModel,table=True):
    __tablename__ = "payments"

    id:int = Field(primary_key=True)
    job_seeker_id:str = Field(ForeignKey("users.id"))
    amount:float = Field(index=True)
    currency:str = Field(default="XAF")
    status:str = Field()  # pending | completed | failed
    created_at:datetime = Field(default=datetime.utcnow)


