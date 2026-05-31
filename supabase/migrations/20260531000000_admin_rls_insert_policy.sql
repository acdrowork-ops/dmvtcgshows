-- Allow authenticated users (admins) to insert shows
create policy "Authenticated users can insert shows"
  on public.shows for insert
  to authenticated
  with check (true);

-- Allow authenticated users to update and delete shows
create policy "Authenticated users can update shows"
  on public.shows for update
  to authenticated
  using (true);

create policy "Authenticated users can delete shows"
  on public.shows for delete
  to authenticated
  using (true);
