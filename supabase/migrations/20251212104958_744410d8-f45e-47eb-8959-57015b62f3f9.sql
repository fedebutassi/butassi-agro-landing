-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Only admins can manage roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for pizarra images
INSERT INTO storage.buckets (id, name, public) VALUES ('pizarra', 'pizarra', true);

-- Storage policies: Anyone can view pizarra images
CREATE POLICY "Anyone can view pizarra images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'pizarra');

-- Storage policies: Only admins can upload/update/delete pizarra images
CREATE POLICY "Admins can upload pizarra images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'pizarra' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pizarra images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'pizarra' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete pizarra images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'pizarra' AND public.has_role(auth.uid(), 'admin'));