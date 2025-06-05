from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class Destination(Base):
    __tablename__ = "destinations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    image_url = Column(String)
    description = Column(String)

class Swipe(Base):
    __tablename__ = "swipes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    destination_id = Column(Integer, ForeignKey("destinations.id"))
    swipe_value = Column(String)  # "yes", "no", or "maybe"

    destination = relationship("Destination") 

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    
    swipes = relationship("Swipe", back_populates="user")