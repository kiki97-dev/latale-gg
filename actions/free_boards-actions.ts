"use server";

import { FreeBoardsRow } from "types/freeBoards";
import { createServerSupabaseClient } from "utils/supabase/server";

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
