"use client";
import { useRecoilValue } from "recoil";
import { freeBoardByIdSelector } from "store/freeBoardState";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFreeBoardById } from "actions/free_boards-actions";
import PostContentSkeleton from "./PostContentSkeleton";
import { Typography } from "@material-tailwind/react";
import PostContent from "./PostContent";
import CommentInput from "./CommentInput";
import { getCommentsByPostId } from "actions/comments-actions";
import Comment from "./Comment";
import CommentSkeleton from "./CommentSkeleton";

export default function PostDetail({ postId }) {
	const cachedPost = useRecoilValue(freeBoardByIdSelector(postId));
	const [post, setPost] = useState(cachedPost);
	const [isLoading, setIsLoading] = useState(!cachedPost); // 최초 상태 설정

	const { data: fetchedPost, isFetching: isFetchingPost } = useQuery({
		queryKey: ["free_board", postId],
		queryFn: () => getFreeBoardById(postId),
		initialData: cachedPost || undefined, // ✅ 전역 상태 데이터를 React Query 캐시로 설정
	});

	const { data: fetchedComment, isFetching: isFetchingComment } = useQuery({
		queryKey: ["comments", postId],
		queryFn: () => getCommentsByPostId(postId),
		staleTime: 1000 * 60 * 1, // 1분 동안 데이터를 신선한 상태로 유지
		refetchOnWindowFocus: false, // 다른 사이트 갔다 와도 다시 요청 X
		refetchOnMount: false, // 뒤로 가기로 돌아왔을 때 다시 요청 X
	});

	useEffect(() => {
		if (fetchedPost !== undefined) {
			setPost(fetchedPost);
			setIsLoading(false);
		}
	}, [fetchedPost]);

	// 🔹 1. 데이터 로딩 중
	if (isLoading || isFetchingPost || isFetchingComment) return <PostContentSkeleton />;

	// 🔹 2. 게시글이 존재하지 않는 경우
	if (!post) return <p>게시글이 존재하지 않습니다.</p>;

	// 🔹 3. 정상적인 게시글 렌더링
	return (
		<>
			<PostContent post={post} detail={true} />
			<article className="bg-[#17222D] p-4 border border-[#384D63] rounded-lg">
				<Typography variant="h5" color="white">
					댓글 <span className="text-[#15F5BA]">0</span>
				</Typography>
				<div>
					{/* 댓글 입력창 */}
					<CommentInput postId={postId} />
					{fetchedComment?.map((data) => (
						<Comment comment={data} />
					))}
				</div>
			</article>
		</>
	);
}
