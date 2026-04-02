# PharmaSight - AI Powered Drug Shortage Prediction

🚀 **Frontend is now complete and production-ready!** See [PROJECT_COMPLETE.md](PROJECT_COMPLETE.md) for a complete overview.

## Quick Start (5 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start backend (if running locally)
# In your backend directory: python src/serving/app.py

# 3. Start frontend
npm run dev

# 4. Open in browser
# http://localhost:3000
```

See [QUICK_START.md](QUICK_START.md) for detailed setup instructions.

---

## Project Overview

PharmaSight is an **AI-powered pharmaceutical supply chain intelligence platform** that forecasts drug shortages and optimizes procurement. The system combines:

- **Temporal Fusion Transformer (TFT)** for multi-horizon probabilistic forecasting
- **GraphSAGE** for supply chain cascade risk modeling
- **Conformal Calibration** for uncertainty quantification
- **Real-time Interactive Dashboard** with 7 feature tabs

### Platform Architecture

**Backend** (Python FastAPI)
- TFT inference pipeline
- GraphSAGE supply chain model
- 9 REST API endpoints
- Runs on `localhost:8000`

**Frontend** (Next.js 15 + TypeScript)
- 7 interactive dashboard tabs
- CSV TFT inference integration
- Real-time what-if simulation
- Supply chain network visualization
- Production-ready UI/UX

---

## 🎯 Dashboard Features

### ✅ 7 Interactive Tabs

1. **Command Center** - CSV upload + drug triage table
2. **Financial Risk** - Projected dollars at risk KPI
3. **Crystal Ball** - 30-day probabilistic forecasts
4. **What-If Simulator** - CDSCO alerts & supply disruptions
5. **Explainability** - TFT feature importance
6. **Supplier Map** - Network visualization & disruption
7. **Purchase Orders** - AI-recommended orders

### ✅ Core Capabilities

- **CSV Drag-and-Drop Upload** - Real-time TFT inference (PRIMARY FEATURE)
- **Probabilistic Forecasts** - P10/P50/P90 confidence intervals
- **Supply Chain Simulation** - What-if scenarios with real-time updates
- **Network Visualization** - Supplier disruption analysis
- **Emergency Demo Mode** - Works perfectly without backend
- **Dark/Light Theme** - Persistent preference toggle

---

## 📊 Backend Integration

All 9 endpoints fully integrated:

| Endpoint | Purpose |
|----------|---------|
| `/health` | Health check |
| `/api/v1/drugs` | Drug data |
| `/api/v1/upload` | **CSV + TFT inference (PRIMARY)** |
| `/api/v1/forecast/{drug}` | 30-day forecast |
| `/api/v1/forecast/simulate` | What-if simulation |
| `/api/v1/explain/{drug}` | Explainability weights |
| `/api/v1/network` | Supplier network |
| `/api/v1/network/simulate_disruption` | Disruption simulator |
| `/api/v1/purchase_orders` | Purchase recommendations |

---

## 🎨 Technology Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 15 |
| Language | TypeScript 5.3 |
| Styling | Tailwind CSS 4 |
| State | Zustand |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| HTTP | Axios |

---

## 📚 Documentation

**Start here:** [PROJECT_COMPLETE.md](PROJECT_COMPLETE.md) - Complete overview (10 min read)

### All Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| [PROJECT_COMPLETE.md](PROJECT_COMPLETE.md) | **Complete overview - START HERE** | 10m |
| [QUICK_START.md](QUICK_START.md) | Setup & running (5 min) | 5m |
| [FRONTEND_README.md](FRONTEND_README.md) | Feature documentation | 20m |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment | 30m |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Technical reference | 30m |
| [BUILD_SUMMARY.md](BUILD_SUMMARY.md) | Build overview | 15m |
| [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) | Verification checklist | 20m |
| [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) | Doc guide | 10m |

---

## 🚀 Deployment Options

- **Vercel** (recommended) - `vercel`
- **Docker** - `docker build -t pharmasight .`
- **Ubuntu/Debian** - Traditional server + PM2
- **AWS Elastic Beanstalk** - Serverless scaling
- **Google Cloud Run** - Container-based

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides.

---

## ✅ Production Ready

- ✅ TypeScript strict mode
- ✅ Proper error handling
- ✅ Security best practices
- ✅ Performance optimized
- ✅ Responsive design
- ✅ Accessibility compliant
- ✅ 7 comprehensive guides (3,000+ lines)

---

## System Architecture

**5-Layer Pipeline:**

1. **Input Layer** - CSV transactions (Drug, NDC, Order Qty, Supplier)
2. **Feature Layer** - Static embeddings + known future + observed past
3. **Model Layer** - Temporal Fusion Transformer for multi-horizon forecasting
4. **Graph Layer** - GraphSAGE for supply chain cascade risk
5. **Output Layer** - Forecasts, reorder quantities, alerts, export POs

---

## Next Steps

1. **Read** [PROJECT_COMPLETE.md](PROJECT_COMPLETE.md) (10 minutes)
2. **Follow** [QUICK_START.md](QUICK_START.md) (5 minutes to set up)
3. **Open** http://localhost:3000 in your browser
4. **Explore** all 7 feature tabs
5. **Upload** a CSV to see TFT predictions
6. **Deploy** using [DEPLOYMENT.md](DEPLOYMENT.md)

---

## Support

- 📖 **Documentation**: See guides above
- 🐛 **Issues**: Check browser console (F12)
- 💬 **Questions**: See [FRONTEND_README.md](FRONTEND_README.md) troubleshooting

---

**Status**: ✅ Production-Ready  
**Last Updated**: April 2, 2026  
**Frontend Version**: 1.0.0

*PharmaSight - AI-Powered Drug Shortage Prediction & Supply Chain Intelligence*
