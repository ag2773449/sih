# ♿ Accessible Journey Planner

A basic 5-day hackathon MVP for recommending tourism destinations based on accessibility needs, route distance, weather, crowd level and temporary barrier reports.

## Stack

- Python
- FastAPI
- Streamlit
- Open-Meteo Weather API
- OpenStreetMap Nominatim geocoding
- OSRM routing
- JSON data storage

## Run

### 1. Create environment

```bash
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Start backend

```bash
uvicorn backend.main:app --reload
```

Backend:
http://127.0.0.1:8000

API docs:
http://127.0.0.1:8000/docs

### 4. Start frontend

Open a second terminal:

```bash
streamlit run frontend/app.py
```

Frontend:
http://localhost:8501

## Team split

- M1: FastAPI/backend
- M2: accessibility + recommendation engine
- M3: weather, geocoding and routing APIs
- M4: Streamlit frontend

## MVP

1. Accessibility profile
2. Destination search
3. Accessibility-aware recommendation
4. Weather information
5. Route distance/time
6. Temporary barrier reporting

Future versions can add authentication, databases, real-time crowd APIs, AI/RAG, voice assistance, mobile app and advanced GIS.
