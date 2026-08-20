-- ============================================
-- Cane Guard Database Schema
-- Run entire file in Supabase SQL Editor
-- ============================================

-- Enums
CREATE TYPE incident_category AS ENUM (
  'FIRE', 'PEST', 'DISEASE', 'FLOODING', 'OTHER'
);

CREATE TYPE incident_status AS ENUM (
  'OPEN', 'ON_PROGRESS', 'CLOSED'
);

-- ============================================
-- Incidents table
-- ============================================
CREATE TABLE incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category incident_category NOT NULL,
  description text NOT NULL,
  reporter_name text,
  reporter_note text,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  photo_path text,
  photo_url text,
  status incident_status NOT NULL DEFAULT 'OPEN',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_incidents_created_at ON incidents (created_at DESC);
CREATE INDEX idx_incidents_status ON incidents (status);
CREATE INDEX idx_incidents_category ON incidents (category);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_incidents_updated_at
  BEFORE UPDATE ON incidents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Public: anyone can report incidents
CREATE POLICY "Public can insert incidents"
  ON incidents
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Public: anyone can read incidents
CREATE POLICY "Public can read incidents"
  ON incidents
  FOR SELECT
  TO public
  USING (true);

-- Public: can update status (demo mode)
CREATE POLICY "Public can update incidents"
  ON incidents
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Authenticated: can delete incidents
CREATE POLICY "Authenticated can delete incidents"
  ON incidents
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Storage Bucket: incident-reports
-- Creates a public bucket for incident photos
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('incident-reports', 'incident-reports', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ============================================
-- Storage RLS Policies
-- ============================================

-- Public: anyone can view incident photos
CREATE POLICY "Public read incident photos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'incident-reports');

-- Public: anyone can upload incident photos (for anonymous reporting)
CREATE POLICY "Public insert incident photos"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'incident-reports');

-- Authenticated: can delete incident photos (admin cleanup)
CREATE POLICY "Authenticated delete incident photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'incident-reports');
