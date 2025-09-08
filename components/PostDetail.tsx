// PostDetail.tsx 수정
"use client";
import { useRecoilValue } from "recoil";
import { freeBoardByIdSelector } from "store/freeBoardState";
import { useEffect } from "react";
import { useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query"; // useQueryClient 추가
import { getFreeBoardById } from "actions/free_boards-actions";
import PostContentSkeleton from "./PostContentSkeleton";
import { Typography } from "@material-tailwind/react";
import PostContent from "./PostContent";
import CommentInput from "./CommentInput";
import { getCommentsByPostId } from "actions/comments-actions";
import Comment from "./Comment";
import CommentSkeleton from "./CommentSkeleton";
import { Post } from "types/post";

export default function PostDetail({ postId }) {
	const cachedPost = useRecoilValue(freeBoardByIdSelector(postId));
	const queryClient = useQueryClient(); // QueryClient 추가

	const { data: post, isLoading: isLoadingPost } = useQuery({
		queryKey: ["free_boards", postId],
		queryFn: () => getFreeBoardById(postId),
		initialData: cachedPost || undefined,
		refetchOnWindowFocus: false,
	});

	const { data: comments, isLoading: isLoadingComments } = useQuery({
		queryKey: ["comments", postId],
		queryFn: () => getCommentsByPostId(postId),
		staleTime: 1000 * 60 * 1,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});

	// 게시글 데이터가 변경될 때 게시글 목록 캐시도 업데이트
	useEffect(() => {
                if (post) {
                        // 게시글 목록의 해당 게시글도 업데이트
                        queryClient.setQueryData<InfiniteData<Post[]>>(["free_boards"], (oldData) => {
                                if (!oldData) return oldData;
                                return {
                                        ...oldData,
                                        pages: oldData.pages.map((page) =>
                                                page.map((item) =>
                                                        item.id === post.id ? { ...item, ...post } : item
                                                )
                                        ),
                                };
                        });
                }
	}, [post, queryClient, postId]);

	// 로딩 중
	if (isLoadingPost) return <PostContentSkeleton />;

	// 게시글이 존재하지 않는 경우
	if (!post) return <p>게시글이 존재하지 않습니다.</p>;

	// 정상적인 게시글 렌더링
	return (
		<>
			<PostContent post={post as Post} detail={true} />
			<article className="bg-[#17222D] p-4 border border-[#384D63] rounded-lg">
				<Typography variant="h5" color="white">
					댓글 <span className="text-[#15F5BA]">{comments?.length}</span>
				</Typography>
				<div>
					{isLoadingComments ? (
						<CommentSkeleton />
					) : (
						<>
							<CommentInput postId={postId} />
							{comments?.map((data) => (
								<Comment key={data.id} comment={data} />
							))}
						</>
					)}
				</div>
			</article>
		</>
	);
}
