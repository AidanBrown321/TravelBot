# Travel Swipe App

A mobile application that allows users to discover travel destinations by swiping through cards, similar to dating apps but for travel destinations.

## Project Structure

This project consists of two main parts:

- `backend/`: FastAPI backend with SQLAlchemy for database operations
- `frontend/`: Expo/React Native frontend for the mobile application

## Features

- Swipe through destination cards (left = no, right = yes, top = maybe)
- View detailed information about destinations
- Save favorite destinations
- Get personalized recommendations (MVP version uses mock data)

## Setup Instructions

### Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the server:

```bash
uvicorn app.main:app --reload
```

5. Access the API documentation at http://localhost:8000/docs

### Frontend

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Use the Expo Go app on your mobile device to scan the QR code, or press 'a' to open in an Android emulator or 'i' to open in an iOS simulator.

## MVP Plan

This is an MVP (Minimum Viable Product) implementation based on the plan outlined in `MVP Plan Travel Swipe App.txt`. Future enhancements will include:

- User authentication
- AI-driven recommendations
- Integration with flight and hotel price APIs
- Weather forecasts for destinations
- Push notifications for price drops or new destinations
- Offline mode
