-- Public portfolio images (personal sites): Supabase Storage bucket + RLS.
-- Object paths: {workspace_id}/{page_id}/{uuid}.{ext}

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "portfolio_public_read" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_owner_insert" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_owner_update" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_owner_delete" ON storage.objects;

-- Public URLs work because the bucket is `public`; no broad SELECT policy (avoids listing the whole bucket).

CREATE POLICY "portfolio_owner_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'portfolio'
  AND split_part(name, '/', 1) IN (
    SELECT id::text FROM public.workspaces WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "portfolio_owner_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'portfolio'
  AND split_part(name, '/', 1) IN (
    SELECT id::text FROM public.workspaces WHERE owner_id = auth.uid()
  )
)
WITH CHECK (
  bucket_id = 'portfolio'
  AND split_part(name, '/', 1) IN (
    SELECT id::text FROM public.workspaces WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "portfolio_owner_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'portfolio'
  AND split_part(name, '/', 1) IN (
    SELECT id::text FROM public.workspaces WHERE owner_id = auth.uid()
  )
);
