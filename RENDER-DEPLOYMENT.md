# Render Static Site Deployment Guide

## Quick Start

This website is configured for automatic deployment on Render.

### 1. Prerequisites
- GitHub account with this repository
- Render account (free tier available)

### 2. Deploy Steps

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign up/login with your GitHub account

2. **Create New Static Site**
   - Click "New +" button
   - Select "Static Site"
   - Connect your GitHub repository

3. **Configure Deployment**
   - **Repository**: Select this repository
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Publish Directory**: `.` (root directory)

4. **Advanced Settings (Optional)**
   - **Environment Variables**: None needed
   - **Node Version**: 18.x
   - **Custom Headers**: Add if needed for Firebase

### 3. Auto-Deploy
- Render will automatically build and deploy
- Every push to main branch triggers new deployment
- Deployment usually takes 2-3 minutes

### 4. Custom Domain (Optional)
- Go to Settings in Render dashboard
- Add your custom domain
- Configure DNS records as instructed

### 5. SSL Certificate
- Render provides free SSL certificates
- Automatically configured for both render.com subdomain and custom domains

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check if `package.json` exists
   - Ensure Node.js version compatibility

2. **Firebase Not Loading**
   - Verify `firebase-config.js` has correct credentials
   - Check Firebase console for CORS settings

3. **Images Not Loading**
   - Ensure Google Drive links are public
   - Check image URL formats in Firebase

### Build Logs
- Access build logs in Render dashboard
- Look for specific error messages
- Contact support if needed

## Performance Optimization

- **Caching**: Render automatically caches static assets
- **CDN**: Global CDN included
- **Compression**: Automatic gzip compression
- **HTTP/2**: Enabled by default

## Monitoring

- **Uptime**: 99.9% SLA on paid plans
- **Analytics**: Available in dashboard
- **Alerts**: Set up notifications for downtime

## Support

- Render Documentation: [docs.render.com](https://docs.render.com)
- Community Forum: Available on Render website
- Email Support: For paid plans
