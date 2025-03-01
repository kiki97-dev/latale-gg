"use server";

import { FreeBoardsRow } from "types/freeBoards";
import { createServerSupabaseClient } from "utils/supabase/server";

function handleError(error) {
	console.error(error);
	throw new Error(error.message);
}

async function getUserLikeStatus(userId: string, postId: number) {
	const supabase = await createServerSupabaseClient();
	const { data: likeData, error: likesError } = await supabase
		.from("likes")
		.select("post_id")
		.eq("post_id", postId)
		.eq("user_id", userId)
		.maybeSingle();

	if (likesError) {
		throw new Error(likesError.message);
	}

	return !!likeData;
}

// 전체 게시글 불러오기
export async function getFreeBoards(): Promise<FreeBoardsRow[]> {
	const supabase = await createServerSupabaseClient();
	const { data: session } = await supabase.auth.getSession();
	const userId = session?.session?.user?.id;

	// 사용자가 로그인하지 않은 경우 단순 쿼리
	if (!userId) {
		const { data, error } = await supabase
			.from("free_boards_with_user_info")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) handleError(error);

		return (data ?? []).map((post) => ({ ...post, is_liked: false }));
	}

	// 로그인한 경우 JOIN을 사용하는 RPC 함수 호출
	const { data, error } = await supabase.rpc("get_posts_with_like_status", { user_id: userId });

	if (error) handleError(error);

	// 🔥 bigint 컬럼을 number로 변환 (예: id 컬럼이 bigint라면)
	return (data ?? []).map((post) => ({
		...post,
		id: Number(post.id), // bigint -> number 변환
	}));
}

export async function getFreeBoardById(id: number): Promise<FreeBoardsRow | null> {
	const supabase = await createServerSupabaseClient();
	const { data: session } = await supabase.auth.getSession();
	const userId = session?.session?.user?.id;

	const { data, error } = await supabase
		.from("free_boards_with_user_info")
		.select("*")
		.eq("id", id)
		.maybeSingle();

	if (error) {
		handleError(error);
	}

	// 로그인한 사용자가 없으면 is_liked = false로 반환
	if (!userId || !data) {
		return data ? { ...data, is_liked: false } : null;
	}

	// 사용자가 로그인한 경우 좋아요 상태를 확인
	const isLiked = await getUserLikeStatus(userId, id);

	// 좋아요 상태를 포함하여 반환
	return {
		...data,
		is_liked: isLiked,
	};
}

export async function createFreeBoard(
	title: string,
	content: string,
	userId: string
): Promise<FreeBoardsRow> {
	const supabase = await createServerSupabaseClient();
	const { data, error } = await supabase
		.from("free_boards")
		.insert({ title, content, author_id: userId })
		.single();

	if (error) {
		handleError(error);
	}

	return data ?? ({} as FreeBoardsRow);
}

export async function deleteFreeBoard(postId: number, userId: string): Promise<boolean> {
	const supabase = await createServerSupabaseClient();

	// 먼저 게시글이 사용자의 것인지 확인
	const { data: post, error: fetchError } = await supabase
		.from("free_boards")
		.select("author_id")
		.eq("id", postId)
		.maybeSingle();

	if (fetchError) {
		handleError(fetchError);
	}

	// 게시글이 없거나 작성자가 아니면 권한 오류
	if (!post) {
		throw new Error("게시글을 찾을 수 없습니다");
	}

	if (post.author_id !== userId) {
		throw new Error("본인이 작성한 글만 삭제할 수 있습니다");
	}

	// 게시글 삭제
	const { error: deleteError } = await supabase.from("free_boards").delete().eq("id", postId);

	if (deleteError) {
		handleError(deleteError);
	}

	return true; // 삭제 성공
}
