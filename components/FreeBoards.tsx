"use client";

import { useQuery } from "@tanstack/react-query";
import { getFreeBoards } from "actions/free_boards-actions";
import PostContent from "./PostContent";
import { useSetRecoilState } from "recoil";
import { freeBoardsState } from "store/freeBoardState";
import Link from "next/link";
import { useEffect } from "react";
import PostContentSkeleton from "./PostContentSkeleton";
import { Post } from "types/post";

export default function FreeBoards() {
	const setFreeBoards = useSetRecoilState(freeBoardsState);
	const freeBoardsQuery = useQuery({
		queryKey: ["free_boards"],
		queryFn: () => getFreeBoards(),
		staleTime: 1000 * 60 * 1, // 1분 동안 데이터를 신선한 상태로 유지
		refetchOnWindowFocus: false, // 다른 사이트 갔다 와도 다시 요청 X
		refetchOnMount: false, // 뒤로 가기로 돌아왔을 때 다시 요청 X
	});

	useEffect(() => {
		if (freeBoardsQuery.data) {
			setFreeBoards(freeBoardsQuery.data);
		}
	}, [freeBoardsQuery.data, setFreeBoards]);

	return (
		<>
			{freeBoardsQuery.isLoading && (
				<>
					<PostContentSkeleton />
					<PostContentSkeleton />
					<PostContentSkeleton />
				</>
			)}
			{freeBoardsQuery.data?.map((post) => (
				<Link key={post.id} href={`/post/${post.id}`}>
					<PostContent post={post as Post} />
				</Link>
			))}
		</>
	);
}
