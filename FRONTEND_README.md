# PharmaSight Frontend

A production-ready, AI-powered drug shortage prediction and supply chain intelligence dashboard built with Next.js 15, TypeScript, and Tailwind CSS.

## Overview

PharmaSight Frontend is an immersive, interactive dashboard that connects to your backend ML inference pipeline (running on localhost:8000) to provide real-time drug shortage predictions, financial risk analysis, and supply chain optimization.

## Key Features

### 1. **CSV Intelligence Engine** (PRIMARY FEATURE)
- Drag-and-drop CSV upload interface
- Real-time TFT (Temporal Fusion Transformer) inference pipeline
- On-the-fly data parsing and prediction
- Fresh predictions from your raw procurement data

### 2. **Command Center**
- Real-time drug triage table
- Risk status visualization (GREEN/AMBER/RED)
- 7-day trend sparklines
- CDSCO alert tracking
- Live vs. Uploaded data switching

### 3. **Financial Risk Analytics**
- Projected dollars at risk KPI
- Units in deficit calculations
- Days to critical shortage metric
- Visual impact indicators

### 4. **Crystal Ball Forecaster**
- 30-day probabilistic forecasts
- P10/P50/P90 confidence intervals
- Interactive drug selector
- Area chart visualization

### 5. **What-If Regulatory Simulator**
- CDSCO alert injection (0-10 scale)
- Supply delay simulation (0-30 days)
- Demand surge multiplier (0.5x-2.0x)
- Real-time forecast re-computation

### 6. **Deep Learning Explainability**
- TFT neural network attention weights
- Feature importance visualization
- Doughnut chart with percentages
- Detailed feature explanations

### 7. **Supplier Network Simulator**
- Supply chain network visualization
- Click-to-disrupt supplier functionality
- Cascading impact analysis
- Risk score color coding

### 8. **Purchase Order Ledger**
- AI-recommended purchase orders
- Batch selection and export to CSV
- Priority-based sorting
- Cost analysis

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with custom glassmorphism theme
- **State Management**: Zustand
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm/yarn
- Backend running on `localhost:8000`

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

### Development

```bash
# Start development server
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run start
```

## Backend Integration

The frontend connects to your backend at `http://localhost:8000` using these 9 endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Root health |
| `/health` | GET | Backend health check |
| `/api/v1/drugs` | GET | Pre-cached drug data |
| `/api/v1/upload` | POST | CSV upload & TFT inference |
| `/api/v1/forecast/{drug}` | GET | 30-day forecast |
| `/api/v1/forecast/simulate` | POST | What-if simulation |
| `/api/v1/explain/{drug}` | GET | Explainability weights |
| `/api/v1/network` | GET | Supplier network graph |
| `/api/v1/network/simulate_disruption` | POST | Disruption simulator |
| `/api/v1/purchase_orders` | GET | Purchase recommendations |

### CORS Configuration

The Next.js config includes rewrites to proxy API calls to `localhost:8000`, avoiding CORS issues in development.

## Emergency Demo Mode

If the backend is offline or unreachable:

1. The app automatically switches to **Emergency Demo Mode**
2. All features continue to work with mock data
3. You can manually toggle demo mode with the "Demo" button in the navbar
4. All interactions are fully functional

## Design System

### Colors
- **Primary Blue**: `#00c2ff`
- **Accent Amber**: `#ffb800`
- **Status Red**: `#ff3b5c`
- **Status Green**: `#00e5a0`
- **Accent Purple**: `#a855f7`

### Design Patterns
- Glassmorphism cards with backdrop blur
- Smooth Framer Motion animations
- Responsive grid layouts
- Dark mode (default) with light mode toggle
- Semantic design tokens via CSS variables

## Key Components

```
/app
  /page.tsx              # Landing/branding page
  /dashboard
    /page.tsx           # Main dashboard
    layout.tsx
/components
  /dashboard
    Navbar.tsx          # Top navigation with controls
    TabNavigation.tsx   # Feature tab switcher
    CommandCenter.tsx   # CSV upload + drug table
    FinancialRisk.tsx   # KPI metrics
    CrystalBallForecaster.tsx   # 30-day forecast
    SimulationSliders.tsx       # What-if scenarios
    ExplainabilityDoughnut.tsx  # Feature importance
    SupplierGeoMap.tsx          # Network visualization
    PurchaseOrderLedger.tsx     # Order management
    CSVUploadZone.tsx           # Drag-drop interface
/store
  appStore.ts           # Zustand global state
/utils
  api.ts               # API client
  format.ts            # Formatting utilities
  constants.ts         # App constants
  emergencyData.ts     # Mock data for demo mode
```

## Environment Variables

No environment variables are required for local development. The app defaults to `localhost:8000` for the backend.

For production, you can override the API URL:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## Features & Functionality

### 1. Theme Toggle
- Dark mode (default) and light mode
- Persistent preference in localStorage
- CSS variable-based theming

### 2. Responsive Design
- Mobile-first approach
- Tablets and desktop optimization
- Touch-friendly controls
- Collapsible navigation

### 3. Real-Time Updates
- Health checks every 30 seconds
- Automatic fallback to demo mode
- Manual demo mode toggle
- Live data / Uploaded data switching

### 4. Data Handling
- **Zero data mocking in live mode**: All data flows through backend
- CSV upload with TFT inference
- Graceful error handling
- Loading states for all async operations

## Performance Optimization

- React Compiler enabled for automatic optimization
- Cache Components for static content
- Responsive images and lazy loading
- Optimized Recharts visualizations
- Efficient Zustand state updates

## Mobile Support

- Fully responsive dashboard
- Touch-friendly controls
- Optimized table scrolling
- Adaptive layouts for small screens
- Mobile-optimized navigation

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables (Production)

```bash
NEXT_PUBLIC_API_URL=https://your-backend.com
```

## Troubleshooting

### Backend Connection Issues
- Ensure backend is running on `localhost:8000`
- Check browser console for API errors
- App will auto-enable demo mode if backend unreachable
- Use the "Demo" button in navbar to manually toggle

### Data Not Loading
- Verify backend endpoints are responding
- Check network tab in browser DevTools
- Ensure CSV file format matches backend expectations
- Try the demo mode to verify frontend functionality

### Styling Issues
- Clear `.next` folder: `rm -rf .next`
- Rebuild CSS: `npm run build`
- Check Tailwind CSS configuration in `tailwind.config.ts`

## API Response Examples

### CSV Upload Response
```json
{
  "source": "upload",
  "filename": "procurement.csv",
  "rows_processed": 450,
  "drugs_detected": 8,
  "date_range": "2025-01-01 to 2025-01-31",
  "triage": [{
    "drug": "Paracetamol",
    "risk_status": "AMBER",
    "latest_demand": 320,
    "cost_volume": 64000,
    "cdsco_alerts": 1,
    "trend": [2500, 2400, 2200, 2000, 1900, 1800, 1750]
  }],
  "summary": {
    "red_count": 2,
    "amber_count": 2,
    "green_count": 4,
    "avg_risk": 0.45
  }
}
```

### Forecast Response
```json
{
  "drug": "Paracetamol",
  "message": "Forecast available",
  "p10": [
    {"date": "2025-01-01", "value": 800},
    ...
  ],
  "p50": [...],
  "p90": [...]
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## License

Proprietary - PharmaSight AI

## Support

For issues or questions, refer to the main project documentation or contact your PharmaSight team.
