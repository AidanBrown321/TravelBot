from sqlalchemy import Column, Integer, String, ForeignKey
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