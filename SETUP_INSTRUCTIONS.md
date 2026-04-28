# 🚀 AI Income Optimizer - Complete Setup Guide

## ✅ What's Already Done

1. ✅ **Code pushed to GitHub**: https://github.com/Malik4077/ai_income_optimizer
2. ✅ **Node.js installer downloaded**: `C:\Users\ZENKOD~1\AppData\Local\Temp\node-installer.msi`
3. ✅ **Project structure created**: 68 files, production-ready

---

## 📋 Step 1: Install Node.js (Required)

### Option A: Use Downloaded Installer (Fastest)
1. Open File Explorer
2. Navigate to: `C:\Users\ZENKOD~1\AppData\Local\Temp\`
3. Double-click `node-installer.msi`
4. Follow the installation wizard (click Next → Next → Install)
5. **Restart your terminal/PowerShell** after installation

### Option B: Download Fresh
1. Go to https://nodejs.org/
2. Download the LTS version (v20.x)
3. Run the installer
4. Restart terminal

---

## 📋 Step 2: Install Dependencies

Open PowerShell in the project folder and run:

```powershell
cd C:\Users\Zenkoders\Desktop\projects\ai-income-optimizer
npm install
```

This will install all 40+ dependencies (~200MB). Takes 2-3 minutes.

---

## 📋 Step 3: Set Up Environment Variables

1. Copy the example file:
```powershell
copy .env.example .env.local
```

2. Open `.env.local` in a text editor and fill in:

### Required Keys:

**OpenAI** (Get from https://platform.openai.com/api-keys):
```
OPENAI_API_KEY=sk-proj-...
```

**Supabase** (Create project at https://supabase.com):
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres
```

**Clerk Auth** (Create app at https://clerk.com):
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Stripe** (Get from https://dashboard.stripe.com/apikeys):
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 📋 Step 4: Set Up Supabase Database

1. Go to https://supabase.com and create a new project
2. Wait for database to provision (2-3 minutes)
3. Go to **SQL Editor** in Supabase dashboard
4. Copy the entire content from `supabase/migrations/001_initial_schema.sql`
5. Paste and click **Run**
6. Go to **Storage** → Create bucket named `resumes` → Make it **public**

---

## 📋 Step 5: Set Up Stripe Products

1. Go to https://dashboard.stripe.com/products
2. Create two products:

**Pro Plan**:
- Name: "Pro"
- Price: $29/month recurring
- Copy the Price ID (starts with `price_...`)
- Add to `.env.local` as `STRIPE_PRO_PRICE_ID`

**Premium Plan**:
- Name: "Premium"  
- Price: $79/month recurring
- Copy the Price ID
- Add to `.env.local` as `STRIPE_PREMIUM_PRICE_ID`

3. Set up webhook:
- Go to **Developers** → **Webhooks** → **Add endpoint**
- URL: `http://localhost:3000/api/stripe/webhook` (for local testing)
- Events: Select `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Copy webhook secret (starts with `whsec_...`)
- Add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

---

## 📋 Step 6: Run the Project Locally

```powershell
npm run dev
```

The app will start at: **http://localhost:3000**

You should see:
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
- Ready in 2.5s
```

---

## 🎯 Test the Application

1. Open http://localhost:3000
2. Click "Get Started Free"
3. Sign up with Clerk
4. Upload a test resume (or paste text)
5. View your income analysis

---

## 🚀 Deploy to Vercel (Production)

### Option 1: Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import from GitHub: `Malik4077/ai_income_optimizer`
4. Add all environment variables from `.env.local`
5. Click "Deploy"

### Option 2: Via CLI

```powershell
npm install -g vercel
vercel login
vercel
```

Follow prompts, add environment variables when asked.

---

## 🔧 Troubleshooting

### "node is not recognized"
- Restart PowerShell after installing Node.js
- Or run: `$env:PATH += ";C:\Program Files\nodejs"`

### "npm install" fails
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### Database connection fails
- Check Supabase URL and keys in `.env.local`
- Ensure database migration ran successfully
- Check connection pooling is enabled in Supabase

### Stripe webhook not working locally
- Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Or use ngrok for local testing

### OpenAI API errors
- Verify API key is valid
- Check you have credits in your OpenAI account
- Ensure billing is set up

---

## 📁 Project Structure

```
ai-income-optimizer/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Clerk auth pages
│   ├── (dashboard)/       # Protected dashboard
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific
│   └── ui/                # shadcn/ui components
├── lib/                   # Core logic
│   ├── ai/                # OpenAI integrations
│   ├── stripe/            # Payment logic
│   └── supabase/          # Database client
├── supabase/              # Database migrations
└── ...config files
```

---

## 🎉 You're Ready!

Once Node.js is installed and dependencies are set up, the app will run locally.

For production deployment, just push to Vercel with environment variables configured.

**Need help?** Check the README.md or create an issue on GitHub.
