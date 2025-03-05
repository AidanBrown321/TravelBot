# Travel Swipe App Backend

This is the backend for the Travel Swipe App, built with FastAPI and SQLAlchemy.

## Setup

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the server:

```bash
cd backend
uvicorn app.main:app --reload
```

4. Access the API documentation at http://localhost:8000/docs

## API Endpoints

- `GET /destinations`: Get a list of destinations
- `POST /destinations`: Create a new destination
- `POST /swipe`: Record a swipe action
- `GET /recommendations/{user_id}`: Get recommendations for a user
