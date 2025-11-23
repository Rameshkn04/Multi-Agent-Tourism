# How to Test the API

## Quick Start Guide

### Step 1: Start the Server

Open a **PowerShell terminal** and navigate to the project directory:

```powershell
cd "C:\Users\rames\Desktop\Multi-Agent Tourism"
```

Start the server:

```powershell
npm start
```

You should see:
```
✓ Routes loaded successfully
✓ Routes mounted at /api
Server is running on port 3000
```

**Keep this terminal window open** - the server needs to keep running.

---

### Step 2: Run the Test Script

Open a **NEW PowerShell terminal** (keep the server running in the first one), navigate to the project directory, and run:

```powershell
cd "C:\Users\rames\Desktop\Multi-Agent Tourism"
.\test-api.ps1
```

If you get an execution policy error, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\test-api.ps1
```

---

### Step 3: Expected Output

You should see output like this:

```
========================================
  Multi-Agent Tourism API Test Suite
========================================

=== Checking Server Health ===
[OK] Server is running: Multi-Agent Tourism System is running

=== Testing Places Only ===
Query: I'm going to go to Paris, let's plan my trip.

Success: True
Response:
In Paris, here are some great places you can visit:
[list of places]

=== Testing Weather Only ===
Query: I'm going to go to Tokyo, what is the temperature there

Success: True
Response:
In Tokyo, it's currently [temperature]°C with [rain info].

... (more tests)

========================================
  Test Suite Completed
========================================
```

---

## Manual Testing (Alternative)

If you prefer to test manually, you can use these PowerShell commands:

### Test 1: Places Only
```powershell
$body = @{ query = "I'm going to go to Paris, let's plan my trip." } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/ask" -Method POST -Body $body -ContentType "application/json"
$json = $response.Content | ConvertFrom-Json
Write-Host $json.message
```

### Test 2: Weather Only
```powershell
$body = @{ query = "I'm going to go to Tokyo, what is the temperature there" } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/ask" -Method POST -Body $body -ContentType "application/json"
$json = $response.Content | ConvertFrom-Json
Write-Host $json.message
```

### Test 3: Both Weather and Places
```powershell
$body = @{ query = "I'm going to go to New York, what is the temperature there? And what are the places I can visit?" } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/ask" -Method POST -Body $body -ContentType "application/json"
$json = $response.Content | ConvertFrom-Json
Write-Host $json.message
```

### Test 4: Error Handling
```powershell
$body = @{ query = "I'm going to go to XyzInvalidPlace123, let's plan my trip." } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/ask" -Method POST -Body $body -ContentType "application/json"
$json = $response.Content | ConvertFrom-Json
Write-Host "Success: $($json.success)"
Write-Host "Message: $($json.message)"
```

---

## Troubleshooting

### Problem: "Server is not running"
**Solution:** Make sure you started the server with `npm start` in a separate terminal window.

### Problem: "Execution Policy Error"
**Solution:** Run with bypass:
```powershell
powershell -ExecutionPolicy Bypass -File .\test-api.ps1
```

### Problem: "Cannot connect to server"
**Solution:** 
1. Check if the server is running on port 3000
2. Verify no firewall is blocking the connection
3. Try accessing `http://localhost:3000/health` in a browser

### Problem: "Module not found" or "npm not found"
**Solution:** Make sure Node.js and npm are installed and in your PATH.

---

## What the Test Script Does

The `test-api.ps1` script automatically:

1. ✅ Checks if the server is running (health check)
2. ✅ Tests Places Only query
3. ✅ Tests Weather Only query  
4. ✅ Tests Both Weather and Places query
5. ✅ Tests Error Handling (invalid place)
6. ✅ Tests Bangalore example from README

All tests are color-coded and show clear success/failure messages.

