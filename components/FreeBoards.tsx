"use client";

import { useQuery } from "@tanstack/react-query";
import { getFreeBoards } from "actions/free_boards-actions";
import PostContent from "./PostContent";

export default function FreeBoards() {
	const freeBoardsQuery = useQuery({
		queryKey: ["free_boards"],
		queryFn: () => getFreeBoards(),
	});

	return (
		<>
			{freeBoardsQuery.isLoading && <div>Loading...</div>}
			{freeBoardsQuery.data &&
				freeBoardsQuery.data.map((post) => <PostContent key={post.id} post={post} />)}
		</>
	);
}
