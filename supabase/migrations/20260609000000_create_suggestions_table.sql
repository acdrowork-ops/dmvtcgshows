create table public.suggestions (
  id uuid primary key default gen_random_uuid(),
  submitter_name text,
  show_name text not null,
  show_date text,
  website_or_social text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.suggestions enable row level security;

create policy "Public can insert suggestions"
  on public.suggestions for insert
  with check (true);

create policy "Authenticated users can view suggestions"
  on public.suggestions for select
  using (auth.role() = 'authenticated');
