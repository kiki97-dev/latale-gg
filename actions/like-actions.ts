"use server";

import { createServerSupabaseClient } from "utils/supabase/server";

function handleError(error: any) {
	console.error(error);
	throw new Error(error.message);
}

// ✅ 좋아요 추가 또는 취소 (한 번의 DB 요청만 실행)
export async function toggleLike(postId: number, userId: string): Promise<boolean> {
	const supabase = await createServerSupabaseClient();

	// 좋아요가 존재하는지 확인 (단일 쿼리)
	const { data: existingLike, error: checkError } = await supabase
		.from("likes")
		.select("*")
		.eq("post_id", postId)
		.eq("user_id", userId.toString())
		.maybeSingle();

	if (checkError) {
		handleError(checkError);
	}

	if (existingLike) {
		// ✅ 이미 좋아요가 눌린 상태 → 삭제 (좋아요 취소)
		const { error: deleteError } = await supabase
			.from("likes")
			.delete()
			.eq("post_id", postId)
			.eq("user_id", userId);

		if (deleteError) {
			handleError(deleteError);
		}

		return false; // 좋아요 취소됨
	} else {
		// ✅ 좋아요 추가
		const { error: insertError } = await supabase
			.from("likes")
			.insert({ post_id: postId, user_id: userId });

		if (insertError) {
			handleError(insertError);
		}

		return true; // 좋아요 추가됨
	}
}
