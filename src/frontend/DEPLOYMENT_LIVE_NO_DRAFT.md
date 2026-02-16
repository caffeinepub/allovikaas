# Live-Only Deployment Guide (No Draft)

This document describes how to deploy the clean production build directly to the live domain **without creating or publishing a draft deployment**.

## Prerequisites

Before deploying to live:
1. ✅ Clean production build completed (see [DEPLOYMENT_CLEAN_REBUILD.md](./DEPLOYMENT_CLEAN_REBUILD.md))
2. ✅ Build artifacts verified in `dist/` directory
3. ✅ Backend canister deployed and stable
4. ✅ All tests passing (if applicable)
5. ✅ Team approval for live deployment (if required)

## Target Domain

**Live URL**: https://areaworkars.caffeine.ai

This is the production domain where the application will be accessible to all users.

## Deployment Flow

### Step 1: Clean Rebuild

First, ensure you have fresh build artifacts:

