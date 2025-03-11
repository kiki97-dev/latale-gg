// store/postState.js
import { atom } from "recoil";
import { Post } from "types/post";

export const currentPostState = atom<Post | null>({
	key: "currentPostState",
	default: null,
});

export const modalOpenState = atom({
	key: "modalOpenState",
	default: false,
});
