from fastapi import FastAPI
from models import *
from db import create_db_and_tables
from routes import user
from fastapi.middleware.cors import CORSMiddleware

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

@app.get('/')
def getState():
    return{"message":"app is running"}