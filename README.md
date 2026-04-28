# AI Income Optimizer

A production-ready SaaS platform that helps freelancers, job seekers, and professionals increase their income using AI-powered analysis.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes
- **AI**: OpenAI GPT-4o with structured JSON outputs
- **Database**: PostgreSQL via Supabase
- **Auth**: Clerk
- **Payments**: Stripe
- **Hosting**: Vercel

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```
Fill in all values in `.env.local`.

### 3. Set up Supabase
- Create a project at [supabase.com](https://supabase.com)
- Run the migration: `supabase/migrations/001_initial_schema.sql`
- Create a storage bucket named `resumes` (public)

### 4. Set up Clerk
- Create an app at [clerk.com](https://clerk.com)
- Copy publishable key and secret key

### 5. Set up Stripe
- Create products at [stripe.com](https://stripe.com):
  - Pro: $29/month
  - Premium: $79/month
- Copy price IDs to `.env.local`
- Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
  - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### 6. Run development server
```bash
npm run dev
```

## Deployment to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.example`
4. Deploy

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/analyze-profile` | POST | Upload resume + run AI income audit |
| `/api/generate-plan` | POST | Generate income growth plan |
| `/api/optimize-profile` | POST | Rewrite profile content |
| `/api/chat` | POST | AI coach streaming chat |
| `/api/earnings-simulation` | POST | Run earnings scenarios |
| `/api/stripe/checkout` | POST | Create Stripe checkout session |
| `/api/stripe/webhook` | POST | Handle Stripe webhooks |
| `/api/stripe/portal` | POST | Open Stripe billing portal |

## Plans

| Feature | Free | Pro ($29) | Premium ($79) |
|---------|------|-----------|---------------|
| Income analyses | 1 | Unlimited | Unlimited |
| Growth plans | ❌ | ✅ | ✅ |
| Profile optimizer | ❌ | ✅ | ✅ |
| Earnings simulator | ❌ | ❌ | ✅ |
| AI chat coach | ❌ | ❌ | ✅ |
