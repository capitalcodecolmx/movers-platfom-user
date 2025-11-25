-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_id uuid,
  sender_id uuid,
  recipient_id uuid,
  message text NOT NULL,
  message_type text DEFAULT 'text'::text CHECK (message_type = ANY (ARRAY['text'::text, 'image'::text, 'file'::text, 'system'::text])),
  attachments jsonb,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id),
  CONSTRAINT messages_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.users(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  order_id uuid,
  type text NOT NULL CHECK (type = ANY (ARRAY['order_created'::text, 'quote_pending'::text, 'quote_ready'::text, 'payment_pending'::text, 'payment_confirmed'::text, 'payment_failed'::text, 'order_processed'::text, 'order_assigned'::text, 'order_picked_up'::text, 'order_in_transit'::text, 'order_delivered'::text, 'order_cancelled'::text, 'admin_message'::text])),
  title character varying NOT NULL,
  message text NOT NULL,
  data jsonb,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT notifications_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.order_tracking (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_id uuid,
  status text NOT NULL,
  location jsonb,
  notes text,
  updated_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_tracking_pkey PRIMARY KEY (id),
  CONSTRAINT order_tracking_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_tracking_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  tracking_code character varying NOT NULL UNIQUE,
  user_id uuid,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'quote_pending'::text, 'quote_ready'::text, 'payment_pending'::text, 'payment_confirmed'::text, 'processing'::text, 'assigned'::text, 'picked_up'::text, 'in_transit'::text, 'delivered'::text, 'cancelled'::text, 'failed'::text])),
  package_data jsonb,
  pickup_address jsonb,
  delivery_address jsonb,
  pickup_contact jsonb,
  delivery_contact jsonb,
  pickup_date date,
  pickup_time time without time zone,
  delivery_date date,
  delivery_time time without time zone,
  estimated_cost numeric,
  final_cost numeric,
  payment_status text DEFAULT 'pending'::text CHECK (payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'failed'::text, 'refunded'::text])),
  payment_method text,
  payment_reference text,
  bank_info jsonb,
  assigned_repartidor_id uuid,
  assigned_vehicle_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  processed_at timestamp with time zone,
  picked_up_at timestamp with time zone,
  delivered_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  admin_notes text,
  customer_notes text,
  attachments jsonb,
  payment_requested_at timestamp with time zone,
  payment_confirmed_at timestamp with time zone,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT orders_assigned_repartidor_id_fkey FOREIGN KEY (assigned_repartidor_id) REFERENCES public.users(id)
);
CREATE TABLE public.pricing_config (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  vehicle_type text NOT NULL,
  base_price_per_km numeric,
  price_per_kg numeric,
  price_per_m3 numeric,
  minimum_cost numeric,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pricing_config_pkey PRIMARY KEY (id)
);
CREATE TABLE public.quotes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_id uuid,
  distance_km numeric,
  weight_kg numeric,
  volume_m3 numeric,
  base_cost numeric,
  additional_fees jsonb,
  total_cost numeric,
  valid_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quotes_pkey PRIMARY KEY (id),
  CONSTRAINT quotes_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.user_profiles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  address text,
  city character varying,
  state character varying,
  postal_code character varying,
  country character varying DEFAULT 'México'::character varying,
  company_name character varying,
  tax_id character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email character varying NOT NULL UNIQUE,
  full_name character varying NOT NULL,
  phone character varying,
  role text NOT NULL DEFAULT 'user'::text CHECK (role = ANY (ARRAY['user'::text, 'admin'::text, 'repartidor'::text])),
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.vehicles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['moto'::text, 'auto'::text, 'van'::text, 'camion'::text, 'bicicleta'::text])),
  license_plate character varying UNIQUE,
  capacity_kg numeric,
  capacity_volume numeric,
  is_active boolean DEFAULT true,
  current_location jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  image text,
  CONSTRAINT vehicles_pkey PRIMARY KEY (id)
);