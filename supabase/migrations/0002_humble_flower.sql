/*
  # Video Upload & Script Validation Schema

  1. Tables
    - public_links: Stores public upload links and their associated scripts
      - id (uuid, primary key)
      - url_key (text, unique): Public identifier for sharing
      - script_text (text): The original script to validate against
      - status (text): Current status of the link
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - uploads: Stores uploaded files and their validation results
      - id (uuid, primary key)
      - public_link_id (uuid, foreign key)
      - file_path (text): Storage path
      - file_name (text): Original filename
      - file_size (bigint): File size in bytes
      - transcription (text, nullable): Audio/video transcription
      - validation_report (jsonb, nullable): Validation results
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - audit_logs: Tracks system events
      - id (uuid, primary key)
      - public_link_id (uuid, foreign key)
      - action (text): Event type
      - details (jsonb, nullable): Additional event data
      - created_at (timestamptz)

  2. Extensions
    - uuid-ossp: For UUID generation

  3. Security
    - RLS enabled on all tables
    - Policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create public_links table
CREATE TABLE IF NOT EXISTS public_links (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  url_key text UNIQUE NOT NULL,
  script_text text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_link_id uuid REFERENCES public_links(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL CHECK (file_size > 0),
  transcription text,
  validation_report jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_link_id uuid REFERENCES public_links(id) ON DELETE CASCADE,
  action text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow all operations for authenticated users"
  ON public_links
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users"
  ON uploads
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users"
  ON audit_logs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_public_links_updated_at
  BEFORE UPDATE ON public_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_uploads_updated_at
  BEFORE UPDATE ON uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_public_links_url_key ON public_links(url_key);
CREATE INDEX IF NOT EXISTS idx_uploads_public_link_id ON uploads(public_link_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_public_link_id ON audit_logs(public_link_id);
CREATE INDEX IF NOT EXISTS idx_public_links_created_at ON public_links(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_uploads_created_at ON uploads(created_at DESC);