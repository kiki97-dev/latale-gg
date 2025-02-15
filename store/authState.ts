import { atom } from "recoil";
import { Session } from "@supabase/auth-helpers-nextjs"; // 세션 타입 가져오기
export const sessionState = atom<Session | null>({
	key: "sessionState",
	default: null, // 기본값 설정
});
