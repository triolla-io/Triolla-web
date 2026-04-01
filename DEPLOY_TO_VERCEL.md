# Deploy to Vercel Guide

Your project is ready to deploy! Here's how to deploy just the `/web` directory to Vercel.

## Step 1: Verify .gitignore Setup ✅

Trial/development files are now excluded:
```bash
cat web/.gitignore
# Should show these excluded files:
# - 100_PERCENT_CHECKLIST.md
# - SEO_SCORECARD.md
# - SEO_SETUP.md
# - AGENTS.md
# - .team/, .claude/, .cursor/
```

## Step 2: Commit Your Changes

```bash
cd /Users/ariell/html-to-react

# Stage all changes
git add -A

# Commit
git commit -m "Add metadata editor system and prepare for Vercel deployment

- Centralized JSON-based metadata management
- Admin UI for editing page titles/descriptions
- Updated .gitignore to exclude trial files
- Added vercel.json configuration"

# Push to GitHub
git push origin main
```

## Step 3: Connect to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repository (`html-to-react`)
4. Vercel will auto-detect the `vercel.json` configuration
5. Click **"Deploy"**

### Option B: Via Vercel CLI

```bash
npm install -g vercel

cd /Users/ariell/html-to-react

# Deploy (Vercel will read vercel.json automatically)
vercel
```

## What Happens

The `vercel.json` file tells Vercel to:
- **Install dependencies** from `/web` directory
- **Build** the Next.js app in `/web`
- **Deploy** the `/web` output

```json
{
  "buildCommand": "cd web && npm run build",
  "installCommand": "cd web && npm install",
  "devCommand": "cd web && npm run dev",
  "outputDirectory": "web/.next"
}
```

## Environment Variables (if needed)

If your app needs environment variables (e.g., `NEXT_PUBLIC_SITE_URL`):

1. In Vercel Dashboard → Project Settings → **Environment Variables**
2. Add any `.env.local` variables needed
3. Example:
   ```
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

## After Deployment

1. **Vercel assigns you a domain:**
   ```
   https://html-to-react.vercel.app
   ```

2. **To use a custom domain:**
   - In Vercel Dashboard → **Domains**
   - Add your domain (e.g., `triolla-snapshots.com`)
   - Update DNS settings per Vercel instructions

3. **Test the deployment:**
   - Visit your Vercel URL
   - Check metadata: Open browser DevTools → Elements/Inspector
   - Verify page titles and meta descriptions loaded correctly

## Files Being Deployed

```
✅ web/app/               → All Next.js pages & components
✅ web/public/            → Static assets (fragments, images, CSS)
✅ web/app/metadata/      → Metadata JSON files
✅ web/package.json       → Dependencies
✅ web/next.config.ts     → Next.js configuration

❌ 100_PERCENT_CHECKLIST.md  → Excluded (development file)
❌ SEO_SCORECARD.md          → Excluded (development file)
❌ AGENTS.md                 → Excluded (development file)
❌ node_modules/             → Not uploaded (installed on Vercel)
```

## Troubleshooting

### Build fails?
- Check `vercel.json` is in the root directory
- Ensure `web/package.json` has all dependencies
- View logs in Vercel Dashboard → Deployments → View Logs

### Metadata not showing?
- Hard refresh browser (Ctrl+F5)
- Check that JSON files exist in `/web/app/metadata/`
- Verify pages call `loadPageMetadata()` correctly

### Custom domain issues?
- DNS changes take 24-48 hours to propagate
- Use Vercel's DNS suggestion tool in Dashboard

## Quick Reference

| Task | Command |
|------|---------|
| Check what will deploy | `git status` |
| View deployment logs | Vercel Dashboard → Deployments |
| Redeploy latest commit | Vercel Dashboard → Redeploy |
| Roll back version | Vercel Dashboard → Deployments → Redeploy |
| Update environment vars | Vercel Dashboard → Settings → Environment Variables |

## Next Steps

1. ✅ Commit code to GitHub
2. ✅ Connect repo to Vercel
3. ✅ Deploy (Vercel reads `vercel.json` automatically)
4. ✅ Test metadata on live site
5. ✅ (Optional) Add custom domain

You're ready! 🚀

For detailed Vercel docs: https://vercel.com/docs
