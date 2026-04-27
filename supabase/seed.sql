-- MedBridge Seed Data
-- Mock DFW aesthetics providers for development
-- These use fixed UUIDs for consistency; in production, profiles are created via auth trigger

-- Mock provider user profiles (will be replaced by real auth in production)
INSERT INTO profiles (id, role, display_name, created_at) VALUES
  ('a1b2c3d4-1111-4000-8000-000000000001', 'provider', 'Dr. Sarah Chen', NOW()),
  ('a1b2c3d4-2222-4000-8000-000000000002', 'provider', 'Dr. James Rodriguez', NOW()),
  ('a1b2c3d4-3333-4000-8000-000000000003', 'provider', 'Dr. Priya Patel', NOW()),
  ('a1b2c3d4-4444-4000-8000-000000000004', 'provider', 'Dr. Michael Nguyen', NOW()),
  ('a1b2c3d4-5555-4000-8000-000000000005', 'provider', 'Dr. Emily Thompson', NOW()),
  ('a1b2c3d4-6666-4000-8000-000000000006', 'provider', 'Dr. David Kim', NOW()),
  -- Mock patient for reviews
  ('b1b2c3d4-0001-4000-8000-000000000001', 'patient', 'Maria G.', NOW()),
  ('b1b2c3d4-0002-4000-8000-000000000002', 'patient', 'Jennifer L.', NOW()),
  ('b1b2c3d4-0003-4000-8000-000000000003', 'patient', 'Ashley R.', NOW()),
  ('b1b2c3d4-0004-4000-8000-000000000004', 'patient', 'Lisa M.', NOW()),
  ('b1b2c3d4-0005-4000-8000-000000000005', 'patient', 'Tanya W.', NOW());

-- Providers
INSERT INTO providers (id, user_id, npi, license_number, license_verified, business_name, specialty, bio, address, city, zip, lat, lng, phone, website, slug, is_active, created_at) VALUES
  (
    'p0000001-0000-4000-8000-000000000001',
    'a1b2c3d4-1111-4000-8000-000000000001',
    '1234567890',
    'TX-MD-12345',
    TRUE,
    'Glow MedSpa',
    'aesthetics',
    'Board-certified dermatologist specializing in minimally invasive cosmetic procedures. 12 years of experience in Botox, fillers, and laser treatments. Passionate about helping patients look and feel their best with transparent, honest pricing.',
    '5800 Legacy Dr, Suite 200',
    'Plano',
    '75024',
    33.0753,
    -96.8270,
    '(972) 555-0101',
    'https://glowmedspa.example.com',
    'glow-medspa-plano',
    TRUE,
    NOW()
  ),
  (
    'p0000002-0000-4000-8000-000000000002',
    'a1b2c3d4-2222-4000-8000-000000000002',
    '2345678901',
    'TX-MD-23456',
    TRUE,
    'DFW Aesthetics & Wellness',
    'aesthetics',
    'Double board-certified in dermatology and cosmetic surgery. We believe everyone deserves access to quality aesthetic care at fair prices. No insurance games, no surprise bills.',
    '4001 W Green Oaks Blvd',
    'Arlington',
    '76016',
    32.7098,
    -97.1527,
    '(817) 555-0202',
    'https://dfwaesthetics.example.com',
    'dfw-aesthetics-arlington',
    TRUE,
    NOW()
  ),
  (
    'p0000003-0000-4000-8000-000000000003',
    'a1b2c3d4-3333-4000-8000-000000000003',
    '3456789012',
    'TX-MD-34567',
    TRUE,
    'Radiance Skin Clinic',
    'aesthetics',
    'Specializing in advanced skin rejuvenation and anti-aging treatments. Our cash-pay prices are 40-60% below what you''d pay through insurance at a hospital system. Same quality, honest pricing.',
    '3100 Independence Pkwy, Suite 310',
    'Frisco',
    '75035',
    33.1507,
    -96.8236,
    '(469) 555-0303',
    'https://radianceskin.example.com',
    'radiance-skin-frisco',
    TRUE,
    NOW()
  ),
  (
    'p0000004-0000-4000-8000-000000000004',
    'a1b2c3d4-4444-4000-8000-000000000004',
    '4567890123',
    'TX-MD-45678',
    TRUE,
    'Uptown Dermatology',
    'aesthetics',
    'Located in the heart of Uptown Dallas. We specialize in both medical and cosmetic dermatology with a focus on natural-looking results. All prices posted upfront — no negotiation needed.',
    '2801 Lemmon Ave, Suite 100',
    'Dallas',
    '75204',
    32.8095,
    -96.8078,
    '(214) 555-0404',
    'https://uptowndermatology.example.com',
    'uptown-dermatology-dallas',
    TRUE,
    NOW()
  ),
  (
    'p0000005-0000-4000-8000-000000000005',
    'a1b2c3d4-5555-4000-8000-000000000005',
    '5678901234',
    'TX-MD-56789',
    TRUE,
    'Fort Worth Skin & Laser',
    'aesthetics',
    'Family-owned practice serving Fort Worth for over 8 years. We believe in transparent pricing and personalized care. Come see why our patients keep coming back.',
    '800 8th Ave, Suite 220',
    'Fort Worth',
    '76104',
    32.7469,
    -97.3285,
    '(682) 555-0505',
    'https://fwskinlaser.example.com',
    'fw-skin-laser',
    TRUE,
    NOW()
  ),
  (
    'p0000006-0000-4000-8000-000000000006',
    'a1b2c3d4-6666-4000-8000-000000000006',
    '6789012345',
    'TX-MD-67890',
    TRUE,
    'Richardson Aesthetics Center',
    'aesthetics',
    'Concierge-level aesthetic medicine at cash-pay prices. Board-certified with fellowship training in facial aesthetics. Every treatment includes a complimentary consultation.',
    '1701 N Collins Blvd, Suite 400',
    'Richardson',
    '75080',
    32.9621,
    -96.7298,
    '(972) 555-0606',
    'https://richardsonaesthetics.example.com',
    'richardson-aesthetics',
    TRUE,
    NOW()
  );

-- Services (prices in cents)
INSERT INTO services (id, provider_id, name, description, category, cash_price, duration_min, is_active) VALUES
  -- Glow MedSpa (Plano)
  ('s0000001-0001-4000-8000-000000000001', 'p0000001-0000-4000-8000-000000000001', 'Botox (20 units)', 'Forehead lines and crow''s feet. Includes consultation.', 'botox', 7900, 30, TRUE),
  ('s0000001-0002-4000-8000-000000000002', 'p0000001-0000-4000-8000-000000000001', 'Botox (40 units)', 'Full upper face treatment including forehead, glabella, and crow''s feet.', 'botox', 14900, 45, TRUE),
  ('s0000001-0003-4000-8000-000000000003', 'p0000001-0000-4000-8000-000000000001', 'Juvederm Ultra XC (1 syringe)', 'Lip augmentation or nasolabial fold correction.', 'filler', 49900, 45, TRUE),
  ('s0000001-0004-4000-8000-000000000004', 'p0000001-0000-4000-8000-000000000001', 'PRP Facial (Vampire Facial)', 'Platelet-rich plasma microneedling for skin rejuvenation.', 'prp', 75000, 60, TRUE),
  ('s0000001-0005-4000-8000-000000000005', 'p0000001-0000-4000-8000-000000000001', 'Laser Skin Resurfacing', 'Fractional CO2 laser for fine lines, scars, and tone.', 'laser', 120000, 90, TRUE),

  -- DFW Aesthetics (Arlington)
  ('s0000002-0001-4000-8000-000000000001', 'p0000002-0000-4000-8000-000000000002', 'Botox (20 units)', 'Targeted wrinkle reduction. Quick, minimal downtime.', 'botox', 8500, 30, TRUE),
  ('s0000002-0002-4000-8000-000000000002', 'p0000002-0000-4000-8000-000000000002', 'Restylane Lyft (1 syringe)', 'Cheek augmentation and midface volume restoration.', 'filler', 55000, 45, TRUE),
  ('s0000002-0003-4000-8000-000000000003', 'p0000002-0000-4000-8000-000000000002', 'IPL Photofacial', 'Intense pulsed light for sun damage, redness, and pigmentation.', 'laser', 35000, 45, TRUE),
  ('s0000002-0004-4000-8000-000000000004', 'p0000002-0000-4000-8000-000000000002', 'PRP Hair Restoration', 'Platelet-rich plasma injections for hair thinning.', 'prp', 95000, 60, TRUE),

  -- Radiance Skin (Frisco)
  ('s0000003-0001-4000-8000-000000000001', 'p0000003-0000-4000-8000-000000000003', 'Botox (20 units)', 'Premium Botox treatment with precision injection technique.', 'botox', 8900, 30, TRUE),
  ('s0000003-0002-4000-8000-000000000002', 'p0000003-0000-4000-8000-000000000003', 'Sculptra (1 vial)', 'Collagen-stimulating injectable for gradual volume restoration.', 'filler', 65000, 60, TRUE),
  ('s0000003-0003-4000-8000-000000000003', 'p0000003-0000-4000-8000-000000000003', 'Laser Hair Removal (Full Face)', 'Permanent hair reduction with medical-grade laser.', 'laser', 25000, 30, TRUE),
  ('s0000003-0004-4000-8000-000000000004', 'p0000003-0000-4000-8000-000000000003', 'PRP Facial', 'Microneedling with PRP for collagen induction.', 'prp', 69900, 60, TRUE),
  ('s0000003-0005-4000-8000-000000000005', 'p0000003-0000-4000-8000-000000000003', 'Lip Filler (Juvederm Volbella)', 'Subtle, natural lip enhancement.', 'filler', 45000, 30, TRUE),

  -- Uptown Dermatology (Dallas)
  ('s0000004-0001-4000-8000-000000000001', 'p0000004-0000-4000-8000-000000000004', 'Botox (20 units)', 'Expert injection by board-certified dermatologist.', 'botox', 9500, 30, TRUE),
  ('s0000004-0002-4000-8000-000000000002', 'p0000004-0000-4000-8000-000000000004', 'Botox (60 units)', 'Full face treatment — forehead, crow''s feet, and bunny lines.', 'botox', 24900, 60, TRUE),
  ('s0000004-0003-4000-8000-000000000003', 'p0000004-0000-4000-8000-000000000004', 'Kybella (Double Chin)', 'FDA-approved injectable to destroy submental fat cells.', 'other', 85000, 45, TRUE),
  ('s0000004-0004-4000-8000-000000000004', 'p0000004-0000-4000-8000-000000000004', 'Chemical Peel (Medium Depth)', 'TCA peel for hyperpigmentation and fine lines.', 'other', 30000, 45, TRUE),

  -- Fort Worth Skin & Laser
  ('s0000005-0001-4000-8000-000000000001', 'p0000005-0000-4000-8000-000000000005', 'Botox (20 units)', 'Affordable Botox in Fort Worth. No hidden fees.', 'botox', 7500, 30, TRUE),
  ('s0000005-0002-4000-8000-000000000002', 'p0000005-0000-4000-8000-000000000005', 'Juvederm Voluma (1 syringe)', 'Cheek volume restoration that lasts up to 2 years.', 'filler', 59900, 45, TRUE),
  ('s0000005-0003-4000-8000-000000000003', 'p0000005-0000-4000-8000-000000000005', 'Laser Tattoo Removal (Small)', 'Q-switched laser for tattoo removal. Per session.', 'laser', 20000, 30, TRUE),
  ('s0000005-0004-4000-8000-000000000004', 'p0000005-0000-4000-8000-000000000005', 'PRP Knee Injection', 'Platelet-rich plasma for joint pain and sports injuries.', 'prp', 85000, 45, TRUE),

  -- Richardson Aesthetics
  ('s0000006-0001-4000-8000-000000000001', 'p0000006-0000-4000-8000-000000000006', 'Botox (20 units)', 'Concierge Botox experience with complimentary consultation.', 'botox', 9900, 45, TRUE),
  ('s0000006-0002-4000-8000-000000000002', 'p0000006-0000-4000-8000-000000000006', 'Radiesse (1 syringe)', 'Calcium-based filler for jawline and cheek contouring.', 'filler', 62000, 45, TRUE),
  ('s0000006-0003-4000-8000-000000000003', 'p0000006-0000-4000-8000-000000000006', 'BBL Hero (Full Face)', 'BroadBand Light for sun damage and skin rejuvenation.', 'laser', 45000, 45, TRUE),
  ('s0000006-0004-4000-8000-000000000004', 'p0000006-0000-4000-8000-000000000006', 'Microneedling with PRP', 'SkinPen microneedling combined with PRP serum.', 'prp', 55000, 60, TRUE);

-- Mock bookings (completed, for reviews)
INSERT INTO bookings (id, patient_id, provider_id, service_id, status, appointment_at, gfe_sent, created_at) VALUES
  ('bk000001-0000-4000-8000-000000000001', 'b1b2c3d4-0001-4000-8000-000000000001', 'p0000001-0000-4000-8000-000000000001', 's0000001-0001-4000-8000-000000000001', 'completed', NOW() - INTERVAL '30 days', TRUE, NOW() - INTERVAL '35 days'),
  ('bk000002-0000-4000-8000-000000000002', 'b1b2c3d4-0002-4000-8000-000000000002', 'p0000001-0000-4000-8000-000000000001', 's0000001-0003-4000-8000-000000000003', 'completed', NOW() - INTERVAL '20 days', TRUE, NOW() - INTERVAL '25 days'),
  ('bk000003-0000-4000-8000-000000000003', 'b1b2c3d4-0003-4000-8000-000000000003', 'p0000002-0000-4000-8000-000000000002', 's0000002-0001-4000-8000-000000000001', 'completed', NOW() - INTERVAL '15 days', TRUE, NOW() - INTERVAL '20 days'),
  ('bk000004-0000-4000-8000-000000000004', 'b1b2c3d4-0001-4000-8000-000000000001', 'p0000003-0000-4000-8000-000000000003', 's0000003-0001-4000-8000-000000000001', 'completed', NOW() - INTERVAL '10 days', TRUE, NOW() - INTERVAL '15 days'),
  ('bk000005-0000-4000-8000-000000000005', 'b1b2c3d4-0004-4000-8000-000000000004', 'p0000004-0000-4000-8000-000000000004', 's0000004-0001-4000-8000-000000000001', 'completed', NOW() - INTERVAL '7 days', TRUE, NOW() - INTERVAL '12 days'),
  ('bk000006-0000-4000-8000-000000000006', 'b1b2c3d4-0005-4000-8000-000000000005', 'p0000005-0000-4000-8000-000000000005', 's0000005-0001-4000-8000-000000000001', 'completed', NOW() - INTERVAL '5 days', TRUE, NOW() - INTERVAL '10 days'),
  ('bk000007-0000-4000-8000-000000000007', 'b1b2c3d4-0002-4000-8000-000000000002', 'p0000003-0000-4000-8000-000000000003', 's0000003-0004-4000-8000-000000000004', 'completed', NOW() - INTERVAL '3 days', TRUE, NOW() - INTERVAL '8 days'),
  ('bk000008-0000-4000-8000-000000000008', 'b1b2c3d4-0003-4000-8000-000000000003', 'p0000006-0000-4000-8000-000000000006', 's0000006-0001-4000-8000-000000000001', 'completed', NOW() - INTERVAL '2 days', TRUE, NOW() - INTERVAL '7 days'),
  ('bk000009-0000-4000-8000-000000000009', 'b1b2c3d4-0004-4000-8000-000000000004', 'p0000002-0000-4000-8000-000000000002', 's0000002-0003-4000-8000-000000000003', 'completed', NOW() - INTERVAL '1 day', TRUE, NOW() - INTERVAL '6 days'),
  ('bk000010-0000-4000-8000-000000000010', 'b1b2c3d4-0005-4000-8000-000000000005', 'p0000004-0000-4000-8000-000000000004', 's0000004-0003-4000-8000-000000000003', 'completed', NOW() - INTERVAL '1 day', TRUE, NOW() - INTERVAL '5 days');

-- Reviews
INSERT INTO reviews (booking_id, patient_id, provider_id, rating, title, body, provider_reply, created_at) VALUES
  ('bk000001-0000-4000-8000-000000000001', 'b1b2c3d4-0001-4000-8000-000000000001', 'p0000001-0000-4000-8000-000000000001', 5, 'Best Botox experience ever', 'Dr. Chen was incredibly thorough and the results are amazing. The price was exactly what was listed — no surprise fees. I saved over $100 compared to what my insurance would have charged.', 'Thank you Maria! We''re so glad you had a great experience. See you in 3 months!', NOW() - INTERVAL '28 days'),
  ('bk000002-0000-4000-8000-000000000002', 'b1b2c3d4-0002-4000-8000-000000000002', 'p0000001-0000-4000-8000-000000000001', 4, 'Great results, easy booking', 'The lip filler looks very natural. Booking through MedBridge was so simple — I could see the exact price upfront. Much better than calling around for quotes.', NULL, NOW() - INTERVAL '18 days'),
  ('bk000003-0000-4000-8000-000000000003', 'b1b2c3d4-0003-4000-8000-000000000003', 'p0000002-0000-4000-8000-000000000002', 5, 'Finally, transparent pricing!', 'I''ve been putting off Botox because I could never get a straight answer on price. MedBridge showed me the exact cost AND compared it to what my BCBS plan would charge. Cash was way cheaper. Dr. Rodriguez was fantastic.', 'Ashley, we appreciate you trusting us with your care! Transparent pricing is exactly why we partnered with MedBridge.', NOW() - INTERVAL '13 days'),
  ('bk000004-0000-4000-8000-000000000004', 'b1b2c3d4-0001-4000-8000-000000000001', 'p0000003-0000-4000-8000-000000000003', 5, 'Premium quality, fair price', 'Dr. Patel''s technique is excellent. The clinic in Frisco is beautiful and the staff is so welcoming. Paid $89 cash vs the $220 my insurance estimated. No brainer.', NULL, NOW() - INTERVAL '8 days'),
  ('bk000005-0000-4000-8000-000000000005', 'b1b2c3d4-0004-4000-8000-000000000004', 'p0000004-0000-4000-8000-000000000004', 4, 'Uptown quality', 'Very professional office in a great location. Dr. Nguyen took his time explaining everything. Price was a bit higher than some other places on MedBridge but the experience justified it.', 'Thank you Lisa! We believe in personalized care and appreciate your kind words.', NOW() - INTERVAL '5 days'),
  ('bk000006-0000-4000-8000-000000000006', 'b1b2c3d4-0005-4000-8000-000000000005', 'p0000005-0000-4000-8000-000000000005', 5, 'Best price in DFW', 'Dr. Thompson offers the best Botox price I''ve found in the whole DFW area. And it''s not lower quality — she has 8 years of experience and the results are perfect. Saved $75 vs going through my UHC plan.', NULL, NOW() - INTERVAL '3 days'),
  ('bk000007-0000-4000-8000-000000000007', 'b1b2c3d4-0002-4000-8000-000000000002', 'p0000003-0000-4000-8000-000000000003', 4, 'PRP facial was worth it', 'Was nervous about the PRP facial but Dr. Patel made me feel comfortable. Skin is glowing a week later. The cash price was very reasonable compared to other clinics.', 'Jennifer, so happy with your results! PRP is one of our favorite treatments. See you for the follow-up!', NOW() - INTERVAL '1 day'),
  ('bk000008-0000-4000-8000-000000000008', 'b1b2c3d4-0003-4000-8000-000000000003', 'p0000006-0000-4000-8000-000000000006', 5, 'Concierge-level care', 'The Richardson Aesthetics experience is truly concierge level. Dr. Kim spent 45 minutes with me for a Botox consultation AND treatment. The complimentary consultation is a great touch.', NULL, NOW() - INTERVAL '1 day'),
  ('bk000009-0000-4000-8000-000000000009', 'b1b2c3d4-0004-4000-8000-000000000004', 'p0000002-0000-4000-8000-000000000002', 4, 'IPL worked great', 'Had an IPL photofacial at DFW Aesthetics. Sun spots are already fading after one session. Price was transparent and fair. Will book again.', NULL, NOW() - INTERVAL '12 hours'),
  ('bk000010-0000-4000-8000-000000000010', 'b1b2c3d4-0005-4000-8000-000000000005', 'p0000004-0000-4000-8000-000000000004', 3, 'Good but pricey', 'The Kybella treatment went well but at $850 it''s one of the pricier options on MedBridge. Results are still developing — will update in a month. Staff was very professional.', 'Tanya, thank you for your honest feedback. Kybella results typically take 4-6 weeks to fully show. We look forward to your follow-up!', NOW() - INTERVAL '6 hours');
