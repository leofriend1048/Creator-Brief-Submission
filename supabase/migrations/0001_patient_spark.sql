/*
  # Initial Schema Setup for Video Upload App

  1. New Tables
    - `public_links`
      - `id` (uuid, primary key)
      - `url_key` (text, unique) - The unique identifier for the public link
      - `script_text` (text) - The script to validate against
      - `status` (text) - Current status of the submission
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `uploads`
      - `id` (uuid, primary key)
      - `public_link_id` (uuid, foreign key)
      - `file_path` (text) - Path to the file in Supabase storage
      - `file_name` (text) - Original file name
      - `file_size` (bigint) - Size in bytes
      - `transcription` (text) - Transcribed text from Deepgram
      - `validation_report` (jsonb) - GPT analysis report
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `audit_logs`
      - `id` (uuid, primary key)
      - `public_link_id` (uuid, foreign key)
      - `action` (text) - Type of action performed
      - `details` (jsonb) - Additional details about the action
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create public_links table
CREATE TABLE IF NOT EXISTS public_links (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  url_key text UNIQUE NOT NULL,
  script_text text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_link_id uuid REFERENCES public_links(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL,
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
CREATE POLICY "Allow all operations for authenticated users" ON public_links
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON uploads
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON audit_logs
  FOR ALL TO authenticated
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