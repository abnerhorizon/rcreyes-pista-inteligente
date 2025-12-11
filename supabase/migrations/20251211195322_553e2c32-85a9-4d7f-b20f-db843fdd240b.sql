-- Crear función para verificar si existen usuarios (accesible sin autenticación)
CREATE OR REPLACE FUNCTION public.check_users_exist()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles LIMIT 1)
$$;