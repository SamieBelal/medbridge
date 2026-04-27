-- MedBridge Seed Data (Hosted Supabase version)
-- Creates mock auth.users entries first, then profiles, providers, services, bookings, reviews
-- Run this in the Supabase SQL Editor after running 001_initial_schema.sql

-- ============================================================
-- Step 1: Create mock auth.users entries
-- These are fake users for development/demo purposes
-- ============================================================
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
VALUES
  ('a1b2c3d4-1111-4000-8000-000000000001', '00000000-0000-0000-0000-000000000000', 'dr.chen@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
  ('a1b2c3d4-2222-4000-8000-000000000002', '00000000-0000-0000-0000-000000000000', 'dr.rodriguez@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
  ('a1b2c3d4-3333-4000-8000-000000000003', '00000000-0000-0000-0000-000000000000', 'dr.patel@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
  ('a1b2c3d4-4444-4000-8000-000000000004', '00000000-0000-0000-0000-000000000000', 'dr.nguyen@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
  ('a1b2c3d4-5555-4000-8000-000000000005', '00000000-0000-0000-0000-000000000000', 'dr.thompson@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
  ('a1b2c3d4-6666-4000-8000-000000000006', '00000000-0000-0000-0000-000000000000', 'dr.kim@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
  ('b1b2c3d4-0001-4000-8000-000000000001', '00000000-0000-0000-0000-000000000000', 'maria@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
  ('b1b2c3d4-0002-4000-8000-000000000002', '00000000-0000-0000-0000-000000000000', 'jennifer@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
  ('b1b2c3d4-0003-4000-8000-000000000003', '00000000-0000-0000-0000-000000000000', 'ashley@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
  ('b1b2c3d4-0004-4000-8000-000000000004', '00000000-0000-0000-0000-000000000000', 'lisa@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
  ('b1b2c3d4-0005-4000-8000-000000000005', '00000000-0000-0000-0000-000000000000', 'tanya@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- The trigger will auto-create profiles, but with default role='patient' and no display_name override.
-- So we update the profiles that were just created:
UPDATE profiles SET role = 'provider', display_name = 'Dr. Sarah Chen' WHERE id = 'a1b2c3d4-1111-4000-8000-000000000001';
UPDATE profiles SET role = 'provider', display_name = 'Dr. James Rodriguez' WHERE id = 'a1b2c3d4-2222-4000-8000-000000000002';
UPDATE profiles SET role = 'provider', display_name = 'Dr. Priya Patel' WHERE id = 'a1b2c3d4-3333-4000-8000-000000000003';
UPDATE profiles SET role = 'provider', display_name = 'Dr. Michael Nguyen' WHERE id = 'a1b2c3d4-4444-4000-8000-000000000004';
UPDATE profiles SET role = 'provider', display_name = 'Dr. Emily Thompson' WHERE id = 'a1b2c3d4-5555-4000-8000-000000000005';
UPDATE profiles SET role = 'provider', display_name = 'Dr. David Kim' WHERE id = 'a1b2c3d4-6666-4000-8000-000000000006';
UPDATE profiles SET display_name = 'Maria G.' WHERE id = 'b1b2c3d4-0001-4000-8000-000000000001';
UPDATE profiles SET display_name = 'Jennifer L.' WHERE id = 'b1b2c3d4-0002-4000-8000-000000000002';
UPDATE profiles SET display_name = 'Ashley R.' WHERE id = 'b1b2c3d4-0003-4000-8000-000000000003';
UPDATE profiles SET display_name = 'Lisa M.' WHERE id = 'b1b2c3d4-0004-4000-8000-000000000004';
UPDATE profiles SET display_name = 'Tanya W.' WHERE id = 'b1b2c3d4-0005-4000-8000-000000000005';

-- ============================================================
-- Step 2: Providers
-- ============================================================
INSERT INTO providers (id, user_id, npi, license_number, license_verified, business_name, specialty, bio, address, city, zip, lat, lng, phone, website, slug, is_active, created_at) VALUES
  ('c0000001-0000-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000001', '1234567890', 'TX-MD-12345', TRUE, 'Glow MedSpa', 'aesthetics', 'Board-certified dermatologist specializing in minimally invasive cosmetic procedures. 12 years of experience in Botox, fillers, and laser treatments.', '5800 Legacy Dr, Suite 200', 'Plano', '75024', 33.0753, -96.8270, '(972) 555-0101', 'https://glowmedspa.example.com', 'glow-medspa-plano', TRUE, NOW()),
  ('c0000002-0000-4000-8000-000000000002', 'a1b2c3d4-2222-4000-8000-000000000002', '2345678901', 'TX-MD-23456', TRUE, 'DFW Aesthetics & Wellness', 'aesthetics', 'Double board-certified in dermatology and cosmetic surgery. No insurance games, no surprise bills.', '4001 W Green Oaks Blvd', 'Arlington', '76016', 32.7098, -97.1527, '(817) 555-0202', 'https://dfwaesthetics.example.com', 'dfw-aesthetics-arlington', TRUE, NOW()),
  ('c0000003-0000-4000-8000-000000000003', 'a1b2c3d4-3333-4000-8000-000000000003', '3456789012', 'TX-MD-34567', TRUE, 'Radiance Skin Clinic', 'aesthetics', 'Specializing in advanced skin rejuvenation. Cash-pay prices 40-60% below hospital-system rates.', '3100 Independence Pkwy, Suite 310', 'Frisco', '75035', 33.1507, -96.8236, '(469) 555-0303', 'https://radianceskin.example.com', 'radiance-skin-frisco', TRUE, NOW()),
  ('c0000004-0000-4000-8000-000000000004', 'a1b2c3d4-4444-4000-8000-000000000004', '4567890123', 'TX-MD-45678', TRUE, 'Uptown Dermatology', 'aesthetics', 'Located in the heart of Uptown Dallas. All prices posted upfront — no negotiation needed.', '2801 Lemmon Ave, Suite 100', 'Dallas', '75204', 32.8095, -96.8078, '(214) 555-0404', 'https://uptowndermatology.example.com', 'uptown-dermatology-dallas', TRUE, NOW()),
  ('c0000005-0000-4000-8000-000000000005', 'a1b2c3d4-5555-4000-8000-000000000005', '5678901234', 'TX-MD-56789', TRUE, 'Fort Worth Skin & Laser', 'aesthetics', 'Family-owned practice serving Fort Worth for over 8 years. Transparent pricing and personalized care.', '800 8th Ave, Suite 220', 'Fort Worth', '76104', 32.7469, -97.3285, '(682) 555-0505', 'https://fwskinlaser.example.com', 'fw-skin-laser', TRUE, NOW()),
  ('c0000006-0000-4000-8000-000000000006', 'a1b2c3d4-6666-4000-8000-000000000006', '6789012345', 'TX-MD-67890', TRUE, 'Richardson Aesthetics Center', 'aesthetics', 'Concierge-level aesthetic medicine at cash-pay prices. Complimentary consultation with every treatment.', '1701 N Collins Blvd, Suite 400', 'Richardson', '75080', 32.9621, -96.7298, '(972) 555-0606', 'https://richardsonaesthetics.example.com', 'richardson-aesthetics', TRUE, NOW());

-- ============================================================
-- Step 3: Services (prices in cents)
-- ============================================================
INSERT INTO services (id, provider_id, name, description, category, cash_price, duration_min, is_active) VALUES
  ('d0000001-0001-4000-8000-000000000001', 'c0000001-0000-4000-8000-000000000001', 'Botox (20 units)', 'Forehead lines and crow''s feet. Includes consultation.', 'botox', 7900, 30, TRUE),
  ('d0000001-0002-4000-8000-000000000002', 'c0000001-0000-4000-8000-000000000001', 'Botox (40 units)', 'Full upper face treatment.', 'botox', 14900, 45, TRUE),
  ('d0000001-0003-4000-8000-000000000003', 'c0000001-0000-4000-8000-000000000001', 'Juvederm Ultra XC (1 syringe)', 'Lip augmentation or nasolabial fold correction.', 'filler', 49900, 45, TRUE),
  ('d0000001-0004-4000-8000-000000000004', 'c0000001-0000-4000-8000-000000000001', 'PRP Facial (Vampire Facial)', 'Platelet-rich plasma microneedling.', 'prp', 75000, 60, TRUE),
  ('d0000001-0005-4000-8000-000000000005', 'c0000001-0000-4000-8000-000000000001', 'Laser Skin Resurfacing', 'Fractional CO2 laser for fine lines, scars, and tone.', 'laser', 120000, 90, TRUE),
  ('d0000002-0001-4000-8000-000000000001', 'c0000002-0000-4000-8000-000000000002', 'Botox (20 units)', 'Targeted wrinkle reduction. Quick, minimal downtime.', 'botox', 8500, 30, TRUE),
  ('d0000002-0002-4000-8000-000000000002', 'c0000002-0000-4000-8000-000000000002', 'Restylane Lyft (1 syringe)', 'Cheek augmentation and midface volume.', 'filler', 55000, 45, TRUE),
  ('d0000002-0003-4000-8000-000000000003', 'c0000002-0000-4000-8000-000000000002', 'IPL Photofacial', 'Intense pulsed light for sun damage and redness.', 'laser', 35000, 45, TRUE),
  ('d0000002-0004-4000-8000-000000000004', 'c0000002-0000-4000-8000-000000000002', 'PRP Hair Restoration', 'Platelet-rich plasma for hair thinning.', 'prp', 95000, 60, TRUE),
  ('d0000003-0001-4000-8000-000000000001', 'c0000003-0000-4000-8000-000000000003', 'Botox (20 units)', 'Premium Botox with precision injection.', 'botox', 8900, 30, TRUE),
  ('d0000003-0002-4000-8000-000000000002', 'c0000003-0000-4000-8000-000000000003', 'Sculptra (1 vial)', 'Collagen-stimulating injectable.', 'filler', 65000, 60, TRUE),
  ('d0000003-0003-4000-8000-000000000003', 'c0000003-0000-4000-8000-000000000003', 'Laser Hair Removal (Full Face)', 'Permanent hair reduction.', 'laser', 25000, 30, TRUE),
  ('d0000003-0004-4000-8000-000000000004', 'c0000003-0000-4000-8000-000000000003', 'PRP Facial', 'Microneedling with PRP.', 'prp', 69900, 60, TRUE),
  ('d0000003-0005-4000-8000-000000000005', 'c0000003-0000-4000-8000-000000000003', 'Lip Filler (Juvederm Volbella)', 'Subtle, natural lip enhancement.', 'filler', 45000, 30, TRUE),
  ('d0000004-0001-4000-8000-000000000001', 'c0000004-0000-4000-8000-000000000004', 'Botox (20 units)', 'Expert injection by board-certified dermatologist.', 'botox', 9500, 30, TRUE),
  ('d0000004-0002-4000-8000-000000000002', 'c0000004-0000-4000-8000-000000000004', 'Botox (60 units)', 'Full face treatment.', 'botox', 24900, 60, TRUE),
  ('d0000004-0003-4000-8000-000000000003', 'c0000004-0000-4000-8000-000000000004', 'Kybella (Double Chin)', 'FDA-approved injectable for submental fat.', 'other', 85000, 45, TRUE),
  ('d0000004-0004-4000-8000-000000000004', 'c0000004-0000-4000-8000-000000000004', 'Chemical Peel (Medium Depth)', 'TCA peel for hyperpigmentation.', 'other', 30000, 45, TRUE),
  ('d0000005-0001-4000-8000-000000000001', 'c0000005-0000-4000-8000-000000000005', 'Botox (20 units)', 'Affordable Botox in Fort Worth.', 'botox', 7500, 30, TRUE),
  ('d0000005-0002-4000-8000-000000000002', 'c0000005-0000-4000-8000-000000000005', 'Juvederm Voluma (1 syringe)', 'Cheek volume restoration.', 'filler', 59900, 45, TRUE),
  ('d0000005-0003-4000-8000-000000000003', 'c0000005-0000-4000-8000-000000000005', 'Laser Tattoo Removal (Small)', 'Q-switched laser per session.', 'laser', 20000, 30, TRUE),
  ('d0000005-0004-4000-8000-000000000004', 'c0000005-0000-4000-8000-000000000005', 'PRP Knee Injection', 'PRP for joint pain and sports injuries.', 'prp', 85000, 45, TRUE),
  ('d0000006-0001-4000-8000-000000000001', 'c0000006-0000-4000-8000-000000000006', 'Botox (20 units)', 'Concierge Botox with complimentary consult.', 'botox', 9900, 45, TRUE),
  ('d0000006-0002-4000-8000-000000000002', 'c0000006-0000-4000-8000-000000000006', 'Radiesse (1 syringe)', 'Calcium-based filler for jawline contouring.', 'filler', 62000, 45, TRUE),
  ('d0000006-0003-4000-8000-000000000003', 'c0000006-0000-4000-8000-000000000006', 'BBL Hero (Full Face)', 'BroadBand Light for sun damage.', 'laser', 45000, 45, TRUE),
  ('d0000006-0004-4000-8000-000000000004', 'c0000006-0000-4000-8000-000000000006', 'Microneedling with PRP', 'SkinPen microneedling + PRP serum.', 'prp', 55000, 60, TRUE);

-- ============================================================
-- Step 4: Mock bookings (completed, for reviews)
-- ============================================================
INSERT INTO bookings (id, patient_id, provider_id, service_id, status, appointment_at, gfe_sent, created_at) VALUES
  ('e0000001-0000-4000-8000-000000000001', 'b1b2c3d4-0001-4000-8000-000000000001', 'c0000001-0000-4000-8000-000000000001', 'd0000001-0001-4000-8000-000000000001', 'completed', NOW() - INTERVAL '30 days', TRUE, NOW() - INTERVAL '35 days'),
  ('e0000002-0000-4000-8000-000000000002', 'b1b2c3d4-0002-4000-8000-000000000002', 'c0000001-0000-4000-8000-000000000001', 'd0000001-0003-4000-8000-000000000003', 'completed', NOW() - INTERVAL '20 days', TRUE, NOW() - INTERVAL '25 days'),
  ('e0000003-0000-4000-8000-000000000003', 'b1b2c3d4-0003-4000-8000-000000000003', 'c0000002-0000-4000-8000-000000000002', 'd0000002-0001-4000-8000-000000000001', 'completed', NOW() - INTERVAL '15 days', TRUE, NOW() - INTERVAL '20 days'),
  ('e0000004-0000-4000-8000-000000000004', 'b1b2c3d4-0001-4000-8000-000000000001', 'c0000003-0000-4000-8000-000000000003', 'd0000003-0001-4000-8000-000000000001', 'completed', NOW() - INTERVAL '10 days', TRUE, NOW() - INTERVAL '15 days'),
  ('e0000005-0000-4000-8000-000000000005', 'b1b2c3d4-0004-4000-8000-000000000004', 'c0000004-0000-4000-8000-000000000004', 'd0000004-0001-4000-8000-000000000001', 'completed', NOW() - INTERVAL '7 days', TRUE, NOW() - INTERVAL '12 days'),
  ('e0000006-0000-4000-8000-000000000006', 'b1b2c3d4-0005-4000-8000-000000000005', 'c0000005-0000-4000-8000-000000000005', 'd0000005-0001-4000-8000-000000000001', 'completed', NOW() - INTERVAL '5 days', TRUE, NOW() - INTERVAL '10 days'),
  ('e0000007-0000-4000-8000-000000000007', 'b1b2c3d4-0002-4000-8000-000000000002', 'c0000003-0000-4000-8000-000000000003', 'd0000003-0004-4000-8000-000000000004', 'completed', NOW() - INTERVAL '3 days', TRUE, NOW() - INTERVAL '8 days'),
  ('e0000008-0000-4000-8000-000000000008', 'b1b2c3d4-0003-4000-8000-000000000003', 'c0000006-0000-4000-8000-000000000006', 'd0000006-0001-4000-8000-000000000001', 'completed', NOW() - INTERVAL '2 days', TRUE, NOW() - INTERVAL '7 days'),
  ('e0000009-0000-4000-8000-000000000009', 'b1b2c3d4-0004-4000-8000-000000000004', 'c0000002-0000-4000-8000-000000000002', 'd0000002-0003-4000-8000-000000000003', 'completed', NOW() - INTERVAL '1 day', TRUE, NOW() - INTERVAL '6 days'),
  ('e0000010-0000-4000-8000-000000000010', 'b1b2c3d4-0005-4000-8000-000000000005', 'c0000004-0000-4000-8000-000000000004', 'd0000004-0003-4000-8000-000000000003', 'completed', NOW() - INTERVAL '1 day', TRUE, NOW() - INTERVAL '5 days');

-- ============================================================
-- Step 5: Reviews
-- ============================================================
INSERT INTO reviews (booking_id, patient_id, provider_id, rating, title, body, provider_reply, created_at) VALUES
  ('e0000001-0000-4000-8000-000000000001', 'b1b2c3d4-0001-4000-8000-000000000001', 'c0000001-0000-4000-8000-000000000001', 5, 'Best Botox experience ever', 'Dr. Chen was incredibly thorough and the results are amazing. The price was exactly what was listed.', 'Thank you Maria! See you in 3 months!', NOW() - INTERVAL '28 days'),
  ('e0000002-0000-4000-8000-000000000002', 'b1b2c3d4-0002-4000-8000-000000000002', 'c0000001-0000-4000-8000-000000000001', 4, 'Great results, easy booking', 'The lip filler looks very natural. Booking through MedBridge was so simple.', NULL, NOW() - INTERVAL '18 days'),
  ('e0000003-0000-4000-8000-000000000003', 'b1b2c3d4-0003-4000-8000-000000000003', 'c0000002-0000-4000-8000-000000000002', 5, 'Finally, transparent pricing!', 'Cash was way cheaper than insurance. Dr. Rodriguez was fantastic.', 'We appreciate you trusting us!', NOW() - INTERVAL '13 days'),
  ('e0000004-0000-4000-8000-000000000004', 'b1b2c3d4-0001-4000-8000-000000000001', 'c0000003-0000-4000-8000-000000000003', 5, 'Premium quality, fair price', 'Paid $89 cash vs the $220 my insurance estimated. No brainer.', NULL, NOW() - INTERVAL '8 days'),
  ('e0000005-0000-4000-8000-000000000005', 'b1b2c3d4-0004-4000-8000-000000000004', 'c0000004-0000-4000-8000-000000000004', 4, 'Uptown quality', 'Very professional. Price was a bit higher but the experience justified it.', 'Thank you Lisa!', NOW() - INTERVAL '5 days'),
  ('e0000006-0000-4000-8000-000000000006', 'b1b2c3d4-0005-4000-8000-000000000005', 'c0000005-0000-4000-8000-000000000005', 5, 'Best price in DFW', 'Saved $75 vs going through my UHC plan. Results are perfect.', NULL, NOW() - INTERVAL '3 days'),
  ('e0000007-0000-4000-8000-000000000007', 'b1b2c3d4-0002-4000-8000-000000000002', 'c0000003-0000-4000-8000-000000000003', 4, 'PRP facial was worth it', 'Skin is glowing a week later. Cash price was very reasonable.', 'So happy with your results!', NOW() - INTERVAL '1 day'),
  ('e0000008-0000-4000-8000-000000000008', 'b1b2c3d4-0003-4000-8000-000000000003', 'c0000006-0000-4000-8000-000000000006', 5, 'Concierge-level care', 'Dr. Kim spent 45 minutes with me. The complimentary consultation is a great touch.', NULL, NOW() - INTERVAL '1 day'),
  ('e0000009-0000-4000-8000-000000000009', 'b1b2c3d4-0004-4000-8000-000000000004', 'c0000002-0000-4000-8000-000000000002', 4, 'IPL worked great', 'Sun spots are already fading after one session. Price was transparent.', NULL, NOW() - INTERVAL '12 hours'),
  ('e0000010-0000-4000-8000-000000000010', 'b1b2c3d4-0005-4000-8000-000000000005', 'c0000004-0000-4000-8000-000000000004', 3, 'Good but pricey', 'Kybella treatment went well but at $850 it is one of the pricier options.', 'Results typically take 4-6 weeks. We look forward to your follow-up!', NOW() - INTERVAL '6 hours');
