"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { normalize, type ProgressState, emptyState } from "@/lib/gamification";

export async function loadProgress(): Promise<ProgressState> {
  if (!isSupabaseConfigured()) return emptyState;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return emptyState;

  const { data, error } = await supabase
    .from("user_progress")
    .select("state")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return emptyState;
  return normalize(data.state);
}

export async function saveProgress(
  state: ProgressState,
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase não configurado" };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Não autenticado" };

  const clean = normalize(state);
  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      state: clean,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
