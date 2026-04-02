# PharmaSight Frontend - Deployment Guide

Complete guide for deploying PharmaSight frontend to production.

## Pre-Deployment Checklist

- [ ] Backend API is deployed and stable
- [ ] Environment variables are configured
- [ ] All 7 feature tabs tested with real data
- [ ] CSV upload works with sample data
- [ ] Emergency demo mode tested
- [ ] Dark/light mode toggle verified
- [ ] Responsive design tested on mobile
- [ ] No console errors in production build

## Option 1: Vercel (Recommended for Next.js)

### Setup

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial PharmaSight frontend"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select "Next.js" framework
   - Click "Deploy"

3. **Configure Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL`
   - Example: `https://api.pharmasight.com` or `https://your-backend.vercel.app`

4. **Deploy**
   - Vercel automatically builds and deploys on git push
   - Custom domains can be configured in project settings

### Monitoring

```bash
# View deployments
vercel list

# View logs
vercel logs --follow
```

## Option 2: Docker Deployment

### Build Docker Image

```bash
# Create Dockerfile (if not exists)
cat > Dockerfile << 'EOF'
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
EOF
```

### Build and Push to Docker Hub

```bash
# Build image
docker build -t pharmasight-frontend:latest .

# Tag for registry
docker tag pharmasight-frontend:latest yourusername/pharmasight-frontend:latest

# Push to Docker Hub
docker push yourusername/pharmasight-frontend:latest
```

### Deploy with Docker

```bash
# Local testing
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://api:8000 \
  pharmasight-frontend:latest

# With environment file
docker run -p 3000:3000 --env-file .env.production pharmasight-frontend:latest
```

## Option 3: Traditional Server (Ubuntu/Debian)

### Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Deploy Steps

```bash
# Clone repository
git clone https://github.com/your-username/pharmasight.git
cd pharmasight

# Install dependencies
npm install

# Create production build
npm run build

# Create .env.production
echo "NEXT_PUBLIC_API_URL=https://api.yourdomain.com" > .env.production

# Start with PM2
pm2 start "npm start" --name "pharmasight-frontend"

# Make PM2 auto-start on reboot
pm2 startup
pm2 save
```

### Configure Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx config
sudo tee /etc/nginx/sites-available/pharmasight > /dev/null << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/pharmasight /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Start Nginx
sudo systemctl restart nginx
```

### Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (should be automatic)
sudo systemctl enable certbot.timer
```

## Option 4: AWS Elastic Beanstalk

### Create `.ebextensions/nodecommand.config`

```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
    GzipCompression: true
    ProxyServer: nginx
```

### Deploy

```bash
# Install EB CLI
pip install awsebcli --upgrade --user

# Initialize
eb init -p node.js-18 pharmasight --region us-east-1

# Set environment variables
eb setenv NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Create environment and deploy
eb create production
eb deploy
```

## Option 5: Google Cloud Run

### Create `Dockerfile.cloud`

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Deploy

```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/your-project/pharmasight-frontend

# Deploy to Cloud Run
gcloud run deploy pharmasight-frontend \
  --image gcr.io/your-project/pharmasight-frontend \
  --platform managed \
  --region us-central1 \
  --set-env-vars NEXT_PUBLIC_API_URL=https://api.yourdomain.com \
  --memory 512Mi \
  --cpu 1 \
  --allow-unauthenticated
```

## Environment Variables by Deployment

### Development
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Staging
```
NEXT_PUBLIC_API_URL=https://api-staging.yourdomain.com
```

### Production
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm install --save-dev @next/bundle-analyzer

# Create next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({})

# Run analysis
ANALYZE=true npm run build
```

### Image Optimization

- All images should be optimized with `next/image`
- Consider using CDN for public assets
- Enable automatic image optimization in Next.js

### Caching Headers

Configure CDN caching:
```
/static/* → 1 year
/_next/* → 1 year
/api/* → no-cache
/* → 1 hour (HTML pages)
```

## Monitoring & Observability

### Setup Error Tracking (Sentry)

```bash
npm install @sentry/nextjs

# Create sentry.client.config.js
# See documentation for setup
```

### Setup Analytics

```bash
npm install next-google-analytics

# Add to layout.tsx
<GoogleAnalytics GA_MEASUREMENT_ID="YOUR-ID" />
```

### Health Check Endpoint

The app has a built-in health check at `/health` that returns:

```json
{
  "status": "ok",
  "uptime": 12345,
  "timestamp": "2025-01-15T10:30:00Z"
}
```

## Backup & Recovery

### Database Backups
- Ensure backend database is backed up
- For CSV uploads, maintain archive of processed files

### Version Control
```bash
# Tag releases
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0

# Rollback to previous version
git checkout v0.9.9
npm run build && npm start
```

## Security Checklist

- [ ] HTTPS/SSL enabled
- [ ] Security headers configured (CSP, X-Frame-Options)
- [ ] API rate limiting in place
- [ ] Input validation on CSV upload
- [ ] Regular dependency updates
- [ ] No secrets in code or environment
- [ ] Backend CORS properly configured
- [ ] Authentication/authorization if needed

## Troubleshooting Deployment

### Build Fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is correctly set
- Check backend is accessible from deployment region
- Verify CORS headers on backend

### Performance Issues
- Check build size: `npm run build`
- Monitor server resources
- Enable gzip compression
- Consider CDN for static assets

## Rollback Procedure

### Vercel
```bash
# Revert to previous deployment
vercel rollback
```

### Docker/Manual
```bash
# Git rollback
git revert HEAD
npm run build
npm start

# Or use previous tag
git checkout v1.0.0
```

## Monitoring After Deployment

1. **Check deployment logs**
2. **Verify all 7 feature tabs load**
3. **Test CSV upload with sample file**
4. **Monitor error tracking**
5. **Check performance metrics**
6. **Monitor API response times**

## Scheduled Maintenance

```bash
# Backup routine
0 2 * * * /home/ubuntu/backup-data.sh

# Health checks
*/5 * * * * curl -f https://yourdomain.com/health || systemctl restart nginx

# Log rotation
0 0 * * * logrotate /etc/logrotate.conf
```

---

**For detailed troubleshooting, see FRONTEND_README.md**
