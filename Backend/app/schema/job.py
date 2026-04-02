from sqlmodel import SQLModel

class JobCreate(SQLModel):
    title:str
    description:str
    location:str
    category:list[str]
    payment:float


class JobUpdate(SQLModel):
    title:str
    description:str
    location:str
    category:list[str]
    payment:float

class LikeRequest(SQLModel):
    job_id: str