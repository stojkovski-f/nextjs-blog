"use server";

import { createClient } from "@/lib/supabase/server";

const TABLE = "calculator_feedback";
const MAX_COMMENT_LENGTH = 600;

export async function getCalculatorLikeCount(): Promise<number> {
  const supabase = await createClient();
  if (!supabase) {
    return 0;
  }

  const { count, error } = await supabase
    .from(TABLE)
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Failed to load calculator likes", error);
    return 0;
  }

  return count ?? 0;
}

export async function addCalculatorLike(): Promise<
  { id: string } | { error: string }
> {
  const supabase = await createClient();
  if (!supabase) {
    return { error: "Could not save your like. Please try again." };
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ comment: null })
    .select("id")
    .single();

  if (error || !data?.id) {
    console.error("Failed to save calculator like", error);
    return { error: "Could not save your like. Please try again." };
  }

  return { id: data.id };
}

export async function addCalculatorComment(
  id: string,
  comment: string,
): Promise<{ ok: true } | { error: string }> {
  const trimmed = comment.trim();
  if (!id) {
    return { error: "Missing like id." };
  }
  if (!trimmed) {
    return { error: "Please add a short comment before submitting." };
  }
  if (trimmed.length > MAX_COMMENT_LENGTH) {
    return { error: `Comment must be ${MAX_COMMENT_LENGTH} characters or fewer.` };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: "Could not save your comment. Please try again." };
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update({ comment: trimmed })
    .eq("id", id)
    .is("comment", null)
    .select("id")
    .maybeSingle();

  if (error || !data?.id) {
    console.error("Failed to save calculator comment", error);
    return { error: "Could not save your comment. Please try again." };
  }

  return { ok: true };
}
