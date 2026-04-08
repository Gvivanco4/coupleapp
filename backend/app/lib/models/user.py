from pydantic import BaseModel, Field, EmailStr
from datetime import datetime, timezone, date
from uuid import UUID
from lib.enums.app_enums import MemberStatus

class User(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    birthday: date