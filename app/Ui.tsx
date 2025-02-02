"use client";

import { useQuery } from "@tanstack/react-query";
import { getFreeBoards } from "actions/free_boards-actions";
import FreeBoards from "components/FreeBoards";

export default function Ui() {
	const freeBoardsQuery = useQuery({
		queryKey: ["free_boards"],
		queryFn: () => getFreeBoards(),
	});

	return (
		<div className="flex items-start flex-1 ml-[calc(272px+1.75rem)]">
			<section className="flex-1 flex flex-col gap-5">
				{freeBoardsQuery.isLoading && <div>Loading...</div>}
				{freeBoardsQuery.data &&
					freeBoardsQuery.data.map((post) => <FreeBoards key={post.id} post={post} />)}
			</section>
			<aside className="w-[300px] h-[300px] bg-blue-gray-200 ml-7"></aside>
		</div>
	);
}
