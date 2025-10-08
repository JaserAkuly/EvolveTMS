# Evolve TMS Deployment Guide

This guide will help you deploy Evolve TMS to Vercel with separate environments for development and production.

## 🚀 Vercel Deployment Setup

### Prerequisites
- GitHub repository: `https://github.com/JaserAkuly/EvolveTMS.git`
- Supabase projects (dev and prod)
- Vercel account

### 1. Create Supabase Projects

#### Development Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project: `evolve-tms-dev`
3. Note the URL and anon key
4. Run database migrations and seed data

#### Production Project  
1. Create new project: `evolve-tms-prod`
2. Note the URL and anon key
3. Run database migrations and seed data

### 2. Deploy to Vercel

#### Import Project
1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Import from GitHub: `JaserAkuly/EvolveTMS`
3. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave blank)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (leave default)

#### Configure Environments

**Production Environment (main branch)**
- **Domain**: `evolve-tms.vercel.app`
- **Branch**: `main`
- **Environment Variables**:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
  SUPABASE_SERVICE_ROLE_KEY=your-prod-service-key
  NEXT_PUBLIC_APP_URL=https://evolve-tms.vercel.app
  NODE_ENV=production
  ```

**Development Environment (dev branch)**
- **Domain**: `evolve-tms-dev.vercel.app` 
- **Branch**: `dev`
- **Environment Variables**:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
  SUPABASE_SERVICE_ROLE_KEY=your-dev-service-key
  NEXT_PUBLIC_APP_URL=https://evolve-tms-dev.vercel.app
  NODE_ENV=development
  ```

### 3. Vercel Configuration

The `vercel.json` file is already configured for branch deployments:

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "dev": true
    }
  },
  "framework": "nextjs"
}
```

### 4. Environment Variables Setup

#### In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add variables for each environment:
   - **Production**: Target `Production` and `main` branch
   - **Preview**: Target `Preview` and `dev` branch

#### Required Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NODE_ENV`

### 5. Database Setup for Each Environment

#### For Both Dev and Prod Supabase Projects:

1. **Run Migrations**:
   ```bash
   npx supabase link --project-ref your-project-ref
   npx supabase db push
   ```

2. **Seed Database**: Run the seed script in SQL Editor:
   - Copy content from `supabase/seed.sql`
   - Paste in Supabase SQL Editor
   - Execute

3. **Create Demo Users**: In Authentication → Users:
   - `admin@evolve.local` / `password123`
   - `carrier@evolve.local` / `password123`  
   - `shipper@evolve.local` / `password123`
   - `viewer@evolve.local` / `password123`

### 6. Custom Domains (Optional)

#### Production
- **Custom Domain**: `app.evolve-tms.com`
- **Branch**: `main`

#### Development  
- **Custom Domain**: `dev.evolve-tms.com`
- **Branch**: `dev`

### 7. Deployment Workflow

```bash
# Development workflow
git checkout dev
git add .
git commit -m "feat: new feature"
git push origin dev
# → Auto-deploys to evolve-tms-dev.vercel.app

# Production deployment
git checkout main
git merge dev
git push origin main  
# → Auto-deploys to evolve-tms.vercel.app
```

### 8. Monitoring & Analytics

#### Vercel Analytics
- Enable in Project Settings → Analytics
- Monitor performance and usage

#### Supabase Monitoring
- Monitor database usage
- Check API requests
- Review logs

### 9. Security Checklist

- ✅ Environment variables properly configured
- ✅ Supabase RLS policies enabled
- ✅ Authentication required for all protected routes
- ✅ No secrets in client-side code
- ✅ HTTPS enforced (automatic with Vercel)
- ✅ Database access restricted by environment

### 10. Troubleshooting

#### Common Issues:
1. **Build Failures**: Check environment variables are set
2. **Database Errors**: Verify Supabase URLs and keys
3. **Authentication Issues**: Check user creation in Supabase
4. **404 Errors**: Ensure Next.js routing is correct

#### Debug Commands:
```bash
# Check environment variables
vercel env ls

# View deployment logs  
vercel logs

# Test build locally
npm run build
npm run start
```

### 11. Post-Deployment Testing

#### Test URLs:
- **Production**: https://evolve-tms.vercel.app
- **Development**: https://evolve-tms-dev.vercel.app

#### Test Accounts:
- **Admin**: admin@evolve.local / password123
- **Carrier**: carrier@evolve.local / password123
- **Shipper**: shipper@evolve.local / password123
- **Viewer**: viewer@evolve.local / password123

#### Features to Test:
- ✅ User authentication and role-based access
- ✅ Dashboard loading with real data
- ✅ Shipment lifecycle management
- ✅ CSV export functionality
- ✅ Responsive design on mobile/desktop
- ✅ Status updates and workflow transitions

---

## 🎉 Deployment Complete!

Your Evolve TMS is now live with:
- **Production**: Latest stable version
- **Development**: Testing environment for new features
- **Automatic deployments** from GitHub
- **Environment separation** with different databases
- **Scalable infrastructure** with Vercel + Supabase

Ready for production use! 🚀