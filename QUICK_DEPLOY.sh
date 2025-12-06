#!/bin/bash
# Quick Deployment Guide - iMessage Chat Creator

# ============================================
# PRODUCTION BUILD READY ✓
# ============================================

# Build Stats:
# - HTML: 2.05 KB
# - React Bundle: 11.52 KB
# - Drag-n-Drop: 48.27 KB
# - App Code: 194.15 KB
# - Total: ~256 KB (81 KB gzipped)

# ============================================
# DEPLOYMENT OPTIONS
# ============================================

echo "Choose your deployment platform:"
echo ""
echo "1. VERCEL (Recommended - Easiest)"
echo "   - Zero config deployment"
echo "   - Automatic HTTPS"
echo "   - Global CDN"
echo "   - Free tier"
echo ""
echo "   npm install -g vercel"
echo "   vercel"
echo ""

echo "2. NETLIFY"
echo "   - Drag & drop deploy"
echo "   - Git integration"
echo "   - Free tier"
echo ""
echo "   npm install -g netlify-cli"
echo "   netlify deploy --prod --dir=dist"
echo ""

echo "3. GITHUB PAGES"
echo "   - Free with GitHub repo"
echo "   - Automatic from Git"
echo ""
echo "   Push 'dist' folder to gh-pages branch"
echo ""

echo "4. AWS S3 + CloudFront"
echo "   - Scalable"
echo "   - Pay-as-you-go"
echo ""
echo "   aws s3 sync dist/ s3://YOUR-BUCKET-NAME"
echo ""

echo "5. DOCKER"
echo "   - Self-hosted"
echo "   - Full control"
echo ""
echo "   docker build -t imessage-chat-creator ."
echo "   docker run -p 80:80 imessage-chat-creator"
echo ""

echo "============================================"
echo "VERIFICATION CHECKLIST"
echo "============================================"
echo ""
echo "Before deploying, verify:"
echo ""
echo "✅ Privacy banner visible"
echo "✅ All features working"
echo "✅ Download functionality works"
echo "✅ Responsive on mobile"
echo "✅ No console errors"
echo "✅ HTTPS enabled (where applicable)"
echo ""

echo "Test locally first:"
echo "  npm run preview"
echo "  Then visit: http://localhost:4173"
echo ""
