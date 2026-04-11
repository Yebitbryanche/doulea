from pydantic import BaseModel
from typing import Optional
from sqlmodel import SQLModel

class UserCreate(BaseModel):
    user_name: str
    email: str
    password: str
    phone: str
    address: Optional[str] = None   # match SQLModel field
    profile_URL: Optional[str] = None
    role: Optional[bool] = False

class UserUpdate(SQLModel):
    user_name:str
    email:str
    phone:str
    address: Optional[str] = None
    bio:str

class UserPublic(SQLModel):
    id: str
    email: str
    user_name: str | None
    profile_URL: str | None
    address:str | None
    phone:str | None

class LoginRequest(BaseModel):
    email: str
    password: str 

class ReviewModel(SQLModel):
    rating:int
    review:str
    comment:str
    employer_id:str

class MakePayment(SQLModel):
    id:str
    amount:int

# webhook model
class NotchPayData(BaseModel):
    reference: str

class NotchPayWebhook(BaseModel):
    event: str
    data: NotchPayData
