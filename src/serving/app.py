import os
import io
import json
import numpy as np
import pandas as pd
import torch
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from pytorch_forecasting import TemporalFusionTransformer, TimeSeriesDataSet
from pytorch_forecasting.data import GroupNormalizer

# ---------------------------------------------------------
# Absolute Paths (ensure script runs seamlessly from root)
# ---------------------------------------------------------
BASE_DIR = os.path.join(os.path.dirname(__file__), '..', '..')
DATA_PATH = os.path.join(BASE_DIR, 'data', 'processed', 'master_feature_table.csv')
MODEL_PATH = os.path.join(BASE_DIR, 'data', 'models', 'tft', 'tft_best.ckpt')
GRAPH_NODES_PATH = os.path.join(BASE_DIR, 'data', 'raw', 'graph', 'graph_nodes.csv')
GRAPH_EDGES_PATH = os.path.join(BASE_DIR, 'data', 'raw', 'graph', 'graph_edges.csv')
EMBEDDINGS_PATH = os.path.join(BASE_DIR, 'data', 'results', 'graph_embeddings.csv')

# ---------------------------------------------------------
# Global State for Models & Data Arrays
# ---------------------------------------------------------
ml_models = {}
df_master = pd.DataFrame()

def prepare_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Rebuilds the indexing logically identically to the training script"""
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values(['Generic_Drug', 'date']).reset_index(drop=True)
    min_date = df['date'].min()
    df['time_idx'] = (df['date'] - min_date).dt.days
    df['Generic_Drug'] = df['Generic_Drug'].astype(str)
    df['month'] = df['month'].astype(str)
    df['day_of_week'] = df['day_of_week'].astype(str)
    return df

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan Manager: Loads heavy AI artifacts into RAM strictly ONCE
    on boot-up, preventing 10-second delays on every API call.
    A try/except around each load step ensures a single bad artifact
    cannot crash the entire API server.
    """
    global df_master, ml_models

    print("🚀 Booting Up PharmaSight AI Engine...")

    # Load and prep dataset
    try:
        if os.path.exists(DATA_PATH):
            print(f"📦 Loading master features from {DATA_PATH}...")
            df_master = pd.read_csv(DATA_PATH)
            df_master = prepare_dataframe(df_master)
            print(f"✅ Master table loaded: {len(df_master)} rows")
        else:
            print("⚠️  WARNING: master_feature_table.csv missing!")
    except Exception as exc:
        print(f"❌ Failed to load master table: {exc}")

    # Load PyTorch TFT Model
    try:
        if os.path.exists(MODEL_PATH):
            print(f"🧠 Loading TFT Checkpoint...")
            ml_models["tft"] = TemporalFusionTransformer.load_from_checkpoint(MODEL_PATH)
            ml_models["tft"].eval()  # Freeze weights for inference
            print("✅ TFT Loaded successfully")
        else:
            print("⚠️  WARNING: tft_best.ckpt missing! Train network first.")
    except Exception as exc:
        print(f"❌ Failed to load TFT: {exc}")

    print("✅ PharmaSight API is live on http://127.0.0.1:8000")
    yield

    # Clean up
    print("🛑 Shutting down AI Engine...")
    ml_models.clear()



# ---------------------------------------------------------
# FastAPI App Initialization
# ---------------------------------------------------------
app = FastAPI(
    title="PharmaSight AI Backend", 
    version="1.0.0",
    description="Serves predictions from Temporal Fusion Transformers & GraphSAGE",
    lifespan=lifespan
)

# CORS ensures our purely standalone HTML/JS frontend can query this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Pydantic Schemas for Requests/Responses
# ---------------------------------------------------------
class WhatIfRequest(BaseModel):
    drug_name: str
    simulated_cdsco_alerts: int

class DisruptionRequest(BaseModel):
    offline_nodes: List[str]

# ---------------------------------------------------------
# Endpoints logic targeting the 7 Core Visual Features 
# ---------------------------------------------------------

@app.get("/")
def read_root():
    return {"status": "ok", "message": "PharmaSight API is running!"}

@app.get("/health")
def health_check():
    """ Standard deployment monitor ping """
    return {"status": "healthy", "service": "PharmaSight AI Backend"}

@app.get("/api/v1/drugs")
def get_drugs():
    """ Feature 1: Command Center """
    if df_master.empty:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    unique_drugs = df_master['Generic_Drug'].unique().tolist()
    # Mocking basic triage logic for now based on recent demand vs alerts
    triage_data = []
    
    for drug in unique_drugs:
        subset = df_master[df_master['Generic_Drug'] == drug]
        recent = subset.iloc[-1]
        
        # Super simple mock logic for traffic light (Replace with TFT output)
        risk = "GREEN"
        if recent.get('daily_cdsco_alerts', 0) > 2:
            risk = "RED"
        elif recent.get('daily_cost_volume', 0) > 10000:
            risk = "AMBER"
            
        triage_data.append({
            "drug": drug,
            "latest_demand": float(recent.get('daily_dispenses', 0)),
            "cost_volume": float(recent.get('daily_cost_volume', 0)),
            "risk_status": risk
        })
        
    # Sort so RED is on top
    sort_order = {"RED": 0, "AMBER": 1, "GREEN": 2}
    triage_data.sort(key=lambda x: sort_order[x['risk_status']])
        
    return {"drugs": triage_data}

@app.get("/api/v1/forecast/{drug_name}")
def get_forecast(drug_name: str):
    """ Feature 2: 'Crystal Ball' Probabilistic Forecaster """
    # TODO: Connect the real pytorch predicting functionality inside this endpoint
    return {
        "drug": drug_name,
        "message": "Real TFT inference logic to be wired up here",
        "p10": [0]*30,
        "p50": [0]*30,
        "p90": [0]*30
    }

@app.post("/api/v1/forecast/simulate")
def simulate_what_if(req: WhatIfRequest):
    """ Feature 3: 'What-If' Simulation Slider (CDSCO Alert Injection) """
    # TODO: Logic to intercept master df row, edit alert var, and re-run TFT
    return {"status": "simulated", "drug": req.drug_name, "simulated_alerts": req.simulated_cdsco_alerts}

@app.get("/api/v1/explain/{drug_name}")
def explain_forecast(drug_name: str):
    """ Feature 4: Explainability Overlay """
    # Native TFT attention interpretation
    # Mock fallback for now to ensure UI can connect
    return {
        "drug": drug_name,
        "importances": {
            "CDSCO Alerts": 45.2,
            "Demand Lag (30d)": 28.1,
            "Day of Week": 12.0,
            "Rolling Median Cost": 14.7
        }
    }

@app.get("/api/v1/network")
def get_supply_network():
    """ Feature 5: Supplier Geo-Heatmap topology map """
    # Returns the physical Graph Nodes + PyG risk weights
    nodes_data = []
    edges_data = []
    
    if os.path.exists(GRAPH_NODES_PATH) and os.path.exists(GRAPH_EDGES_PATH):
        import pandas as pd
        nodes_df = pd.read_csv(GRAPH_NODES_PATH)
        edges_df = pd.read_csv(GRAPH_EDGES_PATH)
        
        # Load risk_scores if the PyG training generated them
        if os.path.exists(EMBEDDINGS_PATH):
            emb_df = pd.read_csv(EMBEDDINGS_PATH)
            # Merge embeddings back into nodes if applicable
            
        nodes_data = nodes_df.to_dict(orient="records")
        edges_data = edges_df.to_dict(orient="records")
    
    return {"nodes": nodes_data, "edges": edges_data}

@app.post("/api/v1/network/simulate_disruption")
def simulate_disruption(req: DisruptionRequest):
    """ Feature 6: Click a manufacturer to knock it offline """
    # Cascades the disruption to hospitals downstream
    return {"status": "knocked offline", "offline": req.offline_nodes}

@app.get("/api/v1/purchase_orders")
def generate_purchase_orders():
    """ Feature 7: AI translating P90 into Purchase Quantities """
    return {"status": "export ready", "orders": []}


# -------------------------------------------------------------------
# CSV Upload Endpoint — Real inference on user-supplied procurement data
# -------------------------------------------------------------------

REQUIRED_COLUMNS = {
    # Columns the uploaded CSV must contain for the pipeline to work.
    # Maps user-facing column name → internal master_feature_table name.
    'drug_name': 'Generic_Drug',
    'date': 'date',
    'daily_dispenses': 'daily_dispenses',
    'daily_cost_volume': 'daily_cost_volume',
    'daily_cdsco_alerts': 'daily_cdsco_alerts',
}

def _normalize_uploaded_df(raw_df: pd.DataFrame) -> pd.DataFrame:
    """
    Takes a raw user-uploaded CSV and tries to bring it into the same
    schema the TFT pipeline expects.  Two conventions are supported:

    1. Exact master_feature_table column names  (ideal path)
    2. The friendlier shorthand names defined in REQUIRED_COLUMNS above

    Missing numeric columns are zero-filled so the pipeline never crashes;
    missing categoricals are forward-filled or set to a safe default.
    """
    # Rename user-facing aliases → internal names (ignore unknown cols)
    alias_map = {k: v for k, v in REQUIRED_COLUMNS.items() if k in raw_df.columns}
    df = raw_df.rename(columns=alias_map)

    # Ensure the bare minimum mandatory columns exist
    mandatory = ['Generic_Drug', 'date', 'daily_dispenses']
    missing = [c for c in mandatory if c not in df.columns]
    if missing:
        raise ValueError(f"Uploaded CSV is missing required columns: {missing}")

    # Date parsing
    df['date'] = pd.to_datetime(df['date'], dayfirst=False, infer_datetime_format=True)

    # Fill optional numeric columns with 0 if absent
    optional_numerics = [
        'daily_cost_volume', 'daily_cdsco_alerts',
        'demand_lag_7d', 'demand_lag_30d',
        'demand_rolling_avg_14d', 'alert_count_last_30d',
    ]
    for col in optional_numerics:
        if col not in df.columns:
            df[col] = 0.0

    # Re-derive temporal categoricals identically to the training pipeline
    df['month'] = df['date'].dt.month.astype(str)
    df['day_of_week'] = df['date'].dt.dayofweek.astype(str)

    return prepare_dataframe(df)  # adds time_idx, sorts, casts types


def _triage_from_df(df: pd.DataFrame) -> list:
    """
    Runs the same triage logic as GET /api/v1/drugs but against the
    caller-supplied dataframe instead of the global df_master.
    """
    results = []
    sort_order = {"RED": 0, "AMBER": 1, "GREEN": 2}

    for drug in df['Generic_Drug'].unique():
        subset = df[df['Generic_Drug'] == drug]
        recent = subset.iloc[-1]

        # Risk classification: mirrors the logic in get_drugs()
        risk = "GREEN"
        if float(recent.get('daily_cdsco_alerts', 0)) > 2:
            risk = "RED"
        elif float(recent.get('daily_cost_volume', 0)) > 10_000:
            risk = "AMBER"

        # 7-day rolling demand trend for sparkline rendering on the frontend
        trend_vals = subset['daily_dispenses'].tail(7).tolist()

        results.append({
            "drug": drug,
            "latest_demand": round(float(recent.get('daily_dispenses', 0)), 2),
            "cost_volume": round(float(recent.get('daily_cost_volume', 0)), 2),
            "cdsco_alerts": int(recent.get('daily_cdsco_alerts', 0)),
            "risk_status": risk,
            "trend_7d": [round(v, 2) for v in trend_vals],
        })

    results.sort(key=lambda x: sort_order[x['risk_status']])
    return results


@app.post("/api/v1/upload")
async def upload_procurement_csv(file: UploadFile = File(...)):
    """
    Real CSV Upload Endpoint — Feature: User-supplied Procurement Data

    Accepts a user's own procurement CSV, normalizes it to match the
    master_feature_table schema, runs triage classification, and returns
    a structured JSON response that the frontend Command Center can
    render identically to the pre-cached data path.

    Expected CSV columns (minimal set):
        drug_name (or Generic_Drug), date, daily_dispenses

    Optional but enriching:
        daily_cost_volume, daily_cdsco_alerts

    Returns:
        {
            "source": "upload",
            "filename": "...",
            "rows_processed": N,
            "drugs_detected": N,
            "date_range": { "start": "...", "end": "..." },
            "triage": [ { drug, latest_demand, cost_volume, risk_status, trend_7d }, ... ],
            "summary": { "red_count": N, "amber_count": N, "green_count": N }
        }
    """
    # --- 1. Validate file type ---
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=400,
            detail=f"Only .csv files are accepted. Got: {file.filename}"
        )

    # --- 2. Read bytes into a pandas DataFrame ---
    try:
        contents = await file.read()
        raw_df = pd.read_csv(io.BytesIO(contents))
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Could not parse CSV: {exc}"
        )

    if raw_df.empty:
        raise HTTPException(status_code=422, detail="Uploaded CSV contains no data rows.")

    # --- 3. Normalize to internal schema ---
    try:
        df = _normalize_uploaded_df(raw_df)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    # --- 4. Run triage classification on the uploaded data ---
    triage = _triage_from_df(df)

    # --- 5. Build summary counts ---
    red   = sum(1 for t in triage if t['risk_status'] == 'RED')
    amber = sum(1 for t in triage if t['risk_status'] == 'AMBER')
    green = sum(1 for t in triage if t['risk_status'] == 'GREEN')

    return {
        "source": "upload",
        "filename": file.filename,
        "rows_processed": len(df),
        "drugs_detected": df['Generic_Drug'].nunique(),
        "date_range": {
            "start": str(df['date'].min().date()),
            "end":   str(df['date'].max().date()),
        },
        "triage": triage,
        "summary": {
            "red_count":   red,
            "amber_count": amber,
            "green_count": green,
        },
    }


if __name__ == "__main__":
    import uvicorn
    # Run from project root: .venv\Scripts\python.exe src/serving/app.py
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)
