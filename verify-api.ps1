# API Route Verification Script
# Run this after updating Cloudflare Pages settings to verify the fix

Write-Host "Testing API routes on chrisdgraves.com..." -ForegroundColor Cyan
Write-Host ""

$routes = @(
    "/api/gateway",
    "/api/agents",
    "/api/finance/accounts",
    "/api/finance/transactions",
    "/api/finance/budgets",
    "/api/finance/spending"
)

foreach ($route in $routes) {
    $url = "https://chrisdgraves.com$route"
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -ErrorAction Stop
        $statusCode = $response.StatusCode
        $statusColor = if ($statusCode -eq 200) { "Green" } else { "Yellow" }
        Write-Host "OK $route - " -NoNewline
        Write-Host "$statusCode" -ForegroundColor $statusColor
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $statusColor = if ($statusCode -eq 401 -or $statusCode -eq 403) { "Yellow" } else { "Red" }
        Write-Host "ER $route - " -NoNewline
        Write-Host "$statusCode" -ForegroundColor $statusColor
    }
}

Write-Host ""
Write-Host "Note: 401/403 are OK (route exists, needs auth)" -ForegroundColor Gray
Write-Host "404 means route not deployed (build output issue)" -ForegroundColor Gray
