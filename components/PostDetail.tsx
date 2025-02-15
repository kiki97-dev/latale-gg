"use client";
import { useRecoilValue } from "recoil";
import { freeBoardByIdSelector } from "store/freeBoardState";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFreeBoardById } from "actions/free_boards-actions";
import PostContentSkeleton from "./PostContentSkeleton";
import { Typography } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
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
	if (isLoading || isFetching) return <PostContentSkeleton />;

	// 🔹 2. 게시글이 존재하지 않는 경우
	if (!post) return <p>게시글이 존재하지 않습니다.</p>;

	// 🔹 3. 정상적인 게시글 렌더링
	const [content, setContent] = useState(""); // 댓글 입력창 관련 상태
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (e.target.value.length > 1000) return; // 1000자 초과 방지
		setContent(e.target.value);
	};
	return (
		<>
			<PostContent post={post} detail={true} />
			<article className="bg-[#17222D] p-4 border border-[#384D63] rounded-lg">
				<Typography variant="h5" color="white">
					댓글 <span className="text-[#15F5BA]">0</span>
				</Typography>
				<div>
					{/* 댓글 입력창 */}
					<div className="flex  gap-3 mt-3">
						<div className="w-[50px] h-[50px] bg-[#384D63] rounded-full overflow-hidden">
							<img
								src={post.author_profile_image ?? ""}
								alt="user"
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="flex flex-1 gap-3 flex-col bg-[#1C2936] rounded-lg p-4">
							<textarea
								placeholder="댓글을 입력하세요"
								className="bg-inherit text-[#fff] resize-none outline-none h-auto rounded-lg min-h-[35px] overflow-hidden"
								rows={1} // 최소 높이 설정
								onInput={(e) => {
									e.currentTarget.style.height = "auto"; // 높이 초기화
									e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`; // 컨텐츠에 맞게 조절
								}}
								value={content}
								onChange={handleChange}
							/>
							<div className="flex w-full items-center justify-between gap-3">
								<Typography
									variant="small"
									color="white"
									style={{ lineHeight: "1" }}
									className="opacity-60"
								>
									<span className="text-[#15F5BA]">{content.length}</span> / 1000
								</Typography>
								<Button
									disabled={content.length === 0}
									variant="filled"
									color="white"
									size="sm"
									className="text-sm font-extrabold bg-[#15F5BA] text-[#261E5A] whitespace-nowrap"
								>
									등록
								</Button>
							</div>
						</div>
					</div>
				</div>
			</article>
		</>
	);
}
