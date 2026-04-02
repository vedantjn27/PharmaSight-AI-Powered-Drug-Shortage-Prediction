# PharmaSight Frontend - Startup Checklist

Complete this checklist before running your PharmaSight frontend for the first time.

---

## Pre-Startup (5 minutes)

### Environment Verification
- [ ] Node.js 18+ installed
  ```bash
  node --version  # Should be v18.0.0 or higher
  ```
- [ ] npm available
  ```bash
  npm --version   # Should be 9.0.0 or higher
  ```
- [ ] Python 3.8+ (for backend)
  ```bash
  python --version  # For backend
  ```
- [ ] Git available (for version control)
  ```bash
  git --version
  ```

### Project Verification
- [ ] PharmaSight repo cloned
  ```bash
  ls -la  # Should show package.json, app/, components/, etc
  ```
- [ ] You're in the project root directory
  ```bash
  pwd  # Should end with /PharmaSight-AI-Powered-Drug-Shortage-Prediction
  ```

### Dependency Installation
- [ ] Dependencies installed
  ```bash
  npm install
  # Should complete without errors
  # Creates node_modules/ folder (~500MB)
  ```
- [ ] No installation errors
  ```bash
  npm list  # Should show all dependencies
  ```

---

## Configuration (3 minutes)

### Environment Setup
- [ ] Create `.env.local` file
  ```bash
  cp .env.example .env.local
  ```
- [ ] Set backend URL in `.env.local`
  ```
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```
- [ ] Verify .env.local exists
  ```bash
  cat .env.local  # Should show NEXT_PUBLIC_API_URL
  ```

### Optional: Backend Setup
Choose ONE:

**Option A: Run Backend Locally**
- [ ] Navigate to backend directory
  ```bash
  cd src/serving
  ```
- [ ] Verify app.py exists
  ```bash
  ls app.py  # Should exist
  ```
- [ ] Python environment ready (venv/poetry/etc)
- [ ] Verify backend can start (test in separate terminal)
  ```bash
  python app.py
  # Should show: "Uvicorn running on http://127.0.0.1:8000"
  ```
- [ ] Note: Keep this running while developing

**Option B: Use Remote Backend**
- [ ] Update `NEXT_PUBLIC_API_URL` to remote URL
  ```
  NEXT_PUBLIC_API_URL=https://your-backend.com
  ```
- [ ] Verify backend is accessible
  ```bash
  curl https://your-backend.com/health
  # Should return 200 response
  ```

**Option C: Use Demo Mode Only**
- [ ] No backend needed
- [ ] Demo mode will auto-enable when needed
- [ ] See Startup Troubleshooting below

---

## Before Running (2 minutes)

### File Integrity
- [ ] Check key files exist
  ```bash
  test -f app/page.tsx && echo "✓" || echo "✗"
  test -f app/dashboard/page.tsx && echo "✓" || echo "✗"
  test -f package.json && echo "✓" || echo "✗"
  test -f app/globals.css && echo "✓" || echo "✗"
  ```
- [ ] Check public assets
  ```bash
  ls public/sample-data.csv  # Sample CSV exists
  ls public/*.jpg | wc -l    # Should be 9 images
  ```
- [ ] Check components
  ```bash
  ls components/dashboard/*.tsx | wc -l  # Should be 10 files
  ```

### Port Availability
- [ ] Port 3000 is available (for frontend)
  ```bash
  # On macOS/Linux
  lsof -i :3000  # Should be empty
  
  # On Windows
  netstat -ano | findstr :3000  # Should be empty
  ```
- [ ] Port 8000 is available (for backend, if running locally)
  ```bash
  # On macOS/Linux
  lsof -i :8000  # Should be empty
  
  # On Windows
  netstat -ano | findstr :8000  # Should be empty
  ```

---

## Startup (2 steps)

### Step 1: Backend (Optional but Recommended)
In **Terminal 1**:
```bash
cd src/serving
python app.py
```
Wait for: `"Uvicorn running on http://127.0.0.1:8000"`

### Step 2: Frontend
In **Terminal 2**:
```bash
cd /path/to/project  # Go back to root if needed
npm run dev
```
Wait for: `"Local: http://localhost:3000"`

---

## Verification (30 seconds)

### Browser Launch
- [ ] Open browser to http://localhost:3000
- [ ] You should see the PharmaSight landing page
- [ ] Hero section with "Predict Drug Shortages Before They Happen"
- [ ] No error messages in console (press F12)

### Landing Page Check
- [ ] Page loads smoothly
- [ ] Animated background blobs are visible
- [ ] "Enter Dashboard" button is clickable
- [ ] Stats section shows 4 metrics
- [ ] Problem/Solution sections scroll smoothly
- [ ] 8 feature cards visible
- [ ] Footer visible at bottom

### Navigation Test
- [ ] Click "Enter Dashboard" button
- [ ] Dashboard page loads
- [ ] See navbar with PharmaSight logo
- [ ] See 7 tabs: Command Center, Financial Risk, Crystal Ball, etc.
- [ ] See animated background elements
- [ ] No console errors

### Backend Status Check
- [ ] Look in navbar at top-left
- [ ] If green dot: "Backend Connected" - Backend is running!
- [ ] If red indicator: Backend offline (Demo mode will enable)
- [ ] Both are fine - frontend works either way

---

## First Actions After Startup

### 1. Test CSV Upload (Primary Feature)
- [ ] Click "Command Center" tab (should be first)
- [ ] See large upload drop zone at top
- [ ] Drag `public/sample-data.csv` into drop zone (or click to browse)
- [ ] File uploads and table populates with drug data
- [ ] See columns: Drug, Demand, Cost, Risk Status, CDSCO Alerts
- [ ] Each row has a sparkline chart
- [ ] No errors in console

### 2. Test Theme Toggle
- [ ] Look in navbar (top-right area)
- [ ] Click Sun or Moon icon (dark/light toggle)
- [ ] Page background changes immediately
- [ ] All colors adjust to light theme
- [ ] Click again to return to dark theme
- [ ] Refresh page - theme persists

### 3. Test Tab Navigation
- [ ] Click each tab in order:
  - [ ] Command Center - CSV upload
  - [ ] Financial Risk - KPI metrics
  - [ ] Crystal Ball - 30-day forecast chart
  - [ ] What-If Simulator - Sliders
  - [ ] Explainability - Doughnut chart
  - [ ] Supplier Map - Network visualization
  - [ ] Purchase Orders - Order table
- [ ] Each tab loads without errors
- [ ] Content transitions smoothly

### 4. Test Emergency Demo Mode
- [ ] Click "🚨 Demo" button in navbar
- [ ] Status changes to "Demo Mode" (amber)
- [ ] All data now comes from mock data
- [ ] All tabs still work perfectly
- [ ] Close backend (Ctrl+C in Terminal 1)
- [ ] Frontend still works (demo data persists)
- [ ] This is how it works when backend is offline

---

## Common Startup Issues

### Issue: "Port 3000 already in use"
**Solution**:
```bash
# Find what's using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or use different port
npm run dev -- -p 3001  # Run on port 3001 instead
```

### Issue: "Backend not found"
**Solution**:
- [ ] Ensure backend is running in separate terminal
- [ ] Check backend is on `http://localhost:8000`
- [ ] See if error appears in browser console (F12)
- [ ] Click "🚨 Demo" button to enable demo mode
- [ ] Everything works in demo mode without backend

### Issue: "dependencies are missing"
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: "Can't find module '@/...' "
**Solution**:
- [ ] This is a TypeScript path alias error
- [ ] Verify `tsconfig.json` has correct baseUrl
- [ ] Restart dev server (Ctrl+C, npm run dev)
- [ ] If persists, see TROUBLESHOOTING section in QUICK_START.md

### Issue: "Blank white page"
**Solution**:
- [ ] Check browser console (F12) for errors
- [ ] Look for hydration errors
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Close dev server and restart (Ctrl+C, npm run dev)
- [ ] Try different browser (Chrome/Firefox/Safari)

### Issue: "Backend returns 404 errors"
**Solution**:
- [ ] Verify backend is running: `python app.py`
- [ ] Check `/health` endpoint in browser:
  ```
  http://localhost:8000/health
  ```
- [ ] Should return: `{"status": "healthy"}`
- [ ] If not found, backend may be on different port/URL
- [ ] Update `NEXT_PUBLIC_API_URL` in `.env.local`

---

## Success Indicators

You know everything is working when:

✅ **Landing Page**
- Loads in <2 seconds
- All animations are smooth
- No console errors

✅ **Dashboard**
- All 7 tabs visible and clickable
- Content transitions smoothly
- No 404 errors in Network tab (F12)

✅ **CSV Upload**
- Can drag CSV into upload zone
- Table populates with drug data
- Sparklines render correctly
- No data is hardcoded (comes from CSV)

✅ **Backend Integration**
- Network tab shows API calls to `/api/v1/*`
- Responses return 200 status
- Data appears in charts/tables

✅ **Theme Toggle**
- Light/Dark mode switches instantly
- Colors change appropriately
- Theme persists on refresh

✅ **Demo Mode**
- Works when backend is offline
- Shows demo data in all tabs
- All features function normally

✅ **Mobile Responsive**
- Resize browser to mobile size (320px)
- Content adapts and remains readable
- No horizontal scrolling
- Touch interactions work (if on mobile)

---

## Next Steps After Verification

### Short Term (Today)
1. Read [QUICK_START.md](QUICK_START.md) (5 min)
2. Read [FRONTEND_README.md](FRONTEND_README.md) (20 min)
3. Play with all 7 dashboard features
4. Test CSV upload with different files
5. Try the what-if simulator

### Medium Term (This Week)
1. Follow [VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md) for full testing
2. Customize colors in `app/globals.css` if desired
3. Update demo data in `src/utils/emergencyData.ts`
4. Prepare production backend URL

### Long Term (Before Deploy)
1. Follow [DEPLOYMENT.md](DEPLOYMENT.md) for deployment
2. Set up production environment variables
3. Run final verification checklist
4. Deploy to Vercel, Docker, or your server

---

## Getting Help

If you get stuck:

1. **Check Error in Console** (Press F12)
   - Read the error message carefully
   - Search the message in docs

2. **Check Documentation**
   - [QUICK_START.md](QUICK_START.md) - Setup issues
   - [FRONTEND_README.md](FRONTEND_README.md) - Feature questions
   - [VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md) - Testing issues

3. **Check Network Tab** (F12 → Network)
   - Are API calls being made?
   - What are the response status codes?
   - Are responses valid JSON?

4. **Restart Everything**
   - Stop frontend: Ctrl+C in Terminal 2
   - Stop backend: Ctrl+C in Terminal 1
   - Run again: `npm run dev` and `python app.py`

5. **Clear Cache**
   ```bash
   # Frontend
   npm run build
   npm run dev
   
   # Browser
   Ctrl+Shift+Delete (clear cache)
   Reload page: Ctrl+R
   ```

---

## Congratulations!

You've successfully set up the PharmaSight frontend!

Next: Read [QUICK_START.md](QUICK_START.md) or [FRONTEND_README.md](FRONTEND_README.md)

Questions? All answers are in the documentation files above.

---

**Estimated Total Time**: 15 minutes  
**Status**: Ready to Launch!

**Last Updated**: April 2, 2026  
**Version**: 1.0.0
