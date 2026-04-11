from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException
from sqlmodel import select
from fastapi.security import OAuth2PasswordBearer
from pwdlib import PasswordHash
from db import SessionDep
from models.user import User
from config import settings
from jose import JWTError, jwt
from email.message import EmailMessage
from aiosmtplib import send



pwd_hash = PasswordHash.recommended()

def hash_password(password:str) -> str:
    hash= pwd_hash.hash(password)
    return str(hash)


def verifyPassword(password:str, password_hash):
    return pwd_hash.verify(password,password_hash)


oAuth_scheme = OAuth2PasswordBearer(tokenUrl='/users/signin')

# function to create access token
# --------
# --------

def create_access_token(data:dict,expires_delta:timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expires_in = datetime.now(timezone.utc) + expires_delta   # sets the expiry time for the future
    else:
        expires_in = datetime.now(timezone.utc) + timedelta(days = settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({'exp':expires_in})

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

### function to get and authenticate user
# ---------
# ---------

def authenticate_user (session:SessionDep, email:str, password:str):
    user = session.exec(select(User).where(User.email == email)).first()

    if not user:
        raise HTTPException(status_code=404, detail='user not found')
    
    if not verifyPassword(password, user.password_hash):
        raise HTTPException(status_code=401, detail="incorrect password")

    return user


# function to send document to email
async def send_document_email(user_name, email, phone, filename, content, content_type):
    msg = EmailMessage()
    msg["From"] = email
    msg["To"] = settings.EMAIL  # where employer docs go
    msg["Subject"] = f"New Employer Registration: {user_name}"
    msg.set_content(f"{user_name} ({email}, {phone}) registered as an employer.")

    maintype, subtype = content_type.split("/")
    msg.add_attachment(content, maintype=maintype, subtype=subtype, filename=filename)

    await send(
        msg,
        hostname="smtp.gmail.com",
        port=587,
        start_tls=True,
        username=settings.EMAIL,
        password=settings.EMAIL_PASSWORD  # Gmail App Password
    )


# function to secure all routes

def get_current_user(
    session: SessionDep,
    token: str = Depends(oAuth_scheme)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
    )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")

        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = session.exec(select(User).where(User.email == email)).first()

    if user is None:
        raise credentials_exception

    return user


