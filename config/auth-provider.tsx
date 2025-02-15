"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createBrowserSupabaseClient } from "utils/supabase/client";
import { useRecoilState, useSetRecoilState } from "recoil";
import { accessTokenState, sessionState } from "store/authState";

export default function AuthProvider({ children }) {
	const supabase = createBrowserSupabaseClient();
	const router = useRouter();
	const setSession = useSetRecoilState(sessionState); // Recoil 상태 업데이트
	const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

	useEffect(() => {
		// ✅ 초기 session 값을 가져옴
		const fetchSession = async () => {
			const { data } = await supabase.auth.getSession();
			setSession(data.session); // Recoil에 저장
			setAccessToken(data.session?.access_token || null); // 초기 accessToken 저장
		};
		fetchSession();

		// ✅ 세션 상태 변경 감지하여 Recoil 업데이트
		const {
			data: { subscription: authListener },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (session?.access_token !== accessToken) {
				setSession(session);
				setAccessToken(session?.access_token || null); // 최신 accessToken 저장
				router.refresh(); // 새로고침하여 변경 반영
			}
		});

		return () => {
			authListener.unsubscribe();
		};
	}, [supabase, router, setSession]);

	return children;
}
