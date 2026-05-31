-- Create shows table for DMV TCG Shows directory
create table public.shows (
  id            uuid        primary key default gen_random_uuid(),
  name          text        not null,
  date          date        not null,
  time          time        not null,
  venue         text        not null,
  city          text        not null,
  state         text        not null,
  entry_fee     text,
  table_count   text,
  organizer     text,
  show_type     text        not null default 'TCG',
  is_recurring  boolean     not null default false,
  is_first_event boolean    not null default false,
  website_url   text,
  social_url    text,
  created_at    timestamptz not null default now()
);

-- Index for the most common query pattern: upcoming shows sorted by date
create index shows_date_idx on public.shows (date asc);

-- RLS: table is publicly readable, writes require auth
alter table public.shows enable row level security;

create policy "Anyone can read shows"
  on public.shows for select
  using (true);

-- Sample DMV-area TCG shows for testing
insert into public.shows
  (name, date, time, venue, city, state, entry_fee, table_count, organizer, show_type, is_recurring, is_first_event, website_url, social_url)
values
  (
    'DMV Pokémon Card Swap & Sell',
    '2026-06-14',
    '10:00',
    'Rockville Civic Center',
    'Rockville',
    'MD',
    '$5',
    '40+',
    'DMV Pokémon Community',
    'Pokemon',
    true,
    false,
    null,
    'https://www.facebook.com/groups/dmvpokemon'
  ),
  (
    'Northern Virginia TCG Show',
    '2026-06-22',
    '09:00',
    'Fairfax Corner Event Center',
    'Fairfax',
    'VA',
    'Free',
    '30+',
    'NoVA Card Collectors',
    'TCG',
    false,
    false,
    null,
    'https://www.facebook.com/groups/novacardcollectors'
  ),
  (
    'Baltimore Card & Collectibles Show',
    '2026-07-12',
    '09:00',
    'Maryland State Fairgrounds',
    'Timonium',
    'MD',
    '$8',
    '100+',
    'Baltimore Hobby Events',
    'TCG',
    true,
    false,
    null,
    null
  ),
  (
    'DC Area Lorcana & One Piece Meetup',
    '2026-06-29',
    '12:00',
    'Silver Spring Civic Building',
    'Silver Spring',
    'MD',
    'Free',
    '20',
    'DMV New TCG Players',
    'Lorcana / One Piece',
    false,
    true,
    null,
    'https://www.facebook.com/groups/dmvlorcana'
  ),
  (
    'Mid-Atlantic TCG Collectors Show',
    '2026-07-19',
    '10:00',
    'DoubleTree by Hilton – Crystal City',
    'Arlington',
    'VA',
    '$10',
    '80+',
    'Mid-Atlantic Collectibles',
    'TCG',
    true,
    false,
    null,
    null
  ),
  (
    'Magic: The Gathering Alexandria Vendor Day',
    '2026-07-05',
    '11:00',
    'The Athenaeum',
    'Alexandria',
    'VA',
    'Free',
    '15',
    'NoVA MTG Players',
    'Magic: The Gathering',
    false,
    false,
    null,
    'https://www.facebook.com/groups/novamtg'
  );
