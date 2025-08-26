-- schema.sql
-- Configuración completa para la base de datos del ecommerce de pijamas en Supabase.

-- 1. Creación de la tabla de productos (products)
-- Almacena toda la información relacionada con los productos.
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  description text NULL,
  price numeric NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  category text NULL,
  sizes jsonb NULL,
  colors jsonb NULL,
  images jsonb NULL,
  is_featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active'::text,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_price_check CHECK ((price >= (0)::numeric)),
  CONSTRAINT products_stock_check CHECK ((stock >= 0))
);

COMMENT ON TABLE public.products IS 'Tabla para almacenar los productos de la tienda.';

-- 2. Creación de la tabla de órdenes (orders)
-- Almacena la información de las órdenes de compra.
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  total numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT orders_total_check CHECK ((total >= (0)::numeric))
);

COMMENT ON TABLE public.orders IS 'Tabla para almacenar las órdenes de los clientes.';

-- 3. Creación de la tabla de ítems de orden (order_items)
-- Tabla intermedia para la relación muchos-a-muchos entre órdenes y productos.
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  "size" text NULL,
  color text NULL,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE,
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT order_items_price_check CHECK ((price >= (0)::numeric)),
  CONSTRAINT order_items_quantity_check CHECK ((quantity > 0))
);

COMMENT ON TABLE public.order_items IS 'Tabla que relaciona productos con órdenes.';


-- 4. Habilitar Row Level Security (RLS)
-- Es una buena práctica de seguridad habilitar RLS en todas las tablas.
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;


-- 5. Políticas de Seguridad (Policies)
-- Define quién puede hacer qué en la base de datos.

-- Política para `products`: Cualquiera puede leer los productos activos.
CREATE POLICY "Allow public read access to active products"
ON public.products
FOR SELECT
USING (status = 'active'::text);

-- Política para `orders`: Los usuarios solo pueden ver sus propias órdenes.
CREATE POLICY "Allow individual read access to own orders"
ON public.orders
FOR SELECT
USING (auth.uid() = user_id);

-- Política para `orders`: Los usuarios pueden crear órdenes para sí mismos.
CREATE POLICY "Allow individual insert access to own orders"
ON public.orders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política para `order_items`: Los usuarios pueden ver los ítems de sus propias órdenes.
CREATE POLICY "Allow individual read access to own order items"
ON public.order_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.orders
    WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  )
);

-- Política para `order_items`: Los usuarios pueden insertar ítems en sus propias órdenes.
CREATE POLICY "Allow individual insert access to own order items"
ON public.order_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.orders
    WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  )
);

-- NOTA PARA ADMIN: Para el CRUD de productos y la gestión de órdenes,
-- deberás usar la `service_role_key` en el backend (API routes),
-- lo que te permitirá saltar las políticas de RLS.
-- Opcionalmente, puedes crear políticas específicas para un rol de 'admin'.

-- 6. Configuración de Supabase Storage para imágenes de productos
-- Ve a tu dashboard de Supabase -> Storage y crea un nuevo bucket llamado `product-images`.
-- Hazlo público para que las imágenes se puedan mostrar en el frontend.
-- Luego, puedes configurar políticas de acceso más granulares si es necesario.

-- Fin del script.

-- 7. Función SQL para crear orden e items y decrementar stock de forma atómica
CREATE OR REPLACE FUNCTION public.create_order_with_items(
  p_user_id uuid,
  p_items jsonb,
  p_shipping_address jsonb DEFAULT NULL,
  p_billing_address jsonb DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id uuid := gen_random_uuid();
  v_total numeric := 0;
  v_item jsonb;
  v_price numeric;
  v_qty integer;
  v_product uuid;
BEGIN
  -- Validar que el usuario autenticado coincida con p_user_id
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;
  -- Calcular total y verificar stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product := (v_item->>'product_id')::uuid;
    v_qty := (v_item->>'quantity')::int;
    SELECT price INTO v_price FROM public.products WHERE id = v_product FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Producto no encontrado'; END IF;
    PERFORM 1 FROM public.products WHERE id = v_product AND stock >= v_qty;
    IF NOT FOUND THEN RAISE EXCEPTION 'Stock insuficiente para %', v_product; END IF;
    v_total := v_total + (v_price * v_qty);
  END LOOP;

  -- Crear orden (incluye direcciones si fueron provistas)
  INSERT INTO public.orders(id, user_id, total, status, shipping_address, billing_address)
  VALUES (v_order_id, p_user_id, v_total, 'pending', p_shipping_address, COALESCE(p_billing_address, p_shipping_address));

  -- Insertar items y descontar stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product := (v_item->>'product_id')::uuid;
    v_qty := (v_item->>'quantity')::int;
    SELECT price INTO v_price FROM public.products WHERE id = v_product;
    INSERT INTO public.order_items(order_id, product_id, quantity, price, size, color)
    VALUES (v_order_id, v_product, v_qty, v_price, v_item->>'size', v_item->>'color');
    UPDATE public.products SET stock = stock - v_qty WHERE id = v_product;
  END LOOP;

  RETURN v_order_id;
END;
$$;

-- Asegurar permisos de ejecución adecuados (usuarios autenticados)
REVOKE ALL ON FUNCTION public.create_order_with_items(uuid, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order_with_items(uuid, jsonb) TO authenticated;

-- 8. Perfiles de usuario y direcciones (opcional pero recomendado)
-- Tabla de perfiles básicos vinculada a auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  full_name text NULL,
  phone text NULL,
  role text NOT NULL DEFAULT 'user',
  avatar_url text NULL
);

COMMENT ON TABLE public.profiles IS 'Perfiles de usuario visibles y editables por el propio usuario.';

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de perfiles: cada usuario gestiona su propio perfil
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Allow read own profile'
  ) THEN
    CREATE POLICY "Allow read own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Allow update own profile'
  ) THEN
    CREATE POLICY "Allow update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Allow insert own profile'
  ) THEN
    CREATE POLICY "Allow insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Trigger simple para updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Tabla de direcciones de usuario
CREATE TABLE IF NOT EXISTS public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NULL,
  line1 text NOT NULL,
  line2 text NULL,
  city text NOT NULL,
  state text NULL,
  postal_code text NULL,
  country text NOT NULL DEFAULT 'CO',
  phone text NULL,
  is_default_shipping boolean NOT NULL DEFAULT false,
  is_default_billing boolean NOT NULL DEFAULT false
);

COMMENT ON TABLE public.addresses IS 'Direcciones de envío y facturación de los usuarios.';

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'addresses' AND policyname = 'Allow read own addresses'
  ) THEN
    CREATE POLICY "Allow read own addresses"
    ON public.addresses
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'addresses' AND policyname = 'Allow modify own addresses'
  ) THEN
    CREATE POLICY "Allow modify own addresses"
    ON public.addresses
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS addresses_user_id_idx ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS addresses_user_defaults_idx ON public.addresses(user_id, is_default_shipping, is_default_billing);

-- Extensiones e índices útiles
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Índices de productos para filtros y búsqueda
CREATE INDEX IF NOT EXISTS products_status_featured_idx ON public.products(status, is_featured);
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category);
CREATE INDEX IF NOT EXISTS products_name_trgm_idx ON public.products USING gin (name gin_trgm_ops);

-- Índices de órdenes
CREATE INDEX IF NOT EXISTS orders_user_created_idx ON public.orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON public.order_items(order_id);

-- Metadatos adicionales en órdenes (opcionales, no rompen compatibilidad)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_number bigserial,
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'COP',
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS shipping_address jsonb NULL,
  ADD COLUMN IF NOT EXISTS billing_address jsonb NULL,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number_uniq ON public.orders(order_number);

