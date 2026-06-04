-- Rename time to start_time
alter table public.shows rename column "time" to start_time;

-- Add new columns
alter table public.shows
  add column if not exists end_time          time,
  add column if not exists instagram_url     text,
  add column if not exists facebook_url      text,
  add column if not exists flyer_image_url   text;

-- Set up flyers storage bucket (public, 5 MB limit, images only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'flyers',
  'flyers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Allow authenticated users to upload flyers
create policy "Authenticated users can upload flyers"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'flyers');

-- Allow authenticated users to update flyers
create policy "Authenticated users can update flyers"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'flyers');

-- Allow authenticated users to delete flyers
create policy "Authenticated users can delete flyers"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'flyers');
