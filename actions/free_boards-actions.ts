"use server";

import { FreeBoardsRow } from "types/freeBoards";
import { createServerSupabaseClient } from "utils/supabase/server";

function handleError(error) {
	console.error(error);
	throw new Error(error.message);
}

// 전체 게시글 불러오기
export async function getFreeBoards(): Promise<FreeBoardsRow[]> {
	const supabase = await createServerSupabaseClient();

	const { data: session } = await supabase.auth.getSession();
	const userId = session?.session?.user?.id;

	const { data, error } = await supabase
		.from("free_boards_with_user_info")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		handleError(error);
	}

	// 로그인한 사용자가 없으면 모든 게시글을 is_liked = false로 반환
	if (!userId) {
		return (data ?? []).map((post) => ({
			...post,
			is_liked: false,
		}));
	}

	// 사용자가 로그인한 경우, 사용자의 좋아요 정보를 별도로 가져옵니다
	const { data: likedPosts, error: likesError } = await supabase
		.from("likes")
		.select("post_id")
		.eq("user_id", userId);

	if (likesError) {
		throw new Error(likesError.message);
	}

	// 좋아요한 게시글의 ID 집합을 만듭니다
	const likedPostIds = new Set(likedPosts.map((like) => like.post_id));

	// 각 게시글에 is_liked 필드를 추가합니다
	return (data ?? []).map((post) => ({
		...post,
		is_liked: likedPostIds.has(post.id),
	}));
}

export async function getFreeBoardById(id: number): Promise<FreeBoardsRow | null> {
	const supabase = await createServerSupabaseClient();
	const { data, error } = await supabase
		.from("free_boards_with_user_info")
		.select("*")
		.eq("id", id)
		.maybeSingle();

	if (error) {
		handleError(error);
	}

	return data ?? null;
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
