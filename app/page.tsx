import { createServerSupabaseClient } from "utils/supabase/server";
import Ui from "./Ui";

export default async function Home() {
	const supabase = await createServerSupabaseClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();
	return <Ui session={session} />;
}
