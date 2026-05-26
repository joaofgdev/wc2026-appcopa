create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  user_name text not null,
  avatar_id text not null default 'eagle',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.users enable row level security;
-- No policies needed since we use Service Role Key in Next.js Server
