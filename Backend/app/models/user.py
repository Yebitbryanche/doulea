from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlmodel import Field, Relationship, SQLModel
from utils.dbUtils import generate_job_id


if TYPE_CHECKING:
    from models.job import Job

class User(SQLModel,table=True):
    __tablename__ = "user"

    id:str = Field( unique=True, default_factory=generate_job_id, index=True, primary_key=True)
    user_name:str = Field(index=True)
    email:str = Field(unique=True,nullable=False)
    phone:str = Field(unique=True, nullable=False)
    password_hash:str = Field(nullable=False)
    address:Optional[str] = Field(index=True)
    profile_URL:Optional[str] = Field(index=True)
    is_verified:bool = Field(default=False)
    role:bool = Field(default=False)
    bio:str = Field(index=True, nullable=True)

    jobs: list["Job"] = Relationship(back_populates="employer")


### Emploer ratings table
class EmployerRating(SQLModel,table=True):
    __tablename__ = "employer_ratings"

    id:int = Field(primary_key=True)
    employer_id:str = Field(foreign_key=("user.id"))
    job_seeker_id:str = Field(foreign_key=("user.id"))
    rating:int = Field(index=True)# 1–5
    review:str = Field(index=True)
    comment:str = Field(index=True)
    created_at:datetime = Field(default_factory=datetime.utcnow)


class Subscription(SQLModel,table=True):
    __tablename__ = "subscriptions"

    id:int = Field(primary_key=True)
    job_seeker_id:str = Field(foreign_key=("user.id"))
    amount:float = Field(default=1000)
    is_active:bool = Field(default=True)
    expires_at:datetime = Field(index=True)


class Payment(SQLModel,table=True):
    __tablename__ = "payments"

    id:int = Field(primary_key=True)
    job_seeker_id:str = Field(foreign_key=("user.id"))
    amount:float = Field(index=True)
    currency:str = Field(default="XAF")
    status:str = Field()  # pending | completed | failed
    created_at:datetime = Field(default=datetime.utcnow)





