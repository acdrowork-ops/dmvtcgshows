"use server";

import { createClient } from "@supabase/supabase-js";

export type SuggestionState = { error: string } | { success: true } | undefined;

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

export async function submitSuggestion(
  _: SuggestionState,
  formData: FormData
): Promise<SuggestionState> {
  const str = (key: string) => {
    const val = formData.get(key);
    if (!val || typeof val !== "string") return null;
    return val.trim() || null;
  };

  const show_name = str("show_name");
  if (!show_name) return { error: "Show name is required." };

  const supabase = getClient();
  const { error } = await supabase.from("suggestions").insert({
    submitter_name: str("submitter_name"),
    show_name,
    show_date: str("show_date"),
    website_or_social: str("website_or_social"),
    notes: str("notes"),
  });

  if (error) return { error: error.message };
  return { success: true };
}
