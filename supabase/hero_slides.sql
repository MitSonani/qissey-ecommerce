-- Hero Slides Table
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  desktop_image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  title TEXT,
  subtitle TEXT,
  link_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Allow public to read active slides
DROP POLICY IF EXISTS "Public can view active hero slides" ON hero_slides;
CREATE POLICY "Public can view active hero slides" ON hero_slides
  FOR SELECT USING (is_active = true);

-- Allow admins full access
DROP POLICY IF EXISTS "Admins can manage hero slides" ON hero_slides;
CREATE POLICY "Admins can manage hero slides" ON hero_slides
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Seed data (current hardcoded slides)
INSERT INTO hero_slides (desktop_image_url, mobile_image_url, title, subtitle, order_index)
VALUES 
  ('/images/hero/hero1.png', '/images/hero/hero1.png', 'RAW MINIMAL', 'Spring Summer 2026 Collection', 1),
  ('/images/hero/hero2.png', '/images/hero/hero1.png', 'MODERN LINES', 'Spring Summer 2026 Collection', 2),
  ('/images/hero/hero3.png', '/images/hero/hero1.png', 'ETHYREAL FLOW', 'Spring Summer 2026 Collection', 3)
ON CONFLICT DO NOTHING;
