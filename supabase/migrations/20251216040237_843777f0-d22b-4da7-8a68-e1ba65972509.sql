-- Eliminar política redundante de clientes (la permisiva ya existe)
DROP POLICY IF EXISTS "Admins can insert clientes" ON public.clientes;