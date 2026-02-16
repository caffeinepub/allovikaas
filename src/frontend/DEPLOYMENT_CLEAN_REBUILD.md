# Clean Production Rebuild Guide

This document describes how to perform a forced clean rebuild of the frontend from scratch, clearing all caches and ensuring the production build corresponds exactly to the current repository state.

## When to Use This

Use a clean rebuild when:
- You suspect stale build artifacts are being served
- You want to ensure the production build matches the current codebase exactly
- You're preparing for a critical production deployment
- Previous incremental builds may have cached incorrect assets
- Deployment failed due to stale cache issues

## What Gets Cleared

The clean rebuild process removes:
1. **Vite build cache** (`node_modules/.vite`) - Removes cached module transformations
2. **Previous build output** (`dist/`) - Ensures no old artifacts remain
3. **Package manager cache** - Prunes unused dependencies from pnpm store

## Steps to Perform Clean Rebuild

### Option 1: Using the Script (Recommended)

