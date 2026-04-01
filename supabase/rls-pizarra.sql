-- =====================================================
-- RLS Policies para el bucket "pizarra" en Supabase Storage
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. Habilitar RLS en storage.objects (ya debería estar activo por defecto)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Lectura pública: cualquiera puede ver las imágenes de la pizarra
CREATE POLICY "pizarra_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'pizarra');

-- 3. Solo admins pueden subir imágenes
CREATE POLICY "pizarra_admin_insert"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pizarra'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
);

-- 4. Solo admins pueden eliminar imágenes
CREATE POLICY "pizarra_admin_delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pizarra'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
);

-- 5. Solo admins pueden actualizar imágenes
CREATE POLICY "pizarra_admin_update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pizarra'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
);

-- =====================================================
-- Para verificar que las políticas se aplicaron:
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects';
-- =====================================================
