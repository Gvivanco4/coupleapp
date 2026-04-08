from pydantic import BaseModel, Field
from datetime import datetime, timezone, date
from uuid import UUID
from lib.enums.app_enums import MemberStatus

class CoupleMember(BaseModel):
    id: UUID
    couple_id: UUID
    user_id = UUID
    created_at = datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at = datetime
    status = MemberStatus

class Couple(BaseModel):
    id: UUID
    title: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    anniversary: date = Field(default_factory=date.today)
