"use server";

import { FreeBoardsRow } from "types/freeBoards";
import { createServerSupabaseClient } from "utils/supabase/server";

function handleError(error) {
	console.error(error);
	throw new Error(error.message);
}

/* 로그인한 유저가 로그인 누른 게시물인지 체크 */
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

// 자유게시판 전체 게시글 불러오기
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

/* 자유게시판 특정 글 불러오기 */
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

/* 자유게시판 글 작성 */
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

/* 자유게시판 글 삭제 */
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

/* 자유게시판 글 수정 */
export async function updateFreeBoard(
	postId: number,
	title: string,
	content: string,
	userId: string
): Promise<FreeBoardsRow> {
	const supabase = await createServerSupabaseClient();

	// 먼저 게시글이 사용자의 것인지 확인
	const { data: post, error: fetchError } = await supabase
		.from("free_boards")
		.select("author_id")
		.eq("id", postId)
		.maybeSingle();

	if (fetchError) {
		console.error(fetchError);
		throw new Error(fetchError.message);
	}

	// 게시글이 없거나 작성자가 아니면 권한 오류
	if (!post) {
		throw new Error("게시글을 찾을 수 없습니다");
	}

	if (post.author_id !== userId) {
		throw new Error("본인이 작성한 글만 수정할 수 있습니다");
	}

	// 게시글 수정
	const { data, error: updateError } = await supabase
		.from("free_boards")
		.update({ title, content, updated_at: new Date().toISOString() })
		.eq("id", postId)
		.select("*")
		.single();

	if (updateError) {
		console.error(updateError);
		throw new Error(updateError.message);
	}

	// 수정된 게시글 데이터 가져오기 (좋아요 정보 포함)
	const { data: updatedPost, error: selectError } = await supabase
		.from("free_boards_with_user_info")
		.select("*")
		.eq("id", postId)
		.maybeSingle();

	if (selectError) {
		console.error(selectError);
		throw new Error(selectError.message);
	}

	// 좋아요 상태 확인
	const isLiked = await getUserLikeStatus(userId, postId);

	return {
		...updatedPost,
		is_liked: isLiked,
	} as FreeBoardsRow;
}
