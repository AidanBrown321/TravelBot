from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas
from .database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Travel Swipe API")

# Add CORS middleware to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to Travel Swipe API"}

@app.get("/destinations", response_model=List[schemas.Destination])
def get_destinations(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    destinations = db.query(models.Destination).offset(skip).limit(limit).all()
    return destinations

@app.post("/destinations", response_model=schemas.Destination)
def create_destination(destination: schemas.DestinationCreate, db: Session = Depends(get_db)):
    db_destination = models.Destination(**destination.dict())
    db.add(db_destination)
    db.commit()
    db.refresh(db_destination)
    return db_destination

@app.post("/swipe", response_model=schemas.Swipe)
def post_swipe(swipe: schemas.SwipeCreate, db: Session = Depends(get_db)):
    db_swipe = models.Swipe(**swipe.dict())
    db.add(db_swipe)
    db.commit()
    db.refresh(db_swipe)
    return db_swipe

@app.get("/recommendations/{user_id}", response_model=List[schemas.Destination])
def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    # For MVP, just return some random destinations
    # In the future, this will be replaced with actual recommendation logic
    recommendations = db.query(models.Destination).limit(5).all()
    return recommendations 