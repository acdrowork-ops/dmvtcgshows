"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AuthState = { error: string } | undefined;
export type ShowState = { error: string } | { success: true } | undefined;

export async function signIn(
  _: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (error) return { error: error.message };
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function addShow(
  _: ShowState,
  formData: FormData
): Promise<ShowState> {
  const supabase = await createClient();

  const str = (key: string) => (formData.get(key) as string).trim() || null;

  const { error } = await supabase.from("shows").insert({
    name: formData.get("name") as string,
    date: formData.get("date") as string,
    time: formData.get("time") as string,
    venue: formData.get("venue") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    show_type: (formData.get("show_type") as string) || "TCG",
    entry_fee: str("entry_fee"),
    table_count: str("table_count"),
    organizer: str("organizer"),
    website_url: str("website_url"),
    social_url: str("social_url"),
    is_recurring: formData.get("is_recurring") === "on",
    is_first_event: formData.get("is_first_event") === "on",
  });

  if (error) return { error: error.message };
  return { success: true };
}
