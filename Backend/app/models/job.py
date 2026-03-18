from datetime import datetime
from typing import Optional,TYPE_CHECKING
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSON
from sqlmodel import ForeignKey, Field, Relationship, SQLModel
from utils.dbUtils import generate_job_id

if TYPE_CHECKING:
    from models.user import User

class Job(SQLModel,table=True):
    __tablename__ = "jobs"

    id:str = Field(default_factory=generate_job_id, index=True, primary_key=True, unique=True)
    employer_id:str = Field(foreign_key=('user.id'))
    title:str = Field(index=True)
    description:str = Field(index=True)
    location:str = Field(index=True)
    category:list[str] = Field(sa_column=Column(JSON))
    payment:float = Field(index=True)
    cover_image_URL:Optional[str] = Field(index=True)
    created_at:datetime = Field(default_factory=datetime.utcnow)

    employer: Optional["User"] = Relationship(back_populates="jobs")


class SavedJob(SQLModel,table=True):
    __tablename__ = "saved_jobs"

    id:int = Field(primary_key=True)
    job_id:str = Field(foreign_key=("jobs.id"))
    job_seeker_id:str = Field(foreign_key=("user.id"))
    saved_at:datetime = Field(default=datetime.utcnow)


class JobLike(SQLModel,table=True):
    __tablename__ = "job_likes"

    id:int = Field(primary_key=True)
    job_id:str = Field(foreign_key=("jobs.id"))
    job_seeker_id:str = Field(foreign_key=("user.id"))
    created_at:datetime = Field(default=datetime.utcnow)

