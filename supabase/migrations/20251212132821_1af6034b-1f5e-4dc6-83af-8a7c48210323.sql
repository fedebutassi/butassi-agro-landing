-- Drop existing storage policies for pizarra bucket if they exist
DROP POLICY IF EXISTS "Public can view pizarra images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload pizarra images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update pizarra images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete pizarra images" ON storage.objects;

-- Recreate storage policies for pizarra bucket
-- Allow public read access
CREATE POLICY "Public can view pizarra images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'pizarra');

-- Allow authenticated admins to upload images
CREATE POLICY "Admins can upload pizarra images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pizarra' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated admins to update images
CREATE POLICY "Admins can update pizarra images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'pizarra' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated admins to delete images
CREATE POLICY "Admins can delete pizarra images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'pizarra' 
  AND public.has_role(auth.uid(), 'admin')
);