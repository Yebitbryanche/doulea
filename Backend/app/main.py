from fastapi import FastAPI
from app.models import *
from app.db import create_db_and_tables
from app.routes import user, job, admin
from fastapi.middleware.cors import CORSMiddleware
from app._config.uploadConfig import cloudinary_config

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:19006"] for Expo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(user.router)
app.include_router(job.router)
app.include_router(admin.router)

@app.get('/')
def getState():
    return{"message":"app is running"}