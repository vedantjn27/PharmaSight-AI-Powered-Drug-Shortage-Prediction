import os
import io
import json
import numpy as np
import pandas as pd
import torch
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
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
    """
    global df_master, ml_models

    print("🚀 Booting Up PharmaSight AI Engine...")

    # Load and prep dataset
    if os.path.exists(DATA_PATH):
        print(f"📦 Loading master features from {DATA_PATH}...")
        df_master = pd.read_csv(DATA_PATH)
        df_master = prepare_dataframe(df_master)
    else:
        print("⚠️ WARNING: master_feature_table.csv missing!")

    # Load PyTorch TFT Model
    if os.path.exists(MODEL_PATH):
        print(f"🧠 Loading TFT Checkpoint (PyTorch)...")
        ml_models["tft"] = TemporalFusionTransformer.load_from_checkpoint(MODEL_PATH)
        ml_models["tft"].eval()  # Freeze weights for inference
        print("✅ TFT Loaded successfully")
    else:
        print("⚠️ WARNING: tft_best.ckpt missing! Train network first.")

    yield

    # Clean up (Optional)
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

if __name__ == "__main__":
    import uvicorn
    # Provide the full dotted path so it boots directly from the Phase 3 workspace root
    uvicorn.run("src.serving.app:app", host="127.0.0.1", port=8000, reload=True)
