from fastapi import FastAPI, File, UploadFile, Form, Query, Path, Depends, HTTPException
from typing import Annotated
from pydantic import BaseModel, Field, AfterValidator
from fastapi.middleware.cors import CORSMiddleware
import cloudinary
import cloudinary.uploader
import uuid
import os
from uuid import UUID
from datetime import datetime, timezone
from pathlib import Path as FilePath

from sqlmodel import Field, Session, SQLModel, create_engine, select
from contextlib import asynccontextmanager

origins = [
    "https://naneigonza.netlify.app",
]

def load_env_file() -> None:
    env_path = FilePath(__file__).resolve().parents[1] / ".env"
    if not env_path.exists():
        return

    for raw_line in env_path.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip("\"'")

        # Keep explicitly exported env vars as the source of truth.
        os.environ.setdefault(key, value)


load_env_file()

# Database

sqlite_file_name = "couple_app.db"
sqlite_url = f"sqlite:////data/{sqlite_file_name}"
database_url = os.getenv("DATABASE_URL")

connect_args = {"check_same_thread": False} if database_url.startswith("sqlite") else {}
engine = create_engine(database_url, echo=True, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)


def get_cloudinary_config() -> tuple[str, str, str]:
    cloud_name = (
        os.getenv("CLOUDINARY_CLOUD_NAME")
        or os.getenv("CLOUDINARY_NAME")
        or os.getenv("CLOUD_NAME")
    )
    api_key = os.getenv("CLOUDINARY_API_KEY") or os.getenv("COUDLIFE_ID")
    api_secret = os.getenv("CLOUDINARY_API_SECRET") or os.getenv("COUDLIFE_KEY")

    missing_vars = []
    if not cloud_name:
        missing_vars.append("CLOUDINARY_CLOUD_NAME")
    if not api_key:
        missing_vars.append("CLOUDINARY_API_KEY")
    if not api_secret:
        missing_vars.append("CLOUDINARY_API_SECRET")

    if missing_vars:
        missing_list = ", ".join(missing_vars)
        raise RuntimeError(
            f"Missing Cloudinary configuration in backend/.env: {missing_list}"
        )

    return cloud_name, api_key, api_secret


cloud_name, api_key, api_secret = get_cloudinary_config()

cloudinary.config(
    cloud_name=cloud_name,
    api_key=api_key,
    api_secret=api_secret,
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
    mood: int
    image_url: str | None = None
    created_at: datetime = Field(default_factory=datetime.now)

class SQLMemorie(SQLModel, table=True):
    __tablename__ = 'memories'
    id: UUID = Field(primary_key=True)
    titulo: str = Field(index=True)
    descripcion: str
    mood: int
    image_url: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)

#Validations

def check_title_in_db(titulo:str):

    if titulo is None:
        return titulo
    if titulo not in [t['titulo'] for t in memories]:
        raise ValueError('No hay ningun post con este titulo')
    return titulo

def check_memorie_id_in_db(id:UUID):
    memorie = SessionDep.get(SQLMemorie, id)
    if not memorie:
        raise ValueError('No existe el memorie con ese ID')
    return id
    
#Endpoints



@app.post("/memorie")
async def post_memorie(
    session: SessionDep,
    titulo: str = Form(...),
    descripcion: str = Form(...),
    mood: int = Form(...),
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
    
    memorie = Memorie(id=memorie_id, titulo=titulo, descripcion=descripcion, mood=mood, image_url=image_url)
    memorie_db = SQLMemorie(**memorie.model_dump())

    session.add(memorie_db)
    session.commit()
    session.refresh(memorie_db)
    print(f"OUTPUT FASTAPI POST{memorie_db}")

    return memorie_db

# GET POSTS

@app.get("/memories")
async def get_posts(
    session: SessionDep,
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
    memories_db = session.exec(select(SQLMemorie)).all()
    print(f"OUTPUT FASTAPI GET{memories_db}")
    sort_list = sorted(memories_db, key=lambda x: x.created_at, reverse=True)
    return sort_list

# DELETE POST

@app.delete("/memorie/{memorie_id}")
async def delete_memorie(session: SessionDep, memorie_id: UUID):
   memorie = session.get(SQLMemorie, memorie_id)

   if not memorie:
       raise HTTPException(status_code=404, detail="No se ha encontrado la memoria")
   
   session.delete(memorie)
   session.commit()

   return {"ok": True}

# UPDATE POST

@app.put("/memorie/{memorie_id}")
async def update_memorie(
    session: SessionDep,
    memorie_id: UUID,
    titulo: str = Form(...),
    descripcion: str = Form(...),
    mood: int = Form(...),
    image: UploadFile | None = File(None)
    ):
        mem = session.get(SQLMemorie, memorie_id)

        if not mem:
            raise HTTPException(status_code=404, detail="La memoria no se ha encontrado")
        image_url = None
        if image.filename:
            cloudinary_result = cloudinary.uploader.upload(
                image.file,
                public_id = f"memorie_{memorie_id}"
            )
            image_url = cloudinary_result["secure_url"]
        
        memorie = Memorie(id=memorie_id, titulo=titulo, descripcion=descripcion, mood=mood, image_url=image_url)
        memorie_db = SQLMemorie(**memorie.model_dump())

        mem.sqlmodel_update(memorie_db)
        session.add(mem)
        session.commit()
        session.refresh(mem)

        
        print(f"OUTPUT FASTAPI POST{mem}")

        return mem
