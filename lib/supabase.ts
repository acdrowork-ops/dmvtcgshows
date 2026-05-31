import { createClient } from "@supabase/supabase-js";

export type Show = {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  state: string;
  entry_fee: string | null;
  table_count: string | null;
  organizer: string | null;
  show_type: string;
  is_recurring: boolean;
  is_first_event: boolean;
  website_url: string | null;
  social_url: string | null;
  created_at: string;
};

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }
  return createClient(url, key);
}

export async function getShows(): Promise<Show[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("shows")
    .select("*")
    .order("date", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}
