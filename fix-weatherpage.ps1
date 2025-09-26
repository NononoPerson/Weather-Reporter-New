# --- CONFIG ---
$WeatherPagePath = "C:\Users\chira\OneDrive\Desktop\weather-stylist-app\src\pages\WeatherPage.js"

if (-Not (Test-Path $WeatherPagePath)) {
    Write-Host "❌ File not found: $WeatherPagePath"
    exit
}

# --- READ FILE ---
$Content = Get-Content $WeatherPagePath

# --- REMOVE DUPLICATE IMPORTS ---
$Content = $Content | Select-Object -Unique

# --- REMOVE DUPLICATE WeatherDashboard DECLARATIONS ---
$insideComponent = $false
$FilteredContent = @()

foreach ($line in $Content) {
    if ($line -match "const\s+WeatherDashboard\s*=") {
        if (-not $insideComponent) {
            $FilteredContent += $line
            $insideComponent = $true
        } else {
            Write-Host "⚠ Skipping duplicate WeatherDashboard declaration"
        }
    } else {
        $FilteredContent += $line
    }
}

# --- SAVE FIXED FILE ---
$FilteredContent | Set-Content $WeatherPagePath
Write-Host "✅ WeatherPage.js has been fixed"
