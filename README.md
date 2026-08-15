# ♿ Accessible Journey Planner — Backend (M1)

A 5-day hackathon MVP for accessible tourism travel recommendations, real-time barrier mapping, route estimation, and weather integration.

## 📁 Repository Structure

```text
journey-planner/
│
├── backend/
│   ├── __init__.py
│   ├── main.py                  # M1 FastAPI app & middleware
│   ├── models.py                # M1 Pydantic models
│   │
│   ├── routers/                 # M1 Routers
│   │   ├── __init__.py
│   │   ├── places.py            # GET /places, GET /places/{id}
│   │   ├── recommendations.py   # POST /recommend
│   │   └── barriers.py          # POST /barriers, GET /barriers
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── places.py            # M1 Places service
│   │   ├── barriers.py          # M1 Barriers service
│   │   └── recommendation.py    # M2 Recommendation engine (preserved)
│   │
│   ├── maps.py                  # M3 Maps integration (untouched)
│   ├── route.py                 # M3 Route integration (untouched)
│   ├── weather.py               # M3 Weather integration (untouched)
│   ├── external_data.py         # M3 External data helper (untouched)
│   ├── test_maps.py             # M3 Test (untouched)
│   ├── test_route.py            # M3 Test (untouched)
│   ├── test_weather.py          # M3 Test (untouched)
│   └── test_external_data.py   # M3 Test (untouched)
│
├── frontend/
│   └── app.py                   # M4 Streamlit Frontend UI
│
├── data/
│   ├── places.json              # Accessible places database
│   └── barriers.json            # Temporary barrier reports database
│
├── tests/                       # M1 Automated Unit & Integration Tests
│   ├── __init__.py
│   ├── test_places.py
│   ├── test_barriers.py
│   └── test_api.py
│
├── pyproject.toml
├── requirements.txt
└── README.md
```

---

## 👥 Team Roles

- **M1 (Backend & API Foundation)**: FastAPI application, routing, models, services (`places.py`, `barriers.py`), orchestration, error handling, tests.
- **M2 (Recommendation Engine)**: Scoring rules in `backend/services/recommendation.py`.
- **M3 (Maps / Routes / Weather)**: OpenStreetMap Nominatim geocoding (`maps.py`), OSRM routing (`route.py`), Open-Meteo weather (`weather.py`).
- **M4 (Frontend)**: Streamlit app (`frontend/app.py`).

---

## ⚡ API Endpoints (M1)

- `GET /` - Root endpoint
- `GET /health` - API health check
- `GET /places` - List all places with active barrier counts
- `GET /places/{place_id}` - Get details of a specific place
- `POST /recommend` - Calculate accessibility-aware journey recommendations
- `POST /barriers` - Report a temporary barrier
- `GET /barriers` - List reported temporary barriers

---

## 🚀 Running the Project

### 1. Install Dependencies

```bash
uv pip install -r requirements.txt
```

### 2. Run M1 Backend API

You can start the backend server using any of the following options:

**Option A (Using `uv` - Recommended):**
```bash
uv run uvicorn backend.main:app --reload
```

**Option B (Using Python directly):**
```bash
python -m uvicorn backend.main:app --reload
```

**Option C (After activating the virtual environment):**
```bash
# In Git Bash:
source .venv/Scripts/activate

# In PowerShell:
.venv\Scripts\activate

# Then run:
uvicorn backend.main:app --reload
```

- API Base URL: `http://127.0.0.1:8000`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`

---

### 3. Run M1 Tests

```bash
uv run pytest tests/test_places.py tests/test_barriers.py tests/test_api.py
```

---

### 4. Run M4 Streamlit Frontend (Optional)

In a separate terminal:

```bash
uv run streamlit run frontend/app.py
```

- Frontend URL: `http://localhost:8501`
