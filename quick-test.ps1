# Quick Test Script - Single API Request with Human-Readable Output
# Usage: .\quick-test.ps1 "Your query here"

param(
    [Parameter(Mandatory=$true)]
    [string]$Query
)

$apiUrl = "https://multi-agent-tourism-r63s.onrender.com/api/ask"

Write-Host "`n🔍 Testing Deployed API" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "`n📍 Your Query:" -ForegroundColor Yellow
Write-Host "   $Query" -ForegroundColor White
Write-Host ""

try {
    $body = @{ query = $Query } | ConvertTo-Json
    
    Write-Host "🔄 Sending request..." -ForegroundColor Yellow
    
    $response = Invoke-WebRequest -Uri $apiUrl -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $json = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ Status: $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Response:" -ForegroundColor Cyan
    Write-Host "-" * 50 -ForegroundColor DarkGray
    
    if ($json.success) {
        Write-Host "✓ Success: True" -ForegroundColor Green
        Write-Host ""
        Write-Host "💬 Message:" -ForegroundColor Cyan
        # Replace \n with actual line breaks for readability
        $message = $json.message -replace "\\n", "`n"
        Write-Host $message -ForegroundColor White
    } else {
        Write-Host "✗ Success: False" -ForegroundColor Red
        Write-Host ""
        Write-Host "⚠️  Error:" -ForegroundColor Yellow
        Write-Host $json.message -ForegroundColor Red
    }
    
    Write-Host "-" * 50 -ForegroundColor DarkGray
    
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

