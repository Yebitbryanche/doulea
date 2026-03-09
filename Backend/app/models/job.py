from datetime import datetime
from typing import Optional
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSON
from sqlmodel import ForeignKey, Field, SQLModel
from utils.dbUtils import generate_job_id

class Job(SQLModel,table=True):
    __tablename__ = "jobs"

    id:str = Field(default_factory=generate_job_id, index=True, primary_key=True, unique=True)
    employer_id:str = Field(ForeignKey('users.id'))
    title:str = Field(index=True)
    description:str = Field(index=True)
    location:str = Field(index=True)
    category:list[str] = Field(sa_column=Column(JSON))
    payment:float = Field(index=True)
    cover_image_URL:Optional[str] = Field(index=True)
    created_at:datetime = Field(default_factory=datetime.utcnow)


class SavedJob(SQLModel,table=True):
    __tablename__ = "saved_jobs"

    id:int = Field(primary_key=True)
    job_id:str = Field(ForeignKey("jobs.id"))
    job_seeker_id:str = Field(ForeignKey("users.id"))
    saved_at:datetime = Field(default=datetime.utcnow)


class JobLike(SQLModel,table=True):
    __tablename__ = "job_likes"

    id:int = Field(primary_key=True)
    job_id:str = Field(ForeignKey("jobs.id"))
    job_seeker_id:str = Field(ForeignKey("users.id"))
    created_at:datetime = Field(default=datetime.utcnow)

