from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    user_name: str
    email: str
    password: str
    phone: str
    address: Optional[str] = None   # match SQLModel field
    profile_URL: Optional[str] = None
    role: Optional[bool] = False

class LoginRequest(BaseModel):
    email: str
    password: str 

