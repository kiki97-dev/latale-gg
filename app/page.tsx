import { createServerSupabaseClient } from "utils/supabase/server";
import SignIn from "./signin";
import SignOut from "./signout";

export default async function Home() {
	const supabase = await createServerSupabaseClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();
	return (
		<div className="flex flex-col items-center justify-center h-screen ">
			{session?.user ? (
				<>
					<p>{session?.user?.email?.split("@")?.[0]}님 로그인 되었습니다.</p>
					<SignOut />
				</>
			) : (
				<SignIn />
			)}
		</div>
	);
}
