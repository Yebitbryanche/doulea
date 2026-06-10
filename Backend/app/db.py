from typing import Annotated
from sqlmodel import create_engine,SQLModel, Session
from fastapi import Depends
from config import settings


db_url = settings.DB_URL


engine = create_engine(db_url, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]



