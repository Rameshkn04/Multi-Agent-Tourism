# 🪟 PowerShell Examples - Human-Readable Output

Quick copy-paste PowerShell commands to test the deployed API with beautiful, human-readable output.

---

## 🚀 Quick Test (Copy-Paste Ready)

### Test Places Only

```powershell
$body = @{ query = "I'm going to go to Bangalore, let's plan my trip." } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "https://multi-agent-tourism-r63s.onrender.com/api/ask" -Method POST -Body $body -ContentType "application/json"
$json = $response.Content | ConvertFrom-Json
Write-Host "`n✅ Status: $($response.StatusCode) OK" -ForegroundColor Green
Write-Host "✓ Success: $($json.success)" -ForegroundColor $(if($json.success){"Green"}else{"Red"})
Write-Host "`n💬 Response Message:" -ForegroundColor Cyan
Write-Host ($json.message -replace "\\n", "`n") -ForegroundColor White
```

### Test Weather Only

```powershell
$body = @{ query = "I'm going to Bangalore, what is the temperature there?" } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "https://multi-agent-tourism-r63s.onrender.com/api/ask" -Method POST -Body $body -ContentType "application/json"
$json = $response.Content | ConvertFrom-Json
Write-Host "`n✅ Status: $($response.StatusCode) OK" -ForegroundColor Green
Write-Host "✓ Success: $($json.success)" -ForegroundColor $(if($json.success){"Green"}else{"Red"})
Write-Host "`n💬 Response Message:" -ForegroundColor Cyan
Write-Host ($json.message -replace "\\n", "`n") -ForegroundColor White
```

### Test Both Weather + Places

```powershell
$body = @{ query = "I'm going to Bangalore, what is the temperature there? And what places can I visit?" } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "https://multi-agent-tourism-r63s.onrender.com/api/ask" -Method POST -Body $body -ContentType "application/json"
$json = $response.Content | ConvertFrom-Json
Write-Host "`n✅ Status: $($response.StatusCode) OK" -ForegroundColor Green
Write-Host "✓ Success: $($json.success)" -ForegroundColor $(if($json.success){"Green"}else{"Red"})
Write-Host "`n💬 Response Message:" -ForegroundColor Cyan
Write-Host ($json.message -replace "\\n", "`n") -ForegroundColor White
```

### Test Error Handling

```powershell
$body = @{ query = "I'm going to go to XyzInvalidPlace123, let's plan my trip." } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "https://multi-agent-tourism-r63s.onrender.com/api/ask" -Method POST -Body $body -ContentType "application/json"
$json = $response.Content | ConvertFrom-Json
Write-Host "`n✅ Status: $($response.StatusCode) OK" -ForegroundColor Green
Write-Host "✗ Success: $($json.success)" -ForegroundColor Red
Write-Host "`n⚠️  Error Message:" -ForegroundColor Yellow
Write-Host $json.message -ForegroundColor Red
```

---

## 🎨 Enhanced Function (Reusable)

Copy this function into your PowerShell session for easy testing:

```powershell
function Test-TourismAPI {
    param([string]$Query)
    
    $apiUrl = "https://multi-agent-tourism-r63s.onrender.com/api/ask"
    
    Write-Host "`n🔍 Testing API..." -ForegroundColor Cyan
    Write-Host "📍 Query: $Query" -ForegroundColor Gray
    Write-Host ""
    
    try {
        $body = @{ query = $Query } | ConvertTo-Json
        $response = Invoke-WebRequest -Uri $apiUrl -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
        $json = $response.Content | ConvertFrom-Json
        
        Write-Host "✅ Status: $($response.StatusCode) OK" -ForegroundColor Green
        Write-Host "✓ Success: $($json.success)" -ForegroundColor $(if($json.success){"Green"}else{"Red"})
        Write-Host "`n💬 Response:" -ForegroundColor Cyan
        Write-Host ($json.message -replace "\\n", "`n") -ForegroundColor White
        Write-Host ""
        
        return $json
    }
    catch {
        Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}
```

**Usage after defining the function:**
```powershell
Test-TourismAPI "I'm going to go to Bangalore, let's plan my trip."
Test-TourismAPI "I'm going to Bangalore, what is the temperature there?"
Test-TourismAPI "I'm going to go to XyzInvalidPlace123, let's plan my trip."
```

---

## 📋 Health Check

```powershell
$response = Invoke-WebRequest -Uri "https://multi-agent-tourism-r63s.onrender.com/health" -Method GET
$json = $response.Content | ConvertFrom-Json
Write-Host "`n✅ Server Status: $($json.status)" -ForegroundColor Green
Write-Host "💬 Message: $($json.message)" -ForegroundColor Cyan
```

---

## 🎯 Using the Test Scripts

### Full Test Suite (All Test Cases)

```powershell
.\test-deployed-api.ps1
```

This will run all 4 test cases with beautiful formatted output.

### Quick Single Test

```powershell
.\quick-test.ps1 "I'm going to go to Bangalore, let's plan my trip."
```

---

## 📸 Expected Output

When you run these commands, you'll see output like:

```
✅ Status: 200 OK
✓ Success: True

💬 Response Message:
In Bangalore, here are some great places you can visit:

Lalbagh

Sri Chamarajendra Park

Bangalore palace

Bannerghatta National Park

Jawaharlal Nehru Planetarium
```

The output is color-coded and formatted for easy reading!

