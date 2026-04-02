# PharmaSight - AI Powered Drug Shortage Prediction

## Project Overview
PharmaSight is an AI-powered predictive platform designed to forecast drug shortages within a hospital pharmacy supply chain. By utilizing a multi-horizon forecasting approach (7/14/30/45 days) with probabilistic outputs (P10/P50/P90), the system enables preemptive procurement strategies and mitigates the risk of critical medical stockouts. 

## System Architecture Details
The platform executes through a distinct 5-layer pipeline:
1. **Input Layer:** Fuses CSV transactions covering Drug Name, NDC Code, Order Qty/Dates, Dispensing Rates, Supplier interactions, and OpenFDA historical shortages.
2. **Feature Layer:** Generates Static Embeddings, Known Future inputs (Festival calendar, scheduled deliveries), and Observed Past states (ERP stock level, rolling demand averages).
3. **Model Layer (Temporal Fusion Transformer):** Leverages Variable Selection Networks and LSTM Encoders to forecast multi-horizon demand while enforcing strict uncertainty bounds via Conformal Calibration.
4. **Graph Layer (GraphSAGE):** Models dynamic supply chain cascade risk across interconnected Manufacturer, Distributor, and Hospital nodes, pushing a disruption Risk Score per drug to the TFT.
5. **Output Layer:** Triggers the 45-day traffic light forecast, Reorder Quantities, Supplier Alerts, and a programmatic Export Purchase Order CSV.

## Key UI/Demo Capabilities
- **Explore Probabilistic Forecast Fan:** Navigate P10/P50/P90 confidence boundaries. Use the built-in Service Level Slider (e.g., 95%) to instantly calculate required Optimal Safety Stocks for dynamic re-ordering.
- **Variable Selection Explainability:** Interrogate the TFT's deep logic visually via a Variable Importance Panel ('Lead time variance is the #1 risk signal at 38%').
- **Supplier Disruption Simulation:** Explore the visual supplier graph. Toggle nodes offline to trace cascade network failures live across the ecosystem.

## Local Development and Setup
This project uses public/instant-access proxy datasets mapped through specific generator scripts representing Indian markets and topology structures. See `docs/step_by_step_instructions.md` to replicate the setup in under 48 hours.
