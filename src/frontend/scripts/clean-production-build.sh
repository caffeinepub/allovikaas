#!/usr/bin/env bash
# Clean production build script
# Removes all build artifacts and caches to ensure a fresh production build

set -e

echo "🧹 Starting clean production build process..."

# Navigate to frontend directory
cd "$(dirname "$0")/.."

echo "📦 Removing node_modules cache..."
rm -rf node_modules/.vite

echo "🗑️  Removing previous build output..."
rm -rf dist

echo "🔄 Removing package manager cache..."
# Clear pnpm cache if using pnpm
if command -v pnpm &> /dev/null; then
    pnpm store prune
fi

echo "🏗️  Running production build from scratch..."
pnpm run build:skip-bindings

# Verify build output exists
if [ ! -d "dist" ]; then
    echo "❌ ERROR: Build failed - dist/ directory not created"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ ERROR: Build failed - dist/index.html not found"
    exit 1
fi

echo "✅ Clean production build complete!"
echo "📁 Build artifacts are in: dist/"
echo ""
echo "Verification:"
echo "  - dist/ directory exists: ✓"
echo "  - dist/index.html exists: ✓"
echo ""
echo "Next steps:"
echo "  1. Review the build output in dist/"
echo "  2. Run ./scripts/deploy-live.sh to deploy to live"
