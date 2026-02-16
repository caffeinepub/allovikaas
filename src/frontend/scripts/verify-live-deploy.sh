#!/usr/bin/env bash
# Post-deploy verification script
# Verifies that https://areaworkars.caffeine.ai is reachable and renders the app

set -e

LIVE_URL="https://areaworkars.caffeine.ai"
MAX_RETRIES=5
RETRY_DELAY=3

echo "🔍 Verifying live deployment at $LIVE_URL..."
echo ""

# Function to check if site is reachable and contains app shell
verify_site() {
    local response
    local http_code
    
    # Fetch the site with timeout
    response=$(curl -s -w "\n%{http_code}" --max-time 10 "$LIVE_URL" 2>&1 || echo "000")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    # Check HTTP status
    if [ "$http_code" != "200" ]; then
        echo "❌ HTTP status: $http_code (expected 200)"
        return 1
    fi
    
    echo "✅ HTTP status: 200"
    
    # Check for app shell marker (root div)
    if echo "$body" | grep -q 'id="root"'; then
        echo "✅ App shell found (div#root present)"
    else
        echo "❌ App shell not found (div#root missing)"
        return 1
    fi
    
    # Check for basic HTML structure
    if echo "$body" | grep -q '<html'; then
        echo "✅ Valid HTML document"
    else
        echo "❌ Invalid HTML document"
        return 1
    fi
    
    # Check it's not a blank page
    if [ ${#body} -lt 100 ]; then
        echo "❌ Response too short (possible blank page)"
        return 1
    fi
    
    echo "✅ Response size: ${#body} bytes"
    
    return 0
}

# Retry loop
attempt=1
while [ $attempt -le $MAX_RETRIES ]; do
    echo "Attempt $attempt of $MAX_RETRIES..."
    
    if verify_site; then
        echo ""
        echo "✅ Verification successful!"
        echo "🌐 $LIVE_URL is live and rendering correctly"
        exit 0
    fi
    
    if [ $attempt -lt $MAX_RETRIES ]; then
        echo ""
        echo "⏳ Waiting ${RETRY_DELAY}s before retry..."
        sleep $RETRY_DELAY
    fi
    
    attempt=$((attempt + 1))
    echo ""
done

echo "❌ Verification failed after $MAX_RETRIES attempts"
echo ""
echo "Troubleshooting:"
echo "  1. Check DNS: nslookup $LIVE_URL"
echo "  2. Check site manually: curl -I $LIVE_URL"
echo "  3. Review deployment logs"
echo "  4. Contact Caffeine support if DNS is not resolving"
exit 1
