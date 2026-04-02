# PharmaSight Frontend - Verification Guide

Complete checklist to verify your PharmaSight frontend build is production-ready.

## Pre-Launch Verification (15 minutes)

### 1. Environment Setup
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Backend Python environment ready or can be started
- [ ] Project cloned and all dependencies installed (`npm install`)
- [ ] Create `.env.local` file with `NEXT_PUBLIC_API_URL=http://localhost:8000`

### 2. Local Development Start
```bash
# Terminal 1 - Backend (if running locally)
cd src/serving
python app.py
# Should show: "Uvicorn running on http://127.0.0.1:8000"

# Terminal 2 - Frontend
npm run dev
# Should show: "Local: http://localhost:3000"
```

### 3. Browser Testing (http://localhost:3000)

#### Landing Page (Before Dashboard)
- [ ] Page loads without errors (check Console: F12)
- [ ] Hero section visible with "Predict Drug Shortages" headline
- [ ] Animated background blobs are moving smoothly
- [ ] Stats section shows: 94%, <2s, 500+, 10K+
- [ ] "Enter Dashboard" button is clickable
- [ ] Problem/Solution sections scroll smoothly
- [ ] 8 feature cards display in grid layout
- [ ] Footer shows PharmaSight copyright
- [ ] Responsive on mobile (resize browser to <640px)

#### Navigation & Theme Toggle
- [ ] Scroll to top and click "Enter Dashboard" button
- [ ] Dashboard loads with Navbar at top showing "PharmaSight" logo
- [ ] Navbar has 3 control buttons:
  - [ ] Demo mode button (🚨 icon)
  - [ ] Dark/Light toggle (Moon/Sun icon)
  - [ ] Back to home button
- [ ] Click dark/light toggle and page theme changes immediately
- [ ] Refresh page - theme persists (dark mode is default)
- [ ] Navbar shows "Backend Connected" at bottom (green if connected)

### 4. Dashboard Tab Navigation
Tab bar should show all 7 tabs:
- [ ] Command Center (Zap icon)
- [ ] Financial Risk (TrendingDown icon)
- [ ] Crystal Ball (BarChart3 icon)
- [ ] What-If Simulator (Sliders icon)
- [ ] Explainability (Brain icon)
- [ ] Supplier Map (Network icon)
- [ ] Purchase Orders (ShoppingCart icon)

Clicking each tab:
- [ ] Tab underline animates (blue-to-purple gradient)
- [ ] Content area smoothly transitions (Framer Motion)
- [ ] No console errors when switching tabs

### 5. Command Center Tab Testing

#### CSV Upload Zone (Primary Feature)
- [ ] Large drop zone visible with "Drag & drop CSV here" message
- [ ] Dashed border and upload icon clearly visible
- [ ] Zone has glass-morphism effect
- [ ] Can click "Browse Files" button
- [ ] Select `public/sample-data.csv` file

#### After CSV Upload
- [ ] File upload completes successfully
- [ ] Shows: "Processing: X rows, Y unique drugs, Date range"
- [ ] Table populates with drug data:
  - [ ] Drug name column
  - [ ] Demand/Cost columns
  - [ ] Risk status color-coded (RED/AMBER/GREEN)
  - [ ] CDSCO alerts column
  - [ ] Sparkline 7-day trend chart
- [ ] Table is sortable by clicking column headers
- [ ] Table is responsive (scrolls horizontally on mobile)
- [ ] No console errors during data parsing

#### Live Data Switch
- [ ] Toggle between "Live Data" and "Uploaded Data" tabs
- [ ] Data refreshes when toggling
- [ ] API call shows in Network tab (if backend is running)

### 6. Financial Risk Tab
- [ ] Large KPI card displays "Projected Dollars Lost"
- [ ] Shows a dollar amount (or demo amount if offline)
- [ ] Number animation plays (counting up from 0)
- [ ] Background has subtle gradient
- [ ] Shows drug count breakdown below (RED/AMBER/GREEN)
- [ ] Status indicators are color-coded properly
- [ ] Card has glass-morphism styling

### 7. Crystal Ball Forecaster Tab
- [ ] Drug dropdown selector visible
- [ ] AreaChart displays with three lines:
  - [ ] P10 (lower bound) - lowest forecast
  - [ ] P50 (expected) - middle forecast
  - [ ] P90 (upper bound) - worst case
- [ ] Shaded area between P10 and P90 shows confidence interval
- [ ] Hover over chart shows tooltip with exact values
- [ ] Chart is fully responsive
- [ ] Legend toggles on/off correctly
- [ ] Y-axis shows "Units" label
- [ ] X-axis shows date progression

### 8. What-If Simulator Tab
- [ ] Three slider controls visible:
  - [ ] CDSCO Alerts (0-10 range)
  - [ ] Supply Delay (0-30 days)
  - [ ] Demand Multiplier (0.5x-2x)
- [ ] Sliders are draggable and show current values
- [ ] Forecast chart updates in real-time as sliders move
- [ ] "Reset to Baseline" button works
- [ ] Comparison before/after view (if space allows)
- [ ] Visual impact indicators show risk level changes

### 9. Explainability Tab
- [ ] DoughnutChart displays with colored segments
- [ ] Each segment represents a feature:
  - [ ] CDSCO Alerts
  - [ ] Demand Lag
  - [ ] Day of Week
  - [ ] Cost/Lead Time
- [ ] Percentages display correctly (add up to 100%)
- [ ] Legend shows all features
- [ ] Colors are distinct and readable
- [ ] Hover shows tooltip with exact percentages

### 10. Supplier Map Tab
- [ ] Network visualization displays (force-directed graph or nodes)
- [ ] Supplier nodes show as circles with labels
- [ ] Edges show connections between suppliers/hospitals
- [ ] Color coding shows risk status (RED/AMBER/GREEN)
- [ ] Click on node to toggle "offline" state
- [ ] Disruption effect animates (visual shockwave)
- [ ] Impact summary shows affected drugs
- [ ] "Reset Network" button works

### 11. Purchase Orders Tab
- [ ] Table displays AI-recommended purchase orders
- [ ] Columns: Drug, Units, Cost, Priority, Supplier
- [ ] Sortable columns (click headers)
- [ ] Action buttons visible (Export, Select All)
- [ ] "Export to CSV" button downloads file
- [ ] Batch selection works (checkboxes)
- [ ] Table is responsive

### 12. Emergency Demo Mode Testing

#### Enable Demo Mode
- [ ] Click "🚨 Demo" button in navbar
- [ ] Page shows "Demo Mode" status badge (amber/yellow)
- [ ] All data now comes from emergency mock data (no API calls)
- [ ] All 7 tabs continue to work perfectly
- [ ] Charts and animations display correctly
- [ ] No errors in console (check F12)

#### Backend Offline Simulation
- [ ] Stop Python backend (Ctrl+C in Terminal 1)
- [ ] Dashboard detects offline status
- [ ] "Backend Offline" message appears in navbar (red)
- [ ] Demo mode auto-enables
- [ ] Dashboard still fully functional
- [ ] No red error messages in UI

### 13. Dark/Light Mode Testing
- [ ] Toggle theme button repeatedly
- [ ] All colors change appropriately:
  - [ ] Background: dark gray → light gray
  - [ ] Text: light → dark
  - [ ] Cards: darker glass → lighter glass
- [ ] All tabs work in both themes
- [ ] Charts are readable in both themes
- [ ] Refresh page - theme persists
- [ ] Mobile responsive in both themes

### 14. Performance & Responsiveness
- [ ] Page load time <3 seconds (Network tab in DevTools)
- [ ] No console errors or warnings
- [ ] Animations are smooth (60fps, check in DevTools)
- [ ] Resize window - layout adapts smoothly
- [ ] Mobile view (<640px): Stack layouts, no horizontal scroll
- [ ] Tablet view (640-1024px): 2-column layouts
- [ ] Desktop view (>1024px): Full 3-4 column layouts

### 15. API Integration Testing

#### With Backend Running
- [ ] Open DevTools Network tab (F12 → Network)
- [ ] Navigate between tabs
- [ ] Verify API calls are made to:
  - [ ] `/health` (every 30 seconds)
  - [ ] `/api/v1/drugs` (on Command Center load)
  - [ ] `/api/v1/forecast/{drug}` (on Forecaster load)
  - [ ] `/api/v1/explain/{drug}` (on Explainability load)
  - [ ] `/api/v1/network` (on Supplier Map load)
  - [ ] `/api/v1/purchase_orders` (on Purchase Orders load)
- [ ] All requests return 200 status
- [ ] Response times are <2 seconds

#### CSV Upload API
- [ ] Upload sample CSV via Command Center
- [ ] Network tab shows POST to `/api/v1/upload`
- [ ] Request includes FormData with file
- [ ] Response includes parsed data
- [ ] Table populates with response data

#### Simulation API
- [ ] Move What-If simulator sliders
- [ ] Network tab shows POST to `/api/v1/forecast/simulate`
- [ ] Request includes alert/delay/multiplier parameters
- [ ] Response updates forecast in real-time

### 16. Error Handling
- [ ] Disconnect internet (simulate network error)
- [ ] API calls fail gracefully
- [ ] Error message appears (not red crash screen)
- [ ] Demo mode can be enabled manually
- [ ] Reconnect internet - page still works
- [ ] No persistent error state

### 17. Accessibility Check
- [ ] Use Tab key to navigate between elements
- [ ] All buttons are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Links have descriptive text (not "Click Here")
- [ ] Images have alt text
- [ ] Color contrast is readable (WCAG AA standard)
- [ ] Text is resizable (zoom in/out works)

### 18. Browser Compatibility
Test in all these browsers:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

All tests should pass in each browser.

## Post-Verification Checklist

### Files to Verify Exist
- [ ] `package.json` (dependencies installed)
- [ ] `app/page.tsx` (landing page)
- [ ] `app/dashboard/page.tsx` (dashboard)
- [ ] `components/dashboard/*.tsx` (all 10 components)
- [ ] `src/store/appStore.ts` (Zustand store)
- [ ] `src/utils/api.ts` (API client)
- [ ] `public/sample-data.csv` (test data)
- [ ] `public/*.jpg` (pharma images)
- [ ] `app/globals.css` (design system)
- [ ] `.env.example` (environment template)

### Code Quality Checks
```bash
# Check for TypeScript errors
npm run build

# Check console for warnings
npm run dev
# (Watch for warnings about missing dependencies, hydration mismatches)

# Check bundle size
npm run build
# Look for warnings about large chunks
```

### Final Launch Verification
- [ ] Run `npm run build` successfully (no errors)
- [ ] Run `npm run dev` - no console errors
- [ ] Load `http://localhost:3000` - page renders
- [ ] All tests above pass
- [ ] Ready for production deployment

## Production Deployment Checklist

Before deploying to Vercel/production:

### Environment Variables
- [ ] Set `NEXT_PUBLIC_API_URL` to production backend URL
- [ ] No hardcoded `localhost:8000` in code
- [ ] All secrets are in `.env` files (never committed)

### Security
- [ ] No console.log() statements remain in production code
- [ ] No debugging code remains
- [ ] API routes use proper error handling
- [ ] CORS is configured correctly on backend

### Performance
- [ ] Image optimization enabled (Next.js image)
- [ ] Dynamic imports for large components (code splitting)
- [ ] CSS is minified (automatic with Next.js)
- [ ] JavaScript is minified (automatic with Next.js)

### SEO
- [ ] `metadata` set in `layout.tsx`
- [ ] Title and description are accurate
- [ ] Open Graph tags added (if needed)
- [ ] Sitemap generated (if needed)

## Troubleshooting

### Common Issues

**"Backend Offline" always shown**
- [ ] Verify backend is running: `python src/serving/app.py`
- [ ] Verify backend is on port 8000
- [ ] Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- [ ] Check browser console (F12) for CORS errors

**CSV upload fails**
- [ ] Verify CSV format matches expected columns
- [ ] Check file size <10MB
- [ ] Verify backend health check passes first
- [ ] Check browser console for specific error message

**Dark mode doesn't persist**
- [ ] Check browser allows localStorage (Privacy settings)
- [ ] Check Zustand persist middleware is working
- [ ] Clear browser cache and try again

**Charts not displaying**
- [ ] Verify Recharts is installed: `npm ls recharts`
- [ ] Check data format matches expected schema
- [ ] Open console to see specific errors
- [ ] Try switching between light/dark mode

**Mobile layout broken**
- [ ] Check Tailwind responsive classes are used
- [ ] Verify viewport meta tag in layout.tsx
- [ ] Test in actual mobile device (not just browser resize)
- [ ] Check for overflow issues in terminal

## Success Criteria - All Tests Pass

When you can check all boxes above, your PharmaSight frontend is:
- ✅ Production-ready
- ✅ Fully integrated with backend
- ✅ Responsive on all devices
- ✅ Accessible to all users
- ✅ Performant (<3s load)
- ✅ Error-handled gracefully
- ✅ Ready for deployment

---

**Estimated Time**: 15-30 minutes for complete verification

**Need Help?** Check QUICK_START.md for setup issues or FRONTEND_README.md for feature details.
