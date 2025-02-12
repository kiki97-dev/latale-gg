import { atom, selectorFamily } from "recoil";
import { FreeBoardsRow } from "types/freeBoards";

// 자유게시판 전체 글 리스트 상태
export const freeBoardsState = atom<FreeBoardsRow[]>({
	key: "freeBoardsState",
	default: [],
});

// 특정 ID의 글을 가져오는 selector (selectorFamily 사용)
export const freeBoardByIdSelector = selectorFamily<FreeBoardsRow | null, number>({
	key: "freeBoardByIdSelector",
	get:
		(id) =>
		({ get }) => {
			const posts = get(freeBoardsState);
			return posts.find((post) => post.id === id) ?? null; // 🔹 undefined 방지
		},
});
