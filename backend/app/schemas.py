from pydantic import BaseModel, EmailStr
from typing import List, Optional

class DestinationBase(BaseModel):
    name: str
    image_url: str
    description: str

class DestinationCreate(DestinationBase):
    pass

class Destination(DestinationBase):
    id: int

    class Config:
        orm_mode = True

class SwipeBase(BaseModel):
    user_id: int
    destination_id: int
    swipe_value: str  # "yes", "no", or "maybe"

class SwipeCreate(SwipeBase):
    pass

class Swipe(SwipeBase):
    id: int

    class Config:
        orm_mode = True 

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None