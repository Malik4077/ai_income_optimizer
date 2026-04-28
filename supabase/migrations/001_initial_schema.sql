-- ============================================
-- AI Income Optimizer - Initial Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced from Clerk)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'premium')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_end TIMESTAMPTZ,
  analyses_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_role TEXT,
  current_income NUMERIC,
  income_currency TEXT DEFAULT 'USD',
  income_type TEXT CHECK (income_type IN ('hourly', 'monthly', 'annual')),
  years_experience INTEGER,
  skills TEXT[],
  linkedin_url TEXT,
  location TEXT,
  employment_type TEXT CHECK (employment_type IN ('freelancer', 'employee', 'job_seeker', 'consultant')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resume uploads table
CREATE TABLE IF NOT EXISTS resume_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_name TEXT,
  file_url TEXT,
  raw_text TEXT,
  parsed_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Income analyses table
CREATE TABLE IF NOT EXISTS income_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  resume_upload_id UUID REFERENCES resume_uploads(id),
  skill_gaps JSONB,
  income_limitations JSONB,
  positioning_flaws JSONB,
  missed_opportunities JSONB,
  overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  current_income_estimate NUMERIC,
  potential_income_estimate NUMERIC,
  raw_ai_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Growth plans table
CREATE TABLE IF NOT EXISTS growth_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES income_analyses(id),
  recommended_niche TEXT,
  repositioning_strategy JSONB,
  skill_roadmap JSONB,
  income_increase_min NUMERIC,
  income_increase_max NUMERIC,
  timeline_months INTEGER,
  action_steps JSONB,
  raw_ai_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optimized content table
CREATE TABLE IF NOT EXISTS optimized_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES income_analyses(id),
  resume_summary TEXT,
  linkedin_bio TEXT,
  gig_descriptions JSONB,
  pricing_strategy JSONB,
  keywords TEXT[],
  raw_ai_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Earnings reports table
CREATE TABLE IF NOT EXISTS earnings_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES income_analyses(id),
  current_monthly NUMERIC,
  potential_monthly NUMERIC,
  improvement_scenarios JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_resume_uploads_user_id ON resume_uploads(user_id);
CREATE INDEX idx_income_analyses_user_id ON income_analyses(user_id);
CREATE INDEX idx_growth_plans_user_id ON growth_plans(user_id);
CREATE INDEX idx_optimized_content_user_id ON optimized_content(user_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimized_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies (service role bypasses these)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (true);
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can view own resumes" ON resume_uploads FOR SELECT USING (true);
CREATE POLICY "Users can view own analyses" ON income_analyses FOR SELECT USING (true);
CREATE POLICY "Users can view own plans" ON growth_plans FOR SELECT USING (true);
CREATE POLICY "Users can view own content" ON optimized_content FOR SELECT USING (true);
CREATE POLICY "Users can view own reports" ON earnings_reports FOR SELECT USING (true);
CREATE POLICY "Users can view own chats" ON chat_messages FOR SELECT USING (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
