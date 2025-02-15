"use server";
import { Database } from "types_db";
import { createServerSupabaseClient } from "utils/supabase/server";

export type UserRow = Database["public"]["Tables"]["users"]["Row"];

function handleError(error) {
	console.error(error);
	throw new Error(error.message);
}

export async function getUser(session): Promise<UserRow | null> {
	const supabase = await createServerSupabaseClient();
	const { data, error } = await supabase
		.from("users")
		.select("id, nickname, profile_image, comment_count, created_at, post_count, updated_at")
		.eq("id", session.user.id)
		.single();

	if (error) {
		handleError(error);
	}
	return data ?? null; // ✅ User | null로 타입 확장
}
