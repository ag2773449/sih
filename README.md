

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
