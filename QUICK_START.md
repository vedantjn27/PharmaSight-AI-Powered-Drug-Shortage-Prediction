# PharmaSight Frontend - Quick Start Guide

Get the PharmaSight dashboard running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
# or
pnpm install
```

## Step 2: Start Backend (if not running)

Open a terminal and ensure your backend is running on `localhost:8000`:

```bash
# In your backend directory
python src/serving/app.py
# or
uvicorn src.serving.app:app --host 0.0.0.0 --port 8000 --reload
```

Verify backend is running: http://localhost:8000/health

## Step 3: Start Frontend Development Server

```bash
npm run dev
# or
pnpm dev
```

The dashboard will open at **http://localhost:3000**

## Step 4: Explore the Dashboard

1. **Landing Page** - See the product overview
2. **Enter Dashboard** - Click the button or navigate to http://localhost:3000/dashboard
3. **CSV Upload** - Drag & drop a procurement CSV file
4. **View Results** - See predictions from TFT inference pipeline

## Quick Demo

### Without Backend
If your backend isn't running, the app will automatically enable **Demo Mode**:
- All features work with simulated data
- Click the "Demo" button in navbar to toggle
- All interactions are fully functional

### With Backend
Upload a CSV file to see real TFT predictions:
- Expected format: Time-series procurement data
- Backend parses CSV and runs inference pipeline
- Results appear instantly in Command Center

## Key Shortcuts

| Feature | Location | How to Access |
|---------|----------|---------------|
| CSV Upload | Command Center | Drag & drop zone at top |
| Theme Toggle | Navbar | Sun/Moon icon (top right) |
| Demo Mode | Navbar | Demo button (top right) |
| Drug Selector | Forecaster/Explainability | Dropdown selector |
| Export POs | Purchase Orders | Select orders, click Export |

## Features at a Glance

### Tab 1: Command Center 🔌
- Upload CSV (PRIMARY FEATURE)
- View drug triage table
- See 7-day trends
- Risk status color coding

### Tab 2: Financial Risk 💰
- Dollars at risk KPI
- Units in deficit
- Days to critical shortage
- Visual impact summary

### Tab 3: Crystal Ball Forecaster 🔮
- 30-day predictions
- P10/P50/P90 confidence bands
- Select any drug
- Interactive area chart

### Tab 4: What-If Simulator 🎮
- Adjust CDSCO alerts (0-10)
- Adjust supply delay (0-30 days)
- Adjust demand multiplier (0.5x-2.0x)
- See real-time impact

### Tab 5: Explainability 🧠
- Feature importance doughnut
- TFT attention weights
- Understand predictions
- Select drug to analyze

### Tab 6: Supplier Map 🗺️
- Network visualization
- Click suppliers to disrupt
- See cascading impacts
- Risk score colors

### Tab 7: Purchase Orders 🛒
- AI-recommended orders
- Select and export to CSV
- Priority sorting
- Cost analysis

## Troubleshooting

### "Backend Offline" Warning
✓ This is normal if backend isn't running
✓ Demo mode will activate automatically
✓ Click "Demo" button to toggle manually

### CSV Upload Not Working
✓ Ensure backend is running on localhost:8000
✓ Check file is valid CSV format
✓ Look for error message in upload zone

### Data Not Showing
✓ Try refreshing the page
✓ Check browser console (F12) for errors
✓ Enable demo mode to verify frontend works

### Styling Issues
✓ Clear cache: Cmd/Ctrl + Shift + R
✓ Rebuild: `npm run build`
✓ Check that Tailwind CSS is processing

## Environment Setup

```bash
# Optional: Set backend URL for production
echo "NEXT_PUBLIC_API_URL=https://your-backend.com" > .env.local
```

Default: `http://localhost:8000` (auto-configured)

## Production Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t pharmasight-frontend .
docker run -p 3000:3000 pharmasight-frontend
```

### Manual
```bash
npm run build
npm start
```

## File Structure Overview

```
📁 app/
  📄 page.tsx          ← Landing page
  📁 dashboard/
    📄 page.tsx        ← Main dashboard
    📄 layout.tsx

📁 components/
  📁 dashboard/
    📄 CommandCenter.tsx       ← CSV upload + table
    📄 FinancialRisk.tsx       ← KPI metrics
    📄 CrystalBallForecaster.tsx ← Forecast
    📄 SimulationSliders.tsx   ← What-if
    📄 ExplainabilityDoughnut.tsx ← Feature importance
    📄 SupplierGeoMap.tsx      ← Network map
    📄 PurchaseOrderLedger.tsx ← Orders
    📄 Navbar.tsx              ← Top nav
    📄 TabNavigation.tsx       ← Tab switcher
    📄 CSVUploadZone.tsx       ← Upload handler

📁 store/
  📄 appStore.ts       ← Global state (Zustand)

📁 utils/
  📄 api.ts            ← API client
  📄 format.ts         ← Formatting helpers
  📄 constants.ts      ← App constants
  📄 emergencyData.ts  ← Demo data

📄 tailwind.config.ts  ← Styling config
📄 globals.css         ← Global styles
📄 next.config.ts      ← Next.js config
📄 tsconfig.json       ← TypeScript config
```

## Common Tasks

### Change API URL
Edit `next.config.ts` rewrites section:
```typescript
destination: 'https://your-backend:port/api/v1/:path*'
```

### Add New Drug to Demo
Edit `src/utils/emergencyData.ts` → `EMERGENCY_DRUGS` array

### Customize Colors
Edit `app/globals.css` → `:root` CSS variables

### Modify Animations
Edit `tailwind.config.ts` → `keyframes` section

## Performance Tips

- Demo mode with 8 drugs loads in ~500ms
- Real CSV processing depends on backend
- Charts render smoothly on modern browsers
- Framer Motion animations are GPU-accelerated

## Next Steps

1. ✅ Start dev server (`npm run dev`)
2. ✅ Visit http://localhost:3000
3. ✅ Explore landing page
4. ✅ Upload a CSV (or use demo mode)
5. ✅ Explore all 7 feature tabs
6. ✅ Check backend health (Navbar)
7. ✅ Try what-if scenarios
8. ✅ Export purchase orders

## Need Help?

1. Check FRONTEND_README.md for detailed docs
2. See component files for code comments
3. Review API responses in `src/utils/api.ts`
4. Check browser console for error messages
5. Enable demo mode to isolate frontend issues

---

**Happy analyzing! 🚀**

PharmaSight - AI-Powered Drug Shortage Prediction
