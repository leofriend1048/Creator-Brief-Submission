/*
  # Enhanced Validation Schema

  1. Updates
    - Add new columns to uploads table for enhanced validation data
    - Add new tables for detailed validation tracking
    - Update validation_report structure

  2. New Tables
    - `validation_reports` - Stores detailed validation results
    - `deviations` - Stores specific script deviations
    - `tone_and_pacing` - Stores delivery analysis

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Add new columns to uploads table
ALTER TABLE uploads
ADD COLUMN IF NOT EXISTS duration text,
ADD COLUMN IF NOT EXISTS validation_score integer;

-- Create validation_reports table
CREATE TABLE IF NOT EXISTS validation_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id uuid REFERENCES uploads(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create deviations table
CREATE TABLE IF NOT EXISTS deviations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  validation_report_id uuid REFERENCES validation_reports(id) ON DELETE CASCADE,
  severity text NOT NULL CHECK (severity IN ('high', 'medium', 'low')),
  timestamp text,
  description text NOT NULL,
  original_text text NOT NULL,
  transcribed_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tone_and_pacing table
CREATE TABLE IF NOT EXISTS tone_and_pacing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  validation_report_id uuid REFERENCES validation_reports(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('pacing', 'tone', 'volume')),
  timestamp text,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE validation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE deviations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tone_and_pacing ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations for authenticated users"
  ON validation_reports
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users"
  ON deviations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users"
  ON tone_and_pacing
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_validation_reports_upload_id 
  ON validation_reports(upload_id);
CREATE INDEX IF NOT EXISTS idx_deviations_validation_report_id 
  ON deviations(validation_report_id);
CREATE INDEX IF NOT EXISTS idx_tone_and_pacing_validation_report_id 
  ON tone_and_pacing(validation_report_id);

-- Update validation_report column in uploads table
COMMENT ON COLUMN uploads.validation_report IS 'Deprecated: Use validation_reports table instead';