"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createBrowserSupabaseClient } from "utils/supabase/client";
import { useRecoilState, useSetRecoilState } from "recoil";
import { accessTokenState, sessionState, userInfo } from "store/userState";
import { getUser } from "actions/users-actions";

export default function AuthProvider({ children }) {
	const supabase = createBrowserSupabaseClient();
	const router = useRouter();
	const setSession = useSetRecoilState(sessionState); // Recoil 상태 업데이트
	const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
	const setUserInfo = useSetRecoilState(userInfo); // Recoil 상태 업데이트

	useEffect(() => {
		// ✅ 초기 session 값을 가져옴
		const fetchSession = async () => {
			const { data } = await supabase.auth.getSession();
			const userInfo = data.session ? await getUser(data.session) : null;
			setSession(data.session); // Recoil에 저장
			setAccessToken(data.session?.access_token || null); // 초기 accessToken 저장
			setUserInfo(userInfo);
		};
		fetchSession();

		// ✅ 세션 상태 변경 감지하여 Recoil 업데이트
		const {
			data: { subscription: authListener },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (session?.access_token !== accessToken) {
				const userInfo = session ? await getUser(session) : null;
				setSession(session);
				setAccessToken(session?.access_token || null); // 최신 accessToken 저장
				setUserInfo(userInfo); // ✅ 유저 정보 업데이트
				router.refresh(); // 새로고침하여 변경 반영
			}
		});

		return () => {
			authListener.unsubscribe();
		};
	}, [supabase, router, setSession]);

	return children;
}
