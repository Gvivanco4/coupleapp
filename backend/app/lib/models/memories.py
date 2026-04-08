from pydantic import BaseModel, Field
from uuid import UUID
from lib.enums.app_enums import ContentType, Mood

class MemorieContent(BaseModel):
    id: UUID
    memorie_id: UUID
    content_type: ContentType
    url: str
    text: str | None

class Memories(BaseModel):
    id: UUID
    couple_id: UUID
    title: str
    mood: Mood
    description: str
    score: int = Field(ge=1, le=10)

