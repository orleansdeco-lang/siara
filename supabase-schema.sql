-- ==============================================================================
-- SIARA Workshop Database Schema for Supabase (PostgreSQL)
-- Version 2.0 - Production Ready with RLS, Indexes & Seed Data
-- ==============================================================================

-- Enable required extensions
create extension if not exists pgcrypto;

-- 1. Garages table
create table if not exists garages (
  id bigserial primary key,
  name text not null default 'SIARA Workshop',
  address text default 'Alger, Algérie',
  phone text default '+213 555 00 11 22',
  email text default 'contact@siara-dz.com',
  currency text not null default 'DZD',
  created_at timestamptz not null default now()
);

-- 2. Users / Employees table
create table if not exists users (
  id bigserial primary key,
  garage_id bigint references garages(id) on delete cascade,
  full_name text not null,
  role text not null default 'technician',
  phone text,
  email text,
  commission_rate numeric not null default 5,
  commission_fixed_amount numeric not null default 0,
  monthly_salary numeric not null default 45000,
  days_present integer not null default 24,
  days_absent integer not null default 0,
  days_late integer not null default 0,
  notes text,
  is_active boolean not null default true,
  started_at date default current_date,
  created_at timestamptz not null default now()
);

-- 3. Clients table
create table if not exists clients (
  id bigserial primary key,
  garage_id bigint references garages(id) on delete cascade,
  full_name text not null,
  phone text not null,
  plate_number text,
  company_name text default 'Particulier',
  notes text,
  created_at timestamptz not null default now()
);

-- 4. Vehicles table
create table if not exists vehicles (
  id bigserial primary key,
  garage_id bigint references garages(id) on delete cascade,
  client_id bigint references clients(id) on delete set null,
  plate_number text not null,
  brand text not null,
  model text not null,
  engine text,
  generation text,
  mileage integer not null default 0,
  last_service_at date,
  recommended_oil text default '5W-30',
  oil_spec text default 'API SN',
  oil_quantity_liters numeric default 4.5,
  fuel_type text default 'diesel',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

-- 5. Vehicle Models Reference table
create table if not exists vehicle_models (
  id bigserial primary key,
  garage_id bigint references garages(id) on delete cascade,
  model_name text not null,
  generation text,
  engine_code text,
  fuel_type text,
  year_start integer,
  year_end integer,
  oil_capacity_liters numeric,
  oil_capacity_with_filter numeric,
  oil_capacity_without_filter numeric,
  recommended_viscosity text,
  recommended_spec text,
  compatible_filter_refs jsonb not null default '[]'::jsonb,
  recommended_interval_km integer default 10000,
  recommended_interval_km_normal integer default 10000,
  recommended_interval_km_severe integer default 5000,
  oil_change_notes text,
  status text not null default 'verified',
  created_at timestamptz not null default now()
);

-- 6. Inventory / Stock table
create table if not exists inventory (
  id bigserial primary key,
  garage_id bigint references garages(id) on delete cascade,
  barcode text unique,
  product_name text not null,
  category text not null default 'Huile',
  brand text default 'MANNOL',
  part_number text,
  engine_compatibility text,
  quantity numeric not null default 0,
  min_qty numeric not null default 5,
  purchase_price numeric not null default 0,
  sale_price numeric not null default 0,
  supplier text,
  supplier_phone text,
  supplier_contact text,
  location text default 'Étagère A1',
  expiry_date date,
  warranty text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. Services table
create table if not exists services (
  id bigserial primary key,
  garage_id bigint references garages(id) on delete cascade,
  client_id bigint references clients(id) on delete set null,
  vehicle_id bigint references vehicles(id) on delete set null,
  employee_id bigint references users(id) on delete set null,
  customer_name text,
  customer_phone text,
  plate_number text,
  vehicle_model text,
  service_type text not null default 'Vidange + filtres',
  mileage integer default 0,
  oil_type text,
  filters_used text,
  labor_cost numeric not null default 0,
  total_amount numeric not null default 0,
  paid_amount numeric not null default 0,
  payment_status text not null default 'payé',
  notes text,
  service_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- 8. Service Items (Line items for each service)
create table if not exists service_items (
  id bigserial primary key,
  service_id bigint not null references services(id) on delete cascade,
  inventory_id bigint references inventory(id) on delete set null,
  item_type text not null,
  item_name text not null,
  quantity numeric not null default 1,
  unit_price numeric not null default 0,
  subtotal numeric not null default 0,
  created_at timestamptz not null default now()
);

-- 9. Transactions (Financial Ledger: Revenue, Expenses, Debts)
create table if not exists transactions (
  id bigserial primary key,
  garage_id bigint references garages(id) on delete cascade,
  service_id bigint references services(id) on delete set null,
  client_id bigint references clients(id) on delete set null,
  type text not null,
  category text not null,
  description text not null,
  amount numeric not null default 0,
  related_party text,
  payment_method text default 'Espèces',
  status text not null default 'effectué',
  due_date date,
  created_at timestamptz not null default now()
);

-- 10. Reviews & Customer Feedback (QR Code Feedbacks)
create table if not exists reviews (
  id bigserial primary key,
  garage_id bigint references garages(id) on delete cascade,
  service_id bigint references services(id) on delete set null,
  customer_name text not null,
  rating integer not null default 5 check (rating >= 1 and rating <= 5),
  comment text,
  status text not null default 'published',
  created_at timestamptz not null default now()
);

-- 11. Appointments table
create table if not exists appointments (
  id bigserial primary key,
  garage_id bigint references garages(id) on delete cascade,
  client_id bigint references clients(id) on delete set null,
  vehicle_id bigint references vehicles(id) on delete set null,
  customer_name text not null,
  phone text not null,
  service_type text not null default 'Vidange',
  appointment_date timestamptz not null,
  status text not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now()
);

-- 12. Bays / Workshop Posts
create table if not exists bays (
  id bigserial primary key,
  garage_id bigint references garages(id) on delete cascade,
  bay_name text not null,
  status text not null default 'free',
  current_vehicle text,
  eta text,
  created_at timestamptz not null default now()
);

-- 13. Daily Stats table
create table if not exists daily_stats (
  id bigserial primary key,
  garage_id bigint references garages(id) on delete cascade,
  stat_date date not null default current_date,
  revenue numeric not null default 0,
  expenses numeric not null default 0,
  profit numeric not null default 0,
  cash_register numeric not null default 0,
  services_count integer not null default 0,
  created_at timestamptz not null default now(),
  unique (garage_id, stat_date)
);

-- 14. Notifications table
create table if not exists notifications (
  id bigserial primary key,
  garage_id bigint references garages(id) on delete cascade,
  title text not null,
  message text not null,
  severity text not null default 'info',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
create index if not exists idx_clients_phone on clients(phone);
create index if not exists idx_clients_plate on clients(plate_number);
create index if not exists idx_vehicles_plate on vehicles(plate_number);
create index if not exists idx_inventory_barcode on inventory(barcode);
create index if not exists idx_services_date on services(service_date);
create index if not exists idx_transactions_created on transactions(created_at);
create index if not exists idx_reviews_rating on reviews(rating);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table garages enable row level security;
alter table users enable row level security;
alter table clients enable row level security;
alter table vehicles enable row level security;
alter table vehicle_models enable row level security;
alter table inventory enable row level security;
alter table services enable row level security;
alter table service_items enable row level security;
alter table transactions enable row level security;
alter table reviews enable row level security;
alter table appointments enable row level security;
alter table bays enable row level security;
alter table daily_stats enable row level security;
alter table notifications enable row level security;

-- Garages policy
drop policy if exists "Enable access for all users" on garages;
create policy "Enable access for all users" on garages for all using (true) with check (true);

-- Users policy
drop policy if exists "Enable access for all users" on users;
create policy "Enable access for all users" on users for all using (true) with check (true);

-- Clients policy
drop policy if exists "Enable access for all users" on clients;
create policy "Enable access for all users" on clients for all using (true) with check (true);

-- Vehicles policy
drop policy if exists "Enable access for all users" on vehicles;
create policy "Enable access for all users" on vehicles for all using (true) with check (true);

-- Vehicle models policy
drop policy if exists "Enable access for all users" on vehicle_models;
create policy "Enable access for all users" on vehicle_models for all using (true) with check (true);

-- Inventory policy
drop policy if exists "Enable access for all users" on inventory;
create policy "Enable access for all users" on inventory for all using (true) with check (true);

-- Services policy
drop policy if exists "Enable access for all users" on services;
create policy "Enable access for all users" on services for all using (true) with check (true);

-- Service Items policy
drop policy if exists "Enable access for all users" on service_items;
create policy "Enable access for all users" on service_items for all using (true) with check (true);

-- Transactions policy
drop policy if exists "Enable access for all users" on transactions;
create policy "Enable access for all users" on transactions for all using (true) with check (true);

-- Reviews policy
drop policy if exists "Enable access for all users" on reviews;
create policy "Enable access for all users" on reviews for all using (true) with check (true);

-- Appointments policy
drop policy if exists "Enable access for all users" on appointments;
create policy "Enable access for all users" on appointments for all using (true) with check (true);

-- Bays policy
drop policy if exists "Enable access for all users" on bays;
create policy "Enable access for all users" on bays for all using (true) with check (true);

-- Daily stats policy
drop policy if exists "Enable access for all users" on daily_stats;
create policy "Enable access for all users" on daily_stats for all using (true) with check (true);

-- Notifications policy
drop policy if exists "Enable access for all users" on notifications;
create policy "Enable access for all users" on notifications for all using (true) with check (true);

-- ==============================================================================
-- SEED DATA
-- ==============================================================================
insert into garages (id, name, address, phone, email, currency)
values (1, 'SIARA Workshop Alger', 'Bir Mourad Raïs, Alger', '+213 555 12 34 56', 'contact@siara-workshop.dz', 'DZD')
on conflict (id) do nothing;

-- ==============================================================================
-- AUTHENTICATED ACCOUNTS AND STRICT PER-GARAGE ISOLATION
-- Run this section after enabling Supabase Auth.
-- ==============================================================================

create table if not exists public.garage_members (
  user_id uuid not null references auth.users(id) on delete cascade,
  garage_id bigint not null references public.garages(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  primary key (user_id, garage_id)
);

-- A customer identity is attached to the existing client row; no separate
-- personal-app database is required.
alter table public.clients add column if not exists auth_user_id uuid references auth.users(id) on delete set null;
create index if not exists clients_auth_user_id_idx on public.clients(auth_user_id);

alter table public.garages add column if not exists owner_id uuid references auth.users(id) on delete set null;
alter table public.garages add column if not exists wilaya text;
alter table public.garages add column if not exists storefront_image_url text;
alter table public.garages add column if not exists owner_name text;
alter table public.garages add column if not exists owner_phone text;

create index if not exists garage_members_garage_id_idx on public.garage_members(garage_id);

create or replace function public.my_garage_ids()
returns setof bigint
language sql
stable
security definer
set search_path = public
as $$
  select garage_id from public.garage_members where user_id = auth.uid();
$$;

alter table public.garage_members enable row level security;
drop policy if exists "Members can view their memberships" on public.garage_members;
create policy "Members can view their memberships" on public.garage_members
  for select to authenticated using (user_id = auth.uid());
drop policy if exists "Members can create their membership" on public.garage_members;
create policy "Members can create their membership" on public.garage_members
  for insert to authenticated with check (user_id = auth.uid());

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'garages', 'users', 'clients', 'vehicles', 'vehicle_models',
    'inventory', 'services', 'transactions', 'reviews',
    'appointments', 'bays', 'daily_stats', 'notifications'
  ] loop
    execute format('drop policy if exists "Enable access for all users" on public.%I', table_name);
    execute format('drop policy if exists "Account members can access garage data" on public.%I', table_name);
    execute format(
      'create policy "Account members can access garage data" on public.%I for all to authenticated using (garage_id in (select public.my_garage_ids())) with check (garage_id in (select public.my_garage_ids()))',
      table_name
    );
  end loop;
end $$;

drop policy if exists "Customers can view their own client record" on public.clients;
create policy "Customers can view their own client record" on public.clients
  for select to authenticated using (auth_user_id = auth.uid());

drop policy if exists "Customers can view their own vehicles" on public.vehicles;
create policy "Customers can view their own vehicles" on public.vehicles
  for select to authenticated using (
    client_id in (select id from public.clients where auth_user_id = auth.uid())
  );

drop policy if exists "Customers can view their own services" on public.services;
create policy "Customers can view their own services" on public.services
  for select to authenticated using (
    client_id in (select id from public.clients where auth_user_id = auth.uid())
    or vehicle_id in (
      select id from public.vehicles
      where client_id in (select id from public.clients where auth_user_id = auth.uid())
    )
  );

drop policy if exists "Account members can access service items" on public.service_items;
create policy "Account members can access service items" on public.service_items
  for all to authenticated
  using (service_id in (select id from public.services where garage_id in (select public.my_garage_ids())))
  with check (service_id in (select id from public.services where garage_id in (select public.my_garage_ids())));

insert into users (id, garage_id, full_name, role, phone, commission_rate, days_present, started_at)
values
  (1, 1, 'عبد المالك', 'مسير / Chef d’atelier', '+213 550 11 22 33', 7.5, 24, '2023-02-15'),
  (2, 1, 'يوسف', 'فني صيانة / Technicien', '+213 551 22 33 44', 6.0, 22, '2024-01-10'),
  (3, 1, 'قاسم', 'محاسب / Comptable', '+213 552 33 44 55', 5.0, 25, '2022-05-20')
on conflict (id) do nothing;

insert into clients (id, garage_id, full_name, phone, plate_number, company_name, notes)
values
  (1, 1, 'Karim Djerbi', '+213 555 12 34 56', '123-AB-456', 'Particulier', 'Client régulier - BMW X5'),
  (2, 1, 'Nadia Benali', '+213 770 90 11 22', '456-EF-789', 'Particulier', 'Mercedes C-Class'),
  (3, 1, 'Samir Hamdi', '+213 699 11 22 33', '321-GH-654', 'Entreprise', 'Toyota Corolla'),
  (4, 1, 'Leila Merabet', '+213 540 00 11 22', '789-CD-123', 'Particulier', 'Audi A3')
on conflict (id) do nothing;

insert into vehicles (id, garage_id, client_id, plate_number, brand, model, engine, mileage, recommended_oil, oil_spec)
values
  (1, 1, 1, '123-AB-456', 'Renault', 'Clio IV', 'K9K 1.5 dCi 90', 42000, '5W-30', 'RN0720'),
  (2, 1, 2, '456-EF-789', 'Mercedes', 'C-Class W204', 'OM651 2.1 CDI 170', 94500, '5W-40', 'MB 229.51'),
  (3, 1, 3, '321-GH-654', 'Toyota', 'Corolla E170', '1ZR-FE 1.6 122', 51800, '5W-30', 'API SN'),
  (4, 1, 4, '789-CD-123', 'Audi', 'A3 8V', 'EA288 2.0 TDI 150', 68000, '5W-30', 'VW 507 00')
on conflict (id) do nothing;

insert into vehicle_models (id, garage_id, model_name, generation, engine_code, fuel_type, year_start, year_end, oil_capacity_liters, recommended_viscosity, recommended_spec, compatible_filter_refs, recommended_interval_km)
values
  (1, 1, 'Duster', 'Duster II', 'K9K 1.5 Blue dCi 115', 'diesel', 2017, 2022, 4.5, '5W-30', 'RN0720', '["MANN-HU719/7x"]'::jsonb, 10000),
  (2, 1, 'Clio', 'Clio IV', 'K9K 1.5 dCi 90', 'diesel', 2013, 2019, 4.5, '5W-30', 'RN0720', '["MANN-HU719/7x", "PUR-LS489A"]'::jsonb, 10000),
  (3, 1, 'Megane', 'Megane IV', 'R9M 1.6 dCi 130', 'diesel', 2016, 2020, 5.0, '5W-30', 'RN0720', '["MANN-HU719/7x"]'::jsonb, 15000),
  (4, 1, 'Hilux', 'Hilux VII', '2KD-FTV 2.5 D-4D 102', 'diesel', 2005, 2015, 7.0, '5W-30', 'ACEA B3', '["MANN-HU719/7x"]'::jsonb, 10000)
on conflict (id) do nothing;

insert into inventory (id, garage_id, barcode, product_name, category, brand, part_number, quantity, min_qty, purchase_price, sale_price, supplier, location)
values
  (1, 1, 'HU-5W30-01', 'Huile moteur 5W-30 Synthétique', 'Huile', 'MANNOL', 'MN-5W30-4L', 24, 12, 3200, 5400, 'AutoParts DZ', 'Étagère A1'),
  (2, 1, 'FIL-HU-719', 'Filtre à huile MANN HU 719/7x', 'Filtre', 'MANN', 'HU 719/7x', 7, 10, 1800, 2600, 'Garage Supply Algérie', 'Étagère B2'),
  (3, 1, 'FIL-AIR-2812', 'Filtre à air MANN CU 2812', 'Filtre', 'MANN', 'CU 2812', 3, 8, 1500, 2100, 'Sarl Lubricants', 'Étagère C3'),
  (4, 1, 'LIQ-BRAKE-01', 'Liquide de frein DOT 4', 'Liquide', 'Castrol', 'DOT4-1L', 15, 10, 1200, 1800, 'AutoParts DZ', 'Aisle D1')
on conflict (id) do nothing;

insert into reviews (id, garage_id, customer_name, rating, comment)
values
  (1, 1, 'Amine K.', 5, 'خدمة سريعة واحترافية جداً، دقة في المواعيد وشفافية في الأسعار.'),
  (2, 1, 'Sarah L.', 5, 'Très bon suivi de mon véhicule, équipe accueillante et travail soigné.'),
  (3, 1, 'Rachid B.', 4, 'Service rapide et bon conseil sur le choix de l’huile moteur.')
on conflict (id) do nothing;
