from pydantic import BaseModel, Field, field_validator
from uuid import uuid4
from typing import Optional


def _gen_key():
    """Generate a unique keys for the storage URI"""
    return str(uuid4())[:8]


class User(BaseModel):
    id: str
    email: str

class Cover(BaseModel):
    filename: str
    id: str

class CreateAlbumRequest(BaseModel):
    label: str
    description: Optional[str] = None
    cover: Optional[Cover] = None

class Album(BaseModel):
    label: str
    id: str
    src: str
    description: Optional[str] = None


class PhotoRequest(BaseModel):
    filename: str
    width: int
    height: int


class SignedPut(BaseModel):
    filename: str
    url: str
    id: str
