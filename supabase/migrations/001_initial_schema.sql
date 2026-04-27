-- MedBridge MVP Schema
-- DFW Cash-Pay Healthcare Marketplace

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE user_role AS ENUM ('patient', 'provider');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'patient',
  display_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, display_name)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- PROVIDERS
-- ============================================================
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  npi TEXT UNIQUE,
  license_number TEXT,
  license_state TEXT DEFAULT 'TX',
  license_verified BOOLEAN DEFAULT FALSE,
  business_name TEXT NOT NULL,
  specialty TEXT DEFAULT 'aesthetics',
  bio TEXT,
  address TEXT,
  city TEXT,
  zip TEXT,
  lat NUMERIC,
  lng NUMERIC,
  phone TEXT,
  website TEXT,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  npdb_checked_at TIMESTAMPTZ,
  onboarding_step INT DEFAULT 1,
  stripe_account_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_npi CHECK (npi IS NULL OR LENGTH(npi) = 10)
);

CREATE INDEX idx_providers_city ON providers(city);
CREATE INDEX idx_providers_slug ON providers(slug);
CREATE INDEX idx_providers_specialty ON providers(specialty);
CREATE INDEX idx_providers_is_active ON providers(is_active);

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active providers are viewable by everyone"
  ON providers FOR SELECT
  USING (is_active = TRUE OR auth.uid() = user_id);

CREATE POLICY "Providers can update their own profile"
  ON providers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can insert their own profile"
  ON providers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- SERVICES
-- ============================================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('botox', 'filler', 'laser', 'prp', 'other')),
  cash_price INTEGER NOT NULL CHECK (cash_price > 0), -- cents
  duration_min INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_services_category ON services(category);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active services are viewable by everyone"
  ON services FOR SELECT
  USING (is_active = TRUE OR EXISTS (
    SELECT 1 FROM providers WHERE providers.id = services.provider_id AND providers.user_id = auth.uid()
  ));

CREATE POLICY "Providers can manage their own services"
  ON services FOR ALL
  USING (EXISTS (
    SELECT 1 FROM providers WHERE providers.id = services.provider_id AND providers.user_id = auth.uid()
  ));

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES profiles(id),
  provider_id UUID NOT NULL REFERENCES providers(id),
  service_id UUID NOT NULL REFERENCES services(id),
  status booking_status NOT NULL DEFAULT 'pending',
  appointment_at TIMESTAMPTZ NOT NULL,
  stripe_payment_id TEXT,
  gfe_sent BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_patient ON bookings(patient_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_appointment_at ON bookings(appointment_at);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Providers can view bookings for their practice"
  ON bookings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM providers WHERE providers.id = bookings.provider_id AND providers.user_id = auth.uid()
  ));

CREATE POLICY "Patients can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Providers can update booking status"
  ON bookings FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM providers WHERE providers.id = bookings.provider_id AND providers.user_id = auth.uid()
  ));

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id),
  patient_id UUID NOT NULL REFERENCES profiles(id),
  provider_id UUID NOT NULL REFERENCES providers(id),
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  provider_reply TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_provider ON reviews(provider_id);
CREATE INDEX idx_reviews_patient ON reviews(patient_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Patients can create reviews for their bookings"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Providers can reply to their reviews"
  ON reviews FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM providers WHERE providers.id = reviews.provider_id AND providers.user_id = auth.uid()
  ));

-- ============================================================
-- ELIGIBILITY CHECKS
-- ============================================================
CREATE TABLE eligibility_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES profiles(id),
  payer_name TEXT NOT NULL,
  member_id TEXT NOT NULL,
  service_type TEXT,
  deductible_total INTEGER, -- cents
  deductible_met INTEGER,   -- cents
  copay INTEGER,            -- cents
  coinsurance_pct NUMERIC,
  plan_year_start DATE,
  estimated_patient_cost INTEGER, -- cents
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE eligibility_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view their own eligibility checks"
  ON eligibility_checks FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create eligibility checks"
  ON eligibility_checks FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

-- ============================================================
-- GFE DOCUMENTS
-- ============================================================
CREATE TABLE gfe_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  service_items JSONB NOT NULL DEFAULT '[]',
  total_estimate INTEGER NOT NULL, -- cents
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE gfe_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "GFE visible to booking patient and provider"
  ON gfe_documents FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = gfe_documents.booking_id
    AND (bookings.patient_id = auth.uid() OR EXISTS (
      SELECT 1 FROM providers WHERE providers.id = bookings.provider_id AND providers.user_id = auth.uid()
    ))
  ));

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  stripe_session_id TEXT,
  amount INTEGER NOT NULL, -- cents
  status payment_status NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  receipt_url TEXT,
  paid_at TIMESTAMPTZ
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Payments visible to booking patient and provider"
  ON payments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = payments.booking_id
    AND (bookings.patient_id = auth.uid() OR EXISTS (
      SELECT 1 FROM providers WHERE providers.id = bookings.provider_id AND providers.user_id = auth.uid()
    ))
  ));

-- ============================================================
-- HELPER VIEWS
-- ============================================================
CREATE OR REPLACE VIEW provider_ratings AS
SELECT
  provider_id,
  COUNT(*) as review_count,
  ROUND(AVG(rating)::numeric, 1) as avg_rating
FROM reviews
GROUP BY provider_id;
