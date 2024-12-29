/*
  # Add storage policies for uploads bucket

  1. Storage Policies
    - Create uploads bucket if it doesn't exist
    - Enable public access for authenticated users
    - Allow file uploads for authenticated users
    - Allow file downloads for authenticated users
*/

-- Create uploads bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to uploaded files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'uploads');

-- Allow authenticated users to upload files
CREATE POLICY "Allow uploads for authenticated users"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads');

-- Allow authenticated users to update their files
CREATE POLICY "Allow updates for authenticated users"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'uploads');

-- Allow authenticated users to delete their files
CREATE POLICY "Allow deletes for authenticated users"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'uploads');