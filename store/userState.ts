import { atom } from "recoil";
import { Session } from "@supabase/auth-helpers-nextjs"; // 세션 타입 가져오기
import { Database } from "types_db";

export type UserRow = Database["public"]["Tables"]["users"]["Row"];

export const sessionState = atom<Session | null>({
	key: "sessionState",
	default: null, // 기본값 설정
});

export const accessTokenState = atom<string | null>({
	key: "accessTokenState",
	default: null,
});

export const userInfo = atom<UserRow | null>({
	key: "userInfo",
	default: null,
});
