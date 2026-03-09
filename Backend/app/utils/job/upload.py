import cloudinary.uploader as uploader

async def upload_file(file):
    image_file = await file.read()
    result = uploader.upload(image_file)
    return result["secure_url"]