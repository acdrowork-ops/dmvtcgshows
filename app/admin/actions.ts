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

  const str = (key: string) => {
    const val = formData.get(key);
    if (!val || typeof val !== "string") return null;
    return val.trim() || null;
  };

  // Handle flyer upload
  let flyer_image_url: string | null = null;
  const flyerFile = formData.get("flyer") as File | null;
  if (flyerFile && flyerFile.size > 0) {
    const ext = flyerFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await flyerFile.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from("flyers")
      .upload(filename, buffer, { contentType: flyerFile.type });
    if (uploadError) return { error: `Flyer upload failed: ${uploadError.message}` };
    const { data: urlData } = supabase.storage
      .from("flyers")
      .getPublicUrl(filename);
    flyer_image_url = urlData.publicUrl;
  }

  const { error } = await supabase.from("shows").insert({
    name: formData.get("name") as string,
    date: formData.get("date") as string,
    start_time: formData.get("start_time") as string,
    end_time: str("end_time"),
    venue: formData.get("venue") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    show_type: (formData.get("show_type") as string) || "TCG",
    entry_fee: str("entry_fee"),
    table_count: str("table_count"),
    organizer: str("organizer"),
    website_url: str("website_url"),
    instagram_url: str("instagram_url"),
    facebook_url: str("facebook_url"),
    flyer_image_url,
    notes: str("notes"),
    is_recurring: formData.get("is_recurring") === "on",
    is_first_event: formData.get("is_first_event") === "on",
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateShow(
  _: ShowState,
  formData: FormData
): Promise<ShowState> {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const str = (key: string) => {
    const val = formData.get(key);
    if (!val || typeof val !== "string") return null;
    return val.trim() || null;
  };

  // Upload new flyer only if one was selected; otherwise leave existing value untouched
  let newFlyerUrl: string | undefined;
  const flyerFile = formData.get("flyer") as File | null;
  if (flyerFile && flyerFile.size > 0) {
    const ext = flyerFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await flyerFile.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from("flyers")
      .upload(filename, buffer, { contentType: flyerFile.type });
    if (uploadError) return { error: `Flyer upload failed: ${uploadError.message}` };
    const { data: urlData } = supabase.storage
      .from("flyers")
      .getPublicUrl(filename);
    newFlyerUrl = urlData.publicUrl;
  }

  const update: Record<string, unknown> = {
    name: formData.get("name") as string,
    date: formData.get("date") as string,
    start_time: formData.get("start_time") as string,
    end_time: str("end_time"),
    venue: formData.get("venue") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    show_type: (formData.get("show_type") as string) || "TCG",
    entry_fee: str("entry_fee"),
    table_count: str("table_count"),
    organizer: str("organizer"),
    website_url: str("website_url"),
    instagram_url: str("instagram_url"),
    facebook_url: str("facebook_url"),
    notes: str("notes"),
    is_recurring: formData.get("is_recurring") === "on",
    is_first_event: formData.get("is_first_event") === "on",
  };

  if (newFlyerUrl !== undefined) update.flyer_image_url = newFlyerUrl;

  const { error } = await supabase.from("shows").update(update).eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteShow(id: string): Promise<ShowState> {
  const supabase = await createClient();
  const { error } = await supabase.from("shows").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
