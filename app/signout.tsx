"use client";
import { Button } from "@material-tailwind/react";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export default function SignOut({}) {
	const supabase = createBrowserSupabaseClient();

	return (
		<Button
			onClick={() => supabase.auth.signOut()}
			className="font-black text-sm bg-[#15F5BA] text-[#261E5A]"
		>
			로그아웃
		</Button>
	);
}
