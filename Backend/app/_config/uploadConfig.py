import cloudinary
from config import settings

cloudinary_config = cloudinary.config( 
  cloud_name = settings.CLOUD_NAME, 
  api_key = settings.CLOUDINARY_API_KEY, 
  api_secret = settings.CLOUDINARY_API_SECRET
)