-- SIARA workshop schema for Supabase
-- Version 1.0

create extension if not exists pgcrypto;

create table if not exists garages (
  id bigserial primary key,
  name text not null,
  address text,
  phone text,
  email text,
  currency text not null default 'DZD',
  created_at timestamptz not null default now()
);

create table if not exists users (
  id bigserial primary key,
  garage_id bigint not null references garages(id) on delete cascade,
  full_name text not null,
  role text not null default 'employee',
  phone text,
  email text,
  commission_fixed_amount numeric not null default 0,
  commission_percentage numeric not null default 0,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists clients (
  id bigserial primary key,
  garage_id bigint not null references garages(id) on delete cascade,
  full_name text,
  phone text,
  plate_number text,
  company_name text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists vehicles (
  id bigserial primary key,
  garage_id bigint not null references garages(id) on delete cascade,
  client_id bigint references clients(id) on delete set null,
  plate_number text not null,
  brand text,
  model text,
  engine text,
  generation text,
  mileage integer not null default 0,
  last_service_at date,
  recommended_oil text,
  oil_quantity_liters numeric,
  fuel_type text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists vehicle_models (
  id bigserial primary key,
  garage_id bigint references garages(id) on delete cascade,
  model_name text not null,
  generation text,
  engine text,
  fuel_type text,
  recommended_oil text,
  oil_quantity_liters numeric,
  compatible_filters jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists inventory (
  id bigserial primary key,
  garage_id bigint not null references garages(id) on delete cascade,
  product_name text not null,
  barcode text,
  category text,
  brand text,
  supplier text,
  unit text not null default 'piece',
  stock_quantity numeric not null default 0,
  min_stock numeric not null default 0,
  purchase_price numeric not null default 0,
  sale_price numeric not null default 0,
  engine_compatibility jsonb not null default '[]'::jsonb,
  location text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists services (
  id bigserial primary key,
  garage_id bigint not null references garages(id) on delete cascade,
  client_id bigint references clients(id) on delete set null,
  vehicle_id bigint references vehicles(id) on delete set null,
  employee_id bigint references users(id) on delete set null,
  service_date timestamptz not null default now(),
  status text not null default 'draft',
  labor_cost numeric not null default 0,
  total_amount numeric not null default 0,
  payment_method text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists service_items (
  id bigserial primary key,
  service_id bigint not null references services(id) on delete cascade,
  inventory_id bigint references inventory(id) on delete set null,
  item_type text not null,
  item_name text not null,
  quantity numeric not null default 1,
  unit_price numeric not null default 0,
  subtotal numeric not null default 0,
  recommended_ref text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists transactions (
  id bigserial primary key,
  garage_id bigint not null references garages(id) on delete cascade,
  service_id bigint references services(id) on delete set null,
  type text not null,
  category text not null,
  amount numeric not null default 0,
  payment_method text,
  related_party text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id bigserial primary key,
  garage_id bigint not null references garages(id) on delete cascade,
  client_id bigint references clients(id) on delete set null,
  vehicle_id bigint references vehicles(id) on delete set null,
  appointment_date timestamptz not null,
  status text not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists bays (
  id bigserial primary key,
  garage_id bigint not null references garages(id) on delete cascade,
  bay_name text not null,
  status text not null default 'free',
  created_at timestamptz not null default now()
);

create table if not exists daily_stats (
  id bigserial primary key,
  garage_id bigint not null references garages(id) on delete cascade,
  stat_date date not null,
  revenue numeric not null default 0,
  expenses numeric not null default 0,
  profit numeric not null default 0,
  cash_register numeric not null default 0,
  services_count integer not null default 0,
  created_at timestamptz not null default now(),
  unique (garage_id, stat_date)
);

create table if not exists notifications (
  id bigserial primary key,
  garage_id bigint not null references garages(id) on delete cascade,
  title text not null,
  message text not null,
  severity text not null default 'info',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_clients_garage_phone on clients(garage_id, phone);
create index if not exists idx_clients_garage_plate on clients(garage_id, plate_number);
create index if not exists idx_vehicles_garage_plate on vehicles(garage_id, plate_number);
create index if not exists idx_inventory_garage_barcode on inventory(garage_id, barcode);
create index if not exists idx_services_garage_date on services(garage_id, service_date);
create index if not exists idx_transactions_garage_date on transactions(garage_id, created_at);

alter table garages enable row level security;
alter table users enable row level security;
alter table clients enable row level security;
alter table vehicles enable row level security;
alter table vehicle_models enable row level security;
alter table inventory enable row level security;
alter table services enable row level security;
alter table service_items enable row level security;
alter table transactions enable row level security;
alter table appointments enable row level security;
alter table bays enable row level security;
alter table daily_stats enable row level security;
alter table notifications enable row level security;

create policy if not exists "Allow authenticated access to garage data" on garages
  for all
  using (true)
  with check (true);

create policy if not exists "Allow authenticated access to users" on users
  for all
  using (true)
  with check (true);

create policy if not exists "Allow authenticated access to clients" on clients
  for all
  using (true)
  with check (true);

create policy if not exists "Allow authenticated access to vehicles" on vehicles
  for all
  using (true)
  with check (true);

create policy if not exists "Allow authenticated access to vehicle models" on vehicle_models
  for all
  using (true)
  with check (true);

create policy if not exists "Allow authenticated access to inventory" on inventory
  for all
  using (true)
  with check (true);

create policy if not exists "Allow authenticated access to services" on services
  for all
  using (true)
  with check (true);

create policy if not exists "Allow authenticated access to service items" on service_items
  for all
  using (true)
  with check (true);

create policy if not exists "Allow authenticated access to transactions" on transactions
  for all
  using (true)
  with check (true);

create policy if not exists "Allow authenticated access to appointments" on appointments
  for all
  using (true)
  with check (true);

create policy if not exists "Allow authenticated access to bays" on bays
  for all
  using (true)
  with check (true);

create policy if not exists "Allow authenticated access to daily stats" on daily_stats
  for all
  using (true)
  with check (true);

create policy if not exists "Allow authenticated access to notifications" on notifications
  for all
  using (true)
  with check (true);
