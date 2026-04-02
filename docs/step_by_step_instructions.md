# 48-Hour Execution Roadmap

Follow these step-by-step instructions to rebuild, train, and validate the PharmaSight engine.

## Phase 1 (Day 1): Data Synthesis and Feature Architecture

1. **Initialize Workspace Environment:**
   - Execute `pip install -r requirements.txt` (once initialized) inside a virtual environment.
   
2. **Retrieve Core Event Markers:**
   - Execute `python src/ingestion/pull_openfda.py` to automatically paginated-query historical shortage events directly from OpenFDA.
   
3. **Generate Synthetic/Regional Dependencies:**
   - Place the downloaded Synthea `.csv` bundle containing `medications.csv` into `data/raw/synthea/`.
   - Execute `python scripts/generate_cdsco.py` to scaffold regional quality alerts mimicking the Indian market (NSQ alerts). The output is intentionally raw and "messy".
   - Execute the cleaning ETL wrapper: `python src/preprocessing/clean_cdsco.py` to normalize the scrape.
   - Execute `python scripts/generate_supplier_index.py` to build the baseline correlation dictionaries mapping items to generic fallback suppliers.
   - Execute `python scripts/generate_supplier_graph.py` to systematically scaffold the Manufacturer > Distributor > Hospital B2B dependencies into `data/raw/graph/` required for the GraphSAGE network.

4. **Build Unified Output Vectors:**
   - Execute `python src/preprocessing/build_master_table.py`. This processes Synthea-scale demands aligned with CDSCO/OpenFDA signal windows, calculating time-series variables (running totals, lag variables).

## Phase 2 (Day 2): Training and Backend Prototyping

1. **Establish Baselines (Crucial Step for Comparison):**
   - Execute `python src/models/baselines/run_baselines.py` to configure and capture LightGBM/ARIMA basic run metrics as your primary comparison sheet.

2. **Train GraphSAGE Network (Supplier Cascade Modelling):**
   - Execute GraphSAGE pipeline located in `src/models/graph/train_graphsage.py` to project supplier nodes and hospital demands into actionable localized vulnerability embeddings (Risk Scores).
   
3. **Execute Temporal Fusion Transformer (TFT):**
   - Execute `python src/models/tft/train_model.py`. This merges standard input parameters alongside Graph Layer risk-score embedding, training the primary P10/P50/P90 boundaries for continuous 45-day horizons.
   
4. **Boot Up API & Demonstrate UI Integration (5-Step Live Script):**
   - Initialize FastAPI service: `cd src/serving && uvicorn app:app --reload`.
   - Complete the evaluation strictly following the 5-Step Demo Setup: CSV Load > Explore Safety Stock via Slider > Variable Selection Overview > Interactive Disruption Toggles > Gen Purchase Orders.
