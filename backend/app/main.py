from fastapi import FastAPI, File, UploadFile, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import cloudinary
import cloudinary.uploader
import uuid
import os
from uuid import UUID


app = FastAPI()

origins = [
    "http://localhost:5500",
]


cloudinary.config(
    cloud_name = "dinsq9enp",
    api_key = "476395443636281",
    api_secret = "mdSDXnMPjUFnWpbluJ7XgRxZ8ko"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Model

class Memorie(BaseModel):
    id: UUID
    titulo: str 
    descripcion: str
    mood: str | int
    url: str | None = None
    image_url: str | None = None

#Endpoints

@app.post("/memorie")
async def post_memorie(
    titulo: str = Form(...),
    descripcion: str = Form(...),
    mood: int = Form(...),
    url: str | None = Form(None),
    image: UploadFile | None = File(None),
):
    memorie_id = uuid.uuid4()
    image_url = None

    if image.filename:
        cloudinary_result = cloudinary.uploader.upload(
            image.file,
            public_id = f"memorie_{memorie_id}"
        )
        image_url = cloudinary_result["secure_url"]
    
    memorie = Memorie(id=memorie_id, titulo=titulo, descripcion=descripcion, mood=mood, url=url, image_url=image_url)

    return {
        "memorie": memorie.model_dump()
    }
