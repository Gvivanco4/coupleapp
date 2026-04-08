from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

@app.post("/memories/potd")
async def upload_potd():
    return
