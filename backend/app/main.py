from fastapi import FastAPI
from pydantic import BaseModel
from app.lib.models.memories import Memories
from uuid import UUID

app = FastAPI()

memories = []

@app.post("/memories/potd")
async def upload_potd(memorie: Memories):
    memories.append(memorie)
    print(memories)
    return

@app.get("/memories/potd/{memorie_id}")
async def get_potd(memorie_id: UUID):
    potd = next(potd for potd in memories if memorie_id == potd.id)
    return potd

@app.get("/memories/potds/{couple_id}")
async def get_potds(couple_id: UUID):
    potds = [potd for potd in memories if couple_id == potd.couple_id]
    print(potds)
    return potds

    
