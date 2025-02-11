import { createServerSupabaseClient } from "utils/supabase/server";

export default async function Home({ params }) {
	const { id } = await params;
	const supabase = await createServerSupabaseClient();

	return (
		<>
			<div>post id : {id}</div>
		</>
	);
}
