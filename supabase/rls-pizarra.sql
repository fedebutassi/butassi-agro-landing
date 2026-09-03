-- =====================================================
-- RLS Policies para el bucket "pizarra" en Supabase Storage
-- Ejecutar en: Supabase Dashboard > SQL Editor
--
-- IMPORTANTE: Usar public.has_role() en vez de consulta
-- directa a user_roles para evitar conflicto de RLS
-- recursivo (user_roles también tiene RLS habilitado).
-- =====================================================

-- 1. Limpiar políticas existentes
DROP POLICY IF EXISTS "pizarra_public_read" ON storage.objects;
DROP POLICY IF EXISTS "pizarra_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "pizarra_admin_delete" ON storage.objects;
DROP POLICY IF EXISTS "pizarra_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view pizarra images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view pizarra images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload pizarra images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update pizarra images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete pizarra images" ON storage.objects;

-- 2. Lectura pública: cualquiera puede ver las imágenes de la pizarra
CREATE POLICY "Public can view pizarra images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'pizarra');

-- 3. Solo admins pueden subir imágenes
CREATE POLICY "Admins can upload pizarra images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'pizarra' AND public.has_role(auth.uid(), 'admin'));

-- 4. Solo admins pueden actualizar imágenes
CREATE POLICY "Admins can update pizarra images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'pizarra' AND public.has_role(auth.uid(), 'admin'));

-- 5. Solo admins pueden eliminar imágenes
CREATE POLICY "Admins can delete pizarra images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'pizarra' AND public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- Para verificar que las políticas se aplicaron:
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects';
-- =====================================================
