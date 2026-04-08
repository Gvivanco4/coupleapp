from enum import Enum

class ContentType(str, Enum):
    potd = "potd"

class Mood(str, Enum):
    in_love = "in love"
    angry = "angry"
    sad = "sad"
    melancolic = "melancolic"
    amazed = "amazed"
    happy = "happy"
    empowered = "empowered"

class InviteStatus(str, Enum):
    denied = "denied"
    accepted = "accepted"
    expired = "expired"
    in_progress = "in progress"

class MemberStatus(str, Enum):
    active = "active"
    inactive = "inactive"