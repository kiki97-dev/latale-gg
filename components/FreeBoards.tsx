"use client";

import { useQuery } from "@tanstack/react-query";
import { getFreeBoards } from "actions/free_boards-actions";
import PostContent from "./PostContent";
import { useSetRecoilState } from "recoil";
import { freeBoardsState } from "store/freeBoardState";
import Link from "next/link";

export default function FreeBoards() {
	const setFreeBoards = useSetRecoilState(freeBoardsState);
	const freeBoardsQuery = useQuery({
		queryKey: ["free_boards"],
		queryFn: () => getFreeBoards(),
	});

	return (
		<>
			{freeBoardsQuery.isLoading && <div>Loading...</div>}
			{freeBoardsQuery.data &&
				freeBoardsQuery.data.map((post) => (
					<Link href={`/post/${post.id}`}>
						<PostContent key={post.id} post={post} />
					</Link>
				))}
		</>
	);
}
