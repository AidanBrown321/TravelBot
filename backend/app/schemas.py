from pydantic import BaseModel
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