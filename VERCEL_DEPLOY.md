# 🚀 Deploy AI Income Optimizer to Vercel

## ✅ Prerequisites Completed

- ✅ Code pushed to GitHub: https://github.com/Malik4077/ai_income_optimizer
- ✅ Node.js v20.18.0 installed
- ⏳ Dependencies installing...

---

## 🎯 Quick Deploy (Recommended - 5 minutes)

### Step 1: Go to Vercel Dashboard

1. Open https://vercel.com
2. Click **"Sign Up"** or **"Log In"** (use GitHub account for easiest setup)

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find and select: **`Malik4077/ai_income_optimizer`**
4. Click **"Import"**

### Step 3: Configure Project

**Framework Preset**: Next.js (auto-detected)  
**Root Directory**: `./` (leave as is)  
**Build Command**: `next build` (auto-filled)  
**Output Directory**: `.next` (auto-filled)

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add these (you'll need to get API keys first):

```bash
# OpenAI (Get from: https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-...

# Supabase (Get from: https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres

# Clerk Auth (Get from: https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Stripe (Get from: https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...

# App URL (will be provided by Vercel after first deploy)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://ai-income-optimizer.vercel.app`

---

## 🔑 Getting API Keys (Before Deploying)

### 1. OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Copy the key (starts with `sk-proj-...`)
4. **Important**: Add billing info at https://platform.openai.com/account/billing

### 2. Supabase Setup

1. Go to https://supabase.com
2. Click **"New project"**
3. Fill in:
   - Name: `ai-income-optimizer`
   - Database Password: (create a strong password)
   - Region: (choose closest to you)
4. Wait 2-3 minutes for provisioning
5. Go to **Settings** → **API**:
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
6. Go to **Settings** → **Database**:
   - Copy connection string → `DATABASE_URL`
7. **Run Database Migration**:
   - Go to **SQL Editor**
   - Copy content from `supabase/migrations/001_initial_schema.sql`
   - Paste and click **"Run"**
8. **Create Storage Bucket**:
   - Go to **Storage**
   - Click **"New bucket"**
   - Name: `resumes`
   - Make it **Public**

### 3. Clerk Auth Setup

1. Go to https://clerk.com
2. Click **"Add application"**
3. Name: `AI Income Optimizer`
4. Enable: Email, Google (optional)
5. Click **"Create application"**
6. Copy from dashboard:
   - `Publishable key` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `Secret key` → `CLERK_SECRET_KEY`
7. Go to **Paths** in sidebar:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`

### 4. Stripe Setup

1. Go to https://dashboard.stripe.com
2. Click **"Developers"** → **"API keys"**
3. Copy:
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`
4. **Create Products**:
   - Go to **Products** → **"Add product"**
   - **Pro Plan**:
     - Name: `Pro`
     - Price: `$29` / month
     - Copy Price ID → `STRIPE_PRO_PRICE_ID`
   - **Premium Plan**:
     - Name: `Premium`
     - Price: `$79` / month
     - Copy Price ID → `STRIPE_PREMIUM_PRICE_ID`
5. **Set up Webhook** (after first deploy):
   - Go to **Developers** → **Webhooks**
   - Click **"Add endpoint"**
   - URL: `https://your-app.vercel.app/api/stripe/webhook`
   - Events: Select:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy webhook secret → `STRIPE_WEBHOOK_SECRET`

---

## 🔄 After First Deploy

### Update Environment Variables

1. Go back to Vercel dashboard
2. Click your project → **"Settings"** → **"Environment Variables"**
3. Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
4. Update Stripe webhook URL with your actual domain
5. Click **"Redeploy"** to apply changes

### Update Clerk URLs

1. Go to Clerk dashboard
2. **Settings** → **Domains**
3. Add your Vercel domain: `your-app.vercel.app`

---

## 🎉 Your App is Live!

Visit: `https://your-app.vercel.app`

### Test the Flow:

1. Click **"Get Started Free"**
2. Sign up with email
3. Upload a test resume
4. View income analysis
5. Generate growth plan

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `Module not found`
- **Fix**: Check all imports in code, ensure file names match exactly

**Error**: `Environment variable not found`
- **Fix**: Add missing env vars in Vercel dashboard

### Runtime Errors

**Error**: `Supabase connection failed`
- **Fix**: Verify DATABASE_URL and run migration

**Error**: `OpenAI API error`
- **Fix**: Check API key is valid and has billing enabled

**Error**: `Clerk authentication failed`
- **Fix**: Verify domain is added in Clerk dashboard

### Stripe Webhook Not Working

- Use Stripe CLI for testing: `stripe listen --forward-to https://your-app.vercel.app/api/stripe/webhook`
- Verify webhook secret matches in environment variables

---

## 📊 Monitor Your Deployment

### Vercel Dashboard

- **Deployments**: See all deploy history
- **Analytics**: Track page views and performance
- **Logs**: View runtime logs and errors
- **Domains**: Add custom domain

### Recommended Monitoring

- **Vercel Analytics**: Built-in (free)
- **Sentry**: Error tracking
- **PostHog**: User analytics (optional, already in code)

---

## 🚀 Custom Domain (Optional)

1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Vercel: **Settings** → **Domains**
3. Add your domain
4. Update DNS records as instructed
5. Wait for SSL certificate (automatic)

---

## 💡 Pro Tips

1. **Use Production Keys**: Switch from test to live keys in Stripe/Clerk
2. **Enable Caching**: Vercel automatically caches static assets
3. **Monitor Costs**: Watch OpenAI API usage in dashboard
4. **Set Rate Limits**: Implement rate limiting for API routes
5. **Backup Database**: Regular Supabase backups

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Issues**: https://github.com/Malik4077/ai_income_optimizer/issues

---

## ✅ Deployment Checklist

- [ ] All API keys obtained
- [ ] Supabase database migrated
- [ ] Supabase storage bucket created
- [ ] Clerk application configured
- [ ] Stripe products created
- [ ] Environment variables added to Vercel
- [ ] Project deployed successfully
- [ ] Stripe webhook configured
- [ ] Custom domain added (optional)
- [ ] Test full user flow

**Estimated Total Setup Time**: 15-20 minutes

Good luck with your deployment! 🎉
