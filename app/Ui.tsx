"use client";

import FreeBoards from "components/FreeBoards";
import PostInput from "components/PostInput";

export default function Ui({ session }) {
	return (
		<>
			<section className="flex-1 flex flex-col gap-3 pb-10">
				<PostInput session={session} />
				<FreeBoards />
			</section>
		</>
	);
}
