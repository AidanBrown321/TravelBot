from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, auth
from .database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from .auth import ACCESS_TOKEN_EXPIRE_MINUTES

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

# Auth routes
@app.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    db_email = db.query(models.User).filter(models.User.email == user.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user = Depends(auth.get_current_active_user)):
    return current_user

# Protected routes - update existing endpoints to require authentication
# For example:
@app.post("/swipe")
def create_swipe(swipe: schemas.SwipeCreate, current_user: models.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    db_swipe = models.Swipe(**swipe.dict(), user_id=current_user.id)
    db.add(db_swipe)
    db.commit()
    db.refresh(db_swipe)
    return db_swipe