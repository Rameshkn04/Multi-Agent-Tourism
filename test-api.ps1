# Multi-Agent Tourism System - API Test Script
# This script tests all endpoints and scenarios of the tourism API

$baseUrl = "http://localhost:3000"
$apiUrl = "$baseUrl/api/ask"

# Function to make API request
function Test-ApiRequest {
    param(
        [string]$Query,
        [string]$TestName,
        [string]$Color = "White"
    )
    
    Write-Host "`n=== $TestName ===" -ForegroundColor $Color
    Write-Host "Query: $Query" -ForegroundColor Gray
    
    try {
        $body = @{ 
            query = $Query 
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri $apiUrl -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
        
        $json = $response.Content | ConvertFrom-Json
        
        Write-Host "`nSuccess: $($json.success)" -ForegroundColor $(if ($json.success) { "Green" } else { "Red" })
        Write-Host "Response:" -ForegroundColor Cyan
        Write-Host $json.message -ForegroundColor White
        
        return $json
    }
    catch {
        Write-Host "`nERROR: Failed to make request" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        return $null
    }
}

# Function to check if server is running
function Test-ServerHealth {
    Write-Host "`n=== Checking Server Health ===" -ForegroundColor Magenta
    
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET -ErrorAction Stop
        $json = $response.Content | ConvertFrom-Json
        Write-Host "[OK] Server is running: $($json.message)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "[ERROR] Server is not running or not accessible at $baseUrl" -ForegroundColor Red
        Write-Host "  Please start the server first using: npm start" -ForegroundColor Yellow
        return $false
    }
}

# Main execution
Write-Host "`n" -NoNewline
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Multi-Agent Tourism API Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check server health first
if (-not (Test-ServerHealth)) {
    Write-Host "`nExiting. Please start the server and try again." -ForegroundColor Yellow
    exit 1
}

# Test 1: Places Only
Test-ApiRequest `
    -Query "I'm going to Paris, let's plan my trip." `
    -TestName "Testing Places Only" `
    -Color "Green"

# Test 2: Weather Only
Test-ApiRequest `
    -Query "I'm going to Tokyo, what is the temperature there" `
    -TestName "Testing Weather Only" `
    -Color "Cyan"

# Test 3: Both Weather and Places
Test-ApiRequest `
    -Query "I'm going to  New York, what is the temperature there? And what are the places I can visit?" `
    -TestName "Testing Both Weather and Places" `
    -Color "Yellow"

# Test 4: Error Handling - Invalid Place
Test-ApiRequest `
    -Query "I'm going to XyzInvalidPlace123, let's plan my trip." `
    -TestName "Testing Error Handling (Invalid Place)" `
    -Color "Red"

# Test 5: Additional test with Bangalore (as shown in README examples)
Test-ApiRequest `
    -Query "I'm going to Bangalore, let's plan my trip." `
    -TestName "Testing Places - Bangalore" `
    -Color "Green"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Test Suite Completed" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

