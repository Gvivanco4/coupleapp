from fastapi import FastAPI, File, UploadFile, Form, Query, Path
from typing import Annotated
from pydantic import BaseModel, Field, AfterValidator
from fastapi.middleware.cors import CORSMiddleware
import cloudinary
import cloudinary.uploader
import uuid
import os
from uuid import UUID
from datetime import datetime, timezone


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

memories = []

#Model

class Memorie(BaseModel):
    id: UUID
    titulo: str 
    descripcion: str
    mood: str | int
    url: str | None = None
    image_url: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now().isoformat())

#Validations

def check_title_in_db(titulo:str):

    if titulo is None:
        return titulo
    if titulo not in [t['titulo'] for t in memories]:
        raise ValueError('No hay ningun post con este titulo')
    return titulo
    
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

    memories.append(memorie.model_dump())
    print(memories)

    return {
        "memorie": memorie.model_dump()
    }

# GET POSTS

@app.get("/memories")
async def get_posts(
    mood: Annotated[int | None, Query(ge=1, le=10)] = None,
    titulo: Annotated[str | None, AfterValidator(check_title_in_db), Query(min_length=4, max_length=20)] = None,
):
    if mood and titulo:
        filtered_memories = [m for m in memories if mood == m['mood'] and titulo == m['titulo']]
        return filtered_memories
    if mood and not titulo:
        mood_filter = [m for m in memories if mood == m['mood']]
        return mood_filter
    if titulo and not mood:
        titulo_filter = [m for m in memories if titulo == m['titulo']]
        return titulo_filter
    return memories
