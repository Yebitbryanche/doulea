### Douleia Documentation

## A Job Recommendation mobile application
A full-stack mobile/web application that connects users with job opportunities using personalized recommendations. The frontend is built with React, while the backend API is powered by FastAPI.

### Features

- User authentication
- Job recommendations
- Job search and filtering
- Notifications system
- User profile management
- Job Application


## Tech Stack

Frontend:
- React / React Native
- Expo
- TypeScript

Backend:
- FastAPI
- SQLAlchemy
- MySQL

Cloud / Tools:
- Github
- Cloudinary

## Installation 

### Clone repository
```bash
git clone https://github.com/Yebitbryanche/doulea
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
## Backend Setup

# Mac & Linux
```bash
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

cd app

uvicorn main:app -host:0.0.0.0 -port:8000 --reload
```
# Windows
```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

cd app

uvicorn main:app -host:0.0.0.0 -port:8000 --reload
```

## API Documentation

Swagger Docs:
http://localhost:8000/docs

ReDoc:
http://localhost:8000/redoc


## Usage

1. Register/Login
2. Create profile
3. Browse jobs
4. Apply to jobs
5. Receive recommendations