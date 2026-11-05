import { createClient } from "@/lib/supabase/server";

const TABLE = "calculator_feedback";

export type ReviewComment = {
  id: string;
  createdAt: string;
  comment: string;
};

export type ReviewsSummary = {
  totalLikes: number;
  likesWithoutFeedback: number;
  comments: ReviewComment[];
};

export async function getReviewsSummary(): Promise<ReviewsSummary> {
  const supabase = await createClient();
  if (!supabase) {
    return { totalLikes: 0, likesWithoutFeedback: 0, comments: [] };
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select("id, created_at, comment")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to load calculator reviews", error);
    return { totalLikes: 0, likesWithoutFeedback: 0, comments: [] };
  }

  const comments: ReviewComment[] = [];
  let likesWithoutFeedback = 0;

  for (const row of data) {
    const text = typeof row.comment === "string" ? row.comment.trim() : "";
    if (!text) {
      likesWithoutFeedback += 1;
      continue;
    }
    comments.push({
      id: row.id,
      createdAt: row.created_at,
      comment: text,
    });
  }

  return {
    totalLikes: data.length,
    likesWithoutFeedback,
    comments,
  };
}
