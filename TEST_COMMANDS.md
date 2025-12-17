# Commands to Test the Application

## 1. Start Backend (Docker)
```powershell
cd D:\Apps\scrapper
docker-compose up -d backend database redis
```

## 2. Wait for Backend to be Ready
```powershell
# Check backend is running
docker-compose ps backend

# Check backend logs (should show server started)
docker-compose logs backend --tail=20
```

## 3. Test Backend API Directly
```powershell
# Test health endpoint
curl http://localhost:3001/health

# Test companies endpoint (should return 20 companies)
$headers = @{"X-API-Key"="b93ddaf670fce54bca61037e49cffe546f33af159d4f34a948446603c4cfbd7a"}
Invoke-RestMethod -Uri "http://localhost:3001/api/v1/companies?limit=5" -Headers $headers | ConvertTo-Json -Depth 2
```

## 4. Start Frontend (Local Development)
```powershell
cd D:\Apps\scrapper\frontend
npm start
```

This will:
- Start React dev server on http://localhost:3000
- Use proxy from package.json to forward /api/* requests to http://localhost:3001
- The API key is already configured in api.js

## 5. Verify Everything Works
- Open browser to http://localhost:3000
- Should see homepage with stats
- Navigate to /companies to see company listings
- Check browser console for any errors

## Summary Status:
✅ Backend API: Running on port 3001, connected to Supabase (20 companies available)
✅ Frontend: Will run on port 3000, configured to use proxy to backend
✅ Supabase: Connected and returning data
