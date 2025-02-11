"use client";

import FreeBoards from "components/FreeBoards";
import PostInput from "components/PostInput";
import { Toaster } from "react-hot-toast";

export default function Ui({ session }) {
	return (
		<>
			<div>
				<Toaster />
			</div>
			<div className="flex items-start flex-1 ml-[calc(272px+1.75rem)]">
				<section className="flex-1 flex flex-col gap-3">
					<PostInput session={session} />
					<FreeBoards />
				</section>
				<aside className="w-[300px] h-[300px] bg-blue-gray-200 ml-7"></aside>
			</div>
		</>
	);
}
