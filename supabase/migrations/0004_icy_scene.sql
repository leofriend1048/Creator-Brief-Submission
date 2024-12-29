/*
  # Add storage policies for service role access

  1. Storage Policies
    - Allow service role to perform all operations
*/

-- Allow service role to perform all operations
CREATE POLICY "Service Role Access"
ON storage.objects
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow service role to access bucket
ALTER BUCKET uploads ENABLE service_role;