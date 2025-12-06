# Deployment Guide - iMessage Chat Creator

This application is a **static, client-side only** web app. No backend or database is required.

## Privacy & Security
✅ **Zero server-side data storage** - All user data stays on their device  
✅ **No cookies or tracking** - Fully privacy-preserving  
✅ **No API calls** - Completely self-contained  

## Deployment Options

### 1. **Vercel** (Recommended - Free)
```bash
npm install -g vercel
vercel
```

### 2. **Netlify** (Free)
```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
# Or use Netlify CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### 3. **GitHub Pages**
```bash
npm run build
# Push dist folder to gh-pages branch
# Or use github-pages action
```

### 4. **AWS S3 + CloudFront**
```bash
npm run build
# Upload dist folder to S3 bucket with static website hosting enabled
```

### 5. **Docker Deployment**
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Deploy:
```bash
docker build -t imessage-chat-creator .
docker run -p 80:80 imessage-chat-creator
```

## Pre-Deployment Checklist

- ✅ Run `npm run build` to create optimized production bundle
- ✅ Test with `npm run preview` to verify the build works
- ✅ Check dist folder size (~259KB gzipped)
- ✅ Verify no console errors in browser DevTools
- ✅ Test all features: create chat, add participants, add messages, download images
- ✅ Test on mobile devices (iOS/Android)

## Production Best Practices

1. **Enable GZIP compression** on your hosting
2. **Set proper cache headers:**
   - HTML files: no-cache or max-age=3600
   - JS/CSS in /assets: max-age=31536000 (1 year)
3. **Use CDN** for fast global delivery
4. **Enable HTTPS** (required for most browsers)
5. **Add CSP headers** if needed:
   ```
   Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' cdn.tailwindcss.com cdn.jsdelivr.net; img-src 'self' data: picsum.photos;
   ```

## Build Optimization

Current build stats:
- HTML: 1.50 kB (gzipped: 0.66 kB)
- JavaScript: 258.28 kB (gzipped: 78.92 kB)
- Total: ~80KB gzipped

## Troubleshooting

**Issue: Images not loading after deployment**
- Ensure CORS is enabled on image hosts (picsum.photos)
- Check browser console for CORS errors

**Issue: html2canvas not working**
- Verify the CDN link in index.html is accessible
- Check browser compatibility (works on all modern browsers)

**Issue: Tailwind styles not applied**
- Build was successful; verify CDN link in index.html
- Clear browser cache

## Performance Monitoring

Monitor with:
- Google PageSpeed Insights
- WebPageTest
- Lighthouse (built into Chrome DevTools)

Typical metrics:
- First Contentful Paint: <1s
- Largest Contentful Paint: <2s
- Cumulative Layout Shift: <0.1
