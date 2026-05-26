create table if not exists public.bracket_predictions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique,
  user_name text not null,
  picks jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.bracket_predictions enable row level security;
-- No policies needed since we will use the Service Role Key on the server side to access this table.
