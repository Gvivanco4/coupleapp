from pydantic import BaseModel, Field, EmailStr
from datetime import datetime, timezone, date, timedelta
from uuid import UUID
from lib.enums.app_enums import InviteStatus

class Invite(BaseModel):
    id: UUID
    couple_id: UUID
    email: EmailStr
    token: str
    status: InviteStatus
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at = datetime.now(timezone.utc) + timedelta(hours = 1)
    created_by: UUID
