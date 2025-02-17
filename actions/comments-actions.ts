"use server";

import { Database } from "types_db";
export type CommentRow = {
	author_id: string | null;
	content: string | null;
	created_at: string | null;
	id: number | null;
	likes: number | null;
	post_id: number | null;
	updated_at: string | null;
};
import { createServerSupabaseClient } from "utils/supabase/server";

function handleError(error) {
	console.error(error);
	throw new Error(error.message);
}

// ✅ 모든 댓글 가져오기
export async function getComments(): Promise<CommentRow[]> {
	const supabase = await createServerSupabaseClient();
	const { data, error } = await supabase
		.from("comments")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		handleError(error);
	}

	return data ?? [];
}

// ✅ 특정 게시글의 댓글 가져오기
export async function getCommentsByPostId(postId: number): Promise<CommentRow[]> {
	const supabase = await createServerSupabaseClient();
	const { data, error } = await supabase
		.from("comments_with_user_info")
		.select("*")
		.eq("post_id", postId)
		.order("created_at", { ascending: true });

	if (error) {
		handleError(error);
	}

	return data ?? [];
}

// ✅ 댓글 작성하기
export async function createComment(
	postId: number,
	userId: string,
	content: string
): Promise<CommentRow> {
	const supabase = await createServerSupabaseClient();
	const { data, error } = await supabase
		.from("comments")
		.insert({ post_id: postId, author_id: userId, content })
		.single();

	if (error) {
		handleError(error);
	}

	return data ?? ({} as CommentRow);
}
