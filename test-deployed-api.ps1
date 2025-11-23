# Multi-Agent Tourism System - Deployed API Test Script
# This script tests the deployed API and displays human-readable responses

$baseUrl = "https://multi-agent-tourism-r63s.onrender.com"
$apiUrl = "$baseUrl/api/ask"

# Function to make API request and display human-readable response
function Test-DeployedApi {
    param(
        [string]$Query,
        [string]$TestName,
        [string]$Color = "White"
    )
    
    Write-Host "`n" -NoNewline
    $separator = "=" * 60
    Write-Host $separator -ForegroundColor $Color
    Write-Host "  $TestName" -ForegroundColor $Color
    Write-Host $separator -ForegroundColor $Color
    
    Write-Host "`n[QUERY]" -ForegroundColor Cyan
    Write-Host "   $Query" -ForegroundColor Gray
    
    try {
        $body = @{ 
            query = $Query 
        } | ConvertTo-Json
        
        Write-Host "`n[SENDING] Request to deployed API..." -ForegroundColor Yellow
        
        $response = Invoke-WebRequest -Uri $apiUrl -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
        
        $json = $response.Content | ConvertFrom-Json
        
        Write-Host "`n[STATUS] " -NoNewline -ForegroundColor Green
        Write-Host "$($response.StatusCode) $($response.StatusDescription)" -ForegroundColor White
        
        Write-Host "`n[RESPONSE]" -ForegroundColor Cyan
        Write-Host ("-" * 60) -ForegroundColor DarkGray
        
        if ($json.success) {
            Write-Host "[SUCCESS] True" -ForegroundColor Green
            
            Write-Host "`n[MESSAGE]" -ForegroundColor Cyan
            # Display message with proper line breaks
            $message = $json.message -replace "\\n", "`n"
            Write-Host $message -ForegroundColor White
        } else {
            Write-Host "[SUCCESS] False" -ForegroundColor Red
            
            Write-Host "`n[ERROR MESSAGE]" -ForegroundColor Yellow
            Write-Host $json.message -ForegroundColor Red
        }
        
        Write-Host ("-" * 60) -ForegroundColor DarkGray
        
        # Also show raw JSON for reference
        Write-Host "`n[RAW JSON]" -ForegroundColor DarkGray
        Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10) -ForegroundColor DarkGray
        
        return $json
    }
    catch {
        Write-Host "`n[ERROR] Failed to make request" -ForegroundColor Red
        Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "`n   Response Body:" -ForegroundColor Yellow
            Write-Host "   $responseBody" -ForegroundColor Red
        }
        
        return $null
    }
}

# Function to check server health
function Test-DeployedHealth {
    Write-Host "`n" -NoNewline
    $separator = "=" * 60
    Write-Host $separator -ForegroundColor Magenta
    Write-Host "  Health Check" -ForegroundColor Magenta
    Write-Host $separator -ForegroundColor Magenta
    
    try {
        Write-Host "`n[CHECKING] Server health..." -ForegroundColor Yellow
        
        $response = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET -ErrorAction Stop
        $json = $response.Content | ConvertFrom-Json
        
        Write-Host "`n[STATUS] " -NoNewline -ForegroundColor Green
        Write-Host "$($json.status)" -ForegroundColor White
        
        Write-Host "`n[MESSAGE] " -NoNewline -ForegroundColor Cyan
        Write-Host "$($json.message)" -ForegroundColor White
        
        Write-Host "`n[RAW RESPONSE]" -ForegroundColor DarkGray
        Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json) -ForegroundColor DarkGray
        
        return $true
    }
    catch {
        Write-Host "`n[ERROR] Server is not accessible" -ForegroundColor Red
        Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Main execution
Clear-Host
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "     Multi-Agent Tourism API Test Suite" -ForegroundColor Cyan
Write-Host "     Deployed App Testing" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check server health first
if (-not (Test-DeployedHealth)) {
    Write-Host "`n[WARNING] Health check failed, but continuing with tests..." -ForegroundColor Yellow
    Write-Host ""
}

# Test 1: Places Only
Test-DeployedApi `
    -Query "I'm going to Bangalore, let's plan my trip." `
    -TestName "Test 1: Tourist Places Only" `
    -Color "Green"

# Test 2: Weather Only
Test-DeployedApi `
    -Query "I'm going to Bangalore, what is the temperature there?" `
    -TestName "Test 2: Weather Information Only" `
    -Color "Cyan"

# Test 3: Both Weather and Places
Test-DeployedApi `
    -Query "I'm going to Bangalore, what is the temperature there? And what places can I visit?" `
    -TestName "Test 3: Weather + Places Combined" `
    -Color "Yellow"

# Test 4: Error Handling - Invalid Place
Test-DeployedApi `
    -Query "I'm going to XyzInvalidPlace123, let's plan my trip." `
    -TestName "Test 4: Error Handling (Invalid Place)" `
    -Color "Red"

# Summary
Write-Host "`n"
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "                    Test Suite Completed" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[NOTE] All tests were run against the deployed API at:" -ForegroundColor Gray
Write-Host "   $baseUrl" -ForegroundColor DarkGray
Write-Host ""

