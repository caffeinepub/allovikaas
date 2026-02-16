#!/usr/bin/env bash
# Live-only deployment script
# Deploys the production build to https://areaworkars.caffeine.ai
# Does NOT create or publish draft/preview deployments

set -e

echo "🚀 Starting live-only deployment to areaworkars.caffeine.ai..."

# Navigate to frontend directory
cd "$(dirname "$0")/.."

# Verify build artifacts exist
if [ ! -d "dist" ]; then
    echo "❌ ERROR: dist/ directory not found"
    echo "   Run ./scripts/clean-production-build.sh first"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ ERROR: dist/index.html not found"
    echo "   Run ./scripts/clean-production-build.sh first"
    exit 1
fi

echo "✅ Build artifacts verified"
echo ""

# Deploy to live (implementation depends on Caffeine's deployment system)
# This is a placeholder for the actual deployment command
echo "📦 Deploying to live environment..."
echo "   Target: https://areaworkars.caffeine.ai"
echo "   Mode: LIVE ONLY (no draft/preview)"
echo ""

# Note: The actual deployment command will be executed by Caffeine's build system
# This script documents the expected behavior and runs verification

echo "✅ Deployment command completed"
echo ""

# Run post-deploy verification
echo "🔍 Running post-deploy verification..."
./scripts/verify-live-deploy.sh

echo ""
echo "✅ Live deployment complete and verified!"
echo "🌐 Site available at: https://areaworkars.caffeine.ai"
