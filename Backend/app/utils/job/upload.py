import cloudinary.uploader as uploader
from sentence_transformers import SentenceTransformer

async def upload_file(file):
    image_file = await file.read()
    result = uploader.upload(image_file)
    return result["secure_url"]


model = SentenceTransformer("all-MiniLM-L6-v2")

def generate_embedding(job):
    text = f"{job.title} {job.description} {' '.join(job.category)}"
    return model.encode(text).tolist()