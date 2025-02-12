"use client";
import { useRecoilValue } from "recoil";
import { freeBoardByIdSelector } from "store/freeBoardState";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFreeBoardById } from "actions/free_boards-actions";
import PostContent from "./PostContent";

export default function PostDetail({ postId }) {
	const cachedPost = useRecoilValue(freeBoardByIdSelector(postId));
	const [post, setPost] = useState(cachedPost);
	const [isLoading, setIsLoading] = useState(!cachedPost); // 최초 상태 설정

	const { data: fetchedPost, isFetching } = useQuery({
		queryKey: ["free_board", postId],
		queryFn: () => getFreeBoardById(postId),
		enabled: !cachedPost, // 캐시된 데이터가 없을 때만 실행
	});

	useEffect(() => {
		if (fetchedPost !== undefined) {
			setPost(fetchedPost);
			setIsLoading(false);
		}
	}, [fetchedPost]);

	// 🔹 1. 데이터 로딩 중
	if (isLoading || isFetching) return <p>로딩 중...</p>;

	// 🔹 2. 게시글이 존재하지 않는 경우
	if (!post) return <p>게시글이 존재하지 않습니다.</p>;

	// 🔹 3. 정상적인 게시글 렌더링
	return <PostContent post={post} detail={true} />;
}
