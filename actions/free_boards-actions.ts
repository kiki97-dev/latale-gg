"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "utils/supabase/server";

export type FreeBoardsRow = Database["public"]["Views"]["free_boards_with_user_info"]["Row"];

function handleError(error) {
	console.error(error);
	throw new Error(error.message);
}

export async function getFreeBoards(): Promise<FreeBoardsRow[]> {
	const supabase = await createServerSupabaseClient();
	const { data, error } = await supabase
		.from("free_boards_with_user_info")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		handleError(error);
	}

	return data ?? [];
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
