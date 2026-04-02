# PharmaSight Frontend - File Reference Guide

Quick reference for all key files in the project.

## Documentation Files (Read These First!)

### Start Here
| File | Purpose | Read Time | Priority |
|------|---------|-----------|----------|
| [README.md](README.md) | Project overview | 5 min | FIRST |
| [PROJECT_COMPLETE.md](PROJECT_COMPLETE.md) | Executive summary | 10 min | SECOND |
| [QUICK_START.md](QUICK_START.md) | Setup instructions | 5 min | THIRD |

### Detailed Guides
| File | Purpose | Read Time | When to Read |
|------|---------|-----------|---|
| [FRONTEND_README.md](FRONTEND_README.md) | Complete feature documentation | 20 min | Before using features |
| [VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md) | Testing checklist | 15 min | Before deploying |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Deployment options | 30 min | When deploying |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Technical deep-dive | 30 min | Before modifying code |
| [RELEASE_NOTES.md](RELEASE_NOTES.md) | Version info & features | 15 min | For release info |

### Reference Docs
| File | Purpose | When to Read |
|------|---------|---|
| [FEATURES_SHOWCASE.md](FEATURES_SHOWCASE.md) | Visual feature guide | For marketing/demos |
| [BUILD_SUMMARY.md](BUILD_SUMMARY.md) | Build overview | For understanding build process |
| [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) | Implementation steps | For development |
| [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) | All documentation | For navigation |
| [FILE_REFERENCE.md](FILE_REFERENCE.md) | This file | For quick lookup |

---

## Configuration Files

### Setup & Build
| File | Purpose | Edit? |
|------|---------|-------|
| `package.json` | Dependencies & scripts | Only add deps |
| `tsconfig.json` | TypeScript configuration | No |
| `next.config.ts` | Next.js configuration | No |
| `tailwind.config.ts` | Tailwind CSS configuration | Only add tokens |
| `postcss.config.js` | PostCSS configuration | No |
| `.env.example` | Environment variables template | No |
| `.env.local` | Your local environment (create this) | Yes |
| `.gitignore` | Git ignore rules | Only if needed |

---

## Application Files

### Root Level
| File | Purpose | Type |
|------|---------|------|
| `app/layout.tsx` | Root layout with fonts | Server Component |
| `app/page.tsx` | Landing page | Client Component |
| `app/globals.css` | **Design system (colors, tokens)** | CSS |

### Dashboard
| File | Purpose | Component Type |
|------|---------|---|
| `app/dashboard/layout.tsx` | Dashboard layout wrapper | Server Component |
| `app/dashboard/page.tsx` | Dashboard main page | Client Component |

### Dashboard Components (7 Features + Utilities)

#### Primary Feature
| File | Purpose | Lines |
|------|---------|-------|
| `components/dashboard/CSVUploadZone.tsx` | CSV drag-drop upload widget | ~230 |
| `components/dashboard/CommandCenter.tsx` | Drug triage table (CSV + live) | ~220 |

#### Feature Tabs
| File | Purpose | Lines |
|------|---------|-------|
| `components/dashboard/FinancialRisk.tsx` | KPI metrics card | ~175 |
| `components/dashboard/CrystalBallForecaster.tsx` | 30-day forecast chart | ~120 |
| `components/dashboard/SimulationSliders.tsx` | What-if simulator | ~150 |
| `components/dashboard/ExplainabilityDoughnut.tsx` | Feature importance chart | ~130 |
| `components/dashboard/SupplierGeoMap.tsx` | Network visualization | ~160 |
| `components/dashboard/PurchaseOrderLedger.tsx` | Purchase orders table | ~200 |

#### Navigation & Layout
| File | Purpose | Lines |
|------|---------|-------|
| `components/dashboard/Navbar.tsx` | Top navbar with theme/demo toggle | ~90 |
| `components/dashboard/TabNavigation.tsx` | Tab selector bar | ~45 |

---

## Utilities & State

### State Management
| File | Purpose | Key Functions |
|------|---------|---|
| `src/store/appStore.ts` | Zustand store (persisted) | `toggleDarkMode()`, `setEmergencyMode()`, `setActiveTab()` |

### API & Data
| File | Purpose | Key Functions |
|------|---------|---|
| `src/utils/api.ts` | Axios client + endpoints | `getDrugs()`, `uploadCSV()`, `getForecast()`, `simulateForecast()`, `getExplanation()`, `getNetwork()`, `simulateDisruption()`, `getPurchaseOrders()`, `checkBackendHealth()` |
| `src/utils/constants.ts` | Demo data, colors, tab config | `TAB_FEATURES`, `DEMO_DRUGS`, `COLORS` |
| `src/utils/emergencyData.ts` | Mock data for offline mode | `EMERGENCY_DRUGS`, `EMERGENCY_FORECAST`, `EMERGENCY_NETWORK` |
| `src/utils/format.ts` | Number/date formatting | `formatCurrency()`, `formatNumber()` |

### Types
| File | Purpose | Contains |
|------|---------|----------|
| `src/types/api.ts` | TypeScript interfaces | All API response types |

---

## Static Assets

### Images
```
public/
├── hero-pharma.jpg              # Hero section background
├── supply-chain.jpg             # Supply chain visualization
├── ai-prediction.jpg            # AI prediction background
├── dashboard-preview.jpg        # Dashboard screenshot
├── risk-analysis.jpg            # Risk analysis image
├── pharmasight-logo.jpg         # Logo image
├── feature-forecast.jpg         # Feature icon
├── feature-network.jpg          # Feature icon
├── feature-simulation.jpg       # Feature icon
├── feature-insights.jpg         # Feature icon
├── favicon.ico                  # Browser tab icon
└── sample-data.csv              # Test CSV file for upload
```

### CSV Format
Sample CSV structure (in `public/sample-data.csv`):
```
Date,Drug,NDC_Code,Order_Qty,Dispensing_Rate,Supplier,Lead_Time_Days,CDSCO_Alerts
2024-01-01,Paracetamol,5000001001,500,45,Supplier_A,7,0
```

---

## Code Organization Guide

### Where to Find Things

**I want to change the color scheme**
→ Edit `app/globals.css` (lines 20-60, design tokens)

**I want to add a new feature tab**
→ Create new component in `components/dashboard/`, add to `TAB_FEATURES` in `constants.ts`, add to dashboard/page.tsx switch statement

**I want to connect to a different backend**
→ Change `NEXT_PUBLIC_API_URL` in `.env.local`

**I want to modify the landing page**
→ Edit `app/page.tsx`

**I want to change dark mode colors**
→ Edit CSS variables in `app/globals.css` (look for `.dark` class)

**I want to add API endpoint**
→ Add function to `src/utils/api.ts`, use in component with `useEffect` or custom hook

**I want to add demo data**
→ Edit `src/utils/emergencyData.ts`

**I want to change button styles**
→ Edit button classes in `app/globals.css` (.button-primary, .button-secondary)

---

## File Dependencies

### Core Dependencies
```
app/page.tsx
  ├── app/globals.css (design tokens)
  ├── src/store/appStore.ts (dark mode, backend health)
  └── src/utils/api.ts (health check)

app/dashboard/page.tsx
  ├── components/dashboard/* (all 10 components)
  ├── src/store/appStore.ts (active tab, emergency mode)
  ├── src/utils/api.ts (health check)
  ├── src/utils/constants.ts (tab list)
  └── app/globals.css (design tokens)

CommandCenter.tsx
  ├── components/dashboard/CSVUploadZone.tsx
  ├── src/utils/api.ts (getDrugs, uploadCSV)
  ├── src/store/appStore.ts (emergencyMode, uploadedData)
  └── src/utils/emergencyData.ts (demo data)

All Components
  ├── app/globals.css (design tokens, classes)
  ├── Framer Motion (animations)
  ├── Recharts (charts)
  ├── Lucide React (icons)
  ├── Tailwind CSS (styling)
  └── src/store/appStore.ts (theme, mode)
```

---

## Development Workflow

### 1. Starting Development
```bash
# Terminal 1: Backend
cd src/serving
python app.py

# Terminal 2: Frontend
npm run dev
# Opens http://localhost:3000
```

### 2. Making Changes
- Edit component files in `components/dashboard/`
- Edit styles in `app/globals.css`
- Edit state in `src/store/appStore.ts`
- Edit constants in `src/utils/constants.ts`

### 3. Hot Reload
- Next.js auto-reloads on file save
- Check browser console (F12) for errors
- If stuck, restart dev server: Ctrl+C, `npm run dev`

### 4. Building for Production
```bash
npm run build
npm start
```

### 5. Testing
```bash
# Follow VERIFICATION_GUIDE.md
# Or run tests manually through browser
```

---

## Environment Variables

### Development (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

**Note**: `NEXT_PUBLIC_` prefix makes variable available in browser. Never use for secrets!

---

## Key Metrics

### File Counts
- **Total Files**: 50+
- **React Components**: 14 (all TypeScript)
- **Configuration Files**: 5
- **Documentation Files**: 11
- **Asset Files**: 12 images + 1 CSV
- **Lines of Code**: ~3,500 (excluding docs)

### Component Breakdown
- **Dashboard Components**: 10
- **Functional Lines**: ~1,400
- **Comment Lines**: ~200
- **Blank Lines**: ~400

### Documentation
- **Total Doc Lines**: 3,100+
- **Guides**: 5 major (Setup, Features, Deployment, Testing, Architecture)
- **References**: 6 supporting (Showcase, Build, Implementation, Release, Index, This file)

---

## Quick Navigation

### Find by Purpose

**Landing Page**: `app/page.tsx`

**Dashboard Layout**: `app/dashboard/page.tsx`

**CSV Upload**: `components/dashboard/CSVUploadZone.tsx`, `CommandCenter.tsx`

**Forecasts**: `components/dashboard/CrystalBallForecaster.tsx`

**What-If Simulation**: `components/dashboard/SimulationSliders.tsx`

**Explainability**: `components/dashboard/ExplainabilityDoughnut.tsx`

**Supplier Network**: `components/dashboard/SupplierGeoMap.tsx`

**Purchase Orders**: `components/dashboard/PurchaseOrderLedger.tsx`

**Dark/Light Mode**: `components/dashboard/Navbar.tsx` → `src/store/appStore.ts`

**Theme Colors**: `app/globals.css` (lines 20-60)

**API Calls**: `src/utils/api.ts`

**Demo Data**: `src/utils/emergencyData.ts`

**Configuration**: `src/utils/constants.ts`

---

## File Edit Frequency

### Frequently Modified (During Development)
- `src/utils/constants.ts` - Adding demo data
- `app/globals.css` - Tweaking colors/spacing
- `components/dashboard/*.tsx` - Feature development

### Occasionally Modified (Maintenance)
- `package.json` - Adding dependencies
- `.env.local` - Changing backend URL
- `src/utils/emergencyData.ts` - Updating demo data

### Rarely Modified (Stable)
- `app/layout.tsx` - Root structure
- `app/dashboard/layout.tsx` - Dashboard structure
- `tailwind.config.ts` - Tailwind config
- `tsconfig.json` - TypeScript config

### Never Modified (Don't Touch)
- `next.config.ts` - Build config
- `postcss.config.js` - CSS processing

---

## Deployment Checklist

### Files to Verify Before Deploy
- [ ] `.env` has production `NEXT_PUBLIC_API_URL`
- [ ] No `localhost:8000` hardcoded anywhere
- [ ] No `console.log()` statements in production code
- [ ] `package.json` has all dependencies
- [ ] `tsconfig.json` has strict mode enabled
- [ ] All documentation is up-to-date

### Build Verification
- [ ] `npm run build` completes without errors
- [ ] No unused imports
- [ ] No TypeScript errors
- [ ] Production bundle size reasonable

---

## Support

Need help finding something?

1. **Quick Lookup**: Use this file (you're reading it!)
2. **Setup Issues**: See [QUICK_START.md](QUICK_START.md)
3. **Feature Questions**: See [FRONTEND_README.md](FRONTEND_README.md)
4. **Technical Questions**: See [ARCHITECTURE.md](ARCHITECTURE.md)
5. **Testing Issues**: See [VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md)
6. **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Last Updated**: April 2, 2026  
**Version**: 1.0.0  
**Status**: Production Ready
