"use client";
import { Button } from "@material-tailwind/react";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export default function SignIn({}) {
	const supabase = createBrowserSupabaseClient();

	const signInWithKakao = async function signInWithKakao() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "kakao",
			options: {
				redirectTo: process.env.NEXT_PUBLIC_VERCEL_URL
					? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback`
					: "http://localhost:3000/auth/callback",
			},
		});
	};

	return (
		<Button
			onClick={() => signInWithKakao()}
			className="font-black text-sm bg-[#15F5BA] text-[#261E5A]"
		>
			로그인
		</Button>
	);
}
