import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv() # loading our environment variables

class Settings(BaseSettings):
    DB_URL:str = os.getenv('')
    ACCESS_TOKEN_EXPIRE_MINUTES:int = os.getenv("")
    ALGORITHM:str = os.getenv('')
    SECRET_KEY:str = os.getenv('')
    EMAIL:str = os.getenv('')
    EMAIL_PASSWORD:str = os.getenv('')
    CLOUDINARY_API_KEY:str = os.getenv('')
    CLOUDINARY_API_SECRET:str = os.getenv('')
    CLOUD_NAME:str = os.getenv('')
    ALLOWED_EXTENSIONS:list[str] = os.getenv('')

    class Config:
        env_file = ".env"
settings = Settings()