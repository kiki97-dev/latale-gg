"use client";

import { Button } from "@material-tailwind/react";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export default function SignOut() {
	const supabase = createBrowserSupabaseClient();
	return (
		<>
			<Button
				variant="filled"
				color="white"
				size="sm"
				className="text-sm font-extrabold bg-[#15F5BA] text-[#261E5A] whitespace-nowrap"
				onClick={() => supabase.auth.signOut()}
			>
				로그아웃
			</Button>
		</>
	);
}
