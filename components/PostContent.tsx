"use client";
import { Typography } from "@material-tailwind/react";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp"; // 채워진 좋아요 아이콘 추가
import { Button } from "@material-tailwind/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import sanitizeHtml from "sanitize-html";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "actions/like-actions";
import { useRecoilValue } from "recoil";
import { userInfo } from "store/userState";
import { useState, useEffect } from "react";
import { Post } from "types/post";

interface PostContentProps {
	post: Post;
	detail?: boolean;
}

export default function PostContent({ post, detail = false }: PostContentProps) {
	dayjs.extend(utc);
	dayjs.extend(timezone);
	const formattedDate = dayjs
		.utc(post.created_at)
		.tz("Asia/Seoul")
		.format("YYYY년 MM월 DD일 HH:mm");

	const sanitizedContent = sanitizeHtml(post.content, {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
		allowedAttributes: {
			img: ["src", "alt", "width", "height"],
		},
	});

	const user = useRecoilValue(userInfo);
	const queryClient = useQueryClient();

	// 초기 좋아요 상태를 서버에서 받은 is_liked로 설정
	const [isLiked, setIsLiked] = useState(post.is_liked || false);

	// post.is_liked가 변경되면 상태 업데이트 (이 부분이 중요)
	useEffect(() => {
		setIsLiked(post.is_liked || false);
	}, [post.is_liked]);

	// 좋아요 추가/삭제 (낙관적 업데이트 적용)
	const mutation = useMutation({
		mutationFn: async () => {
			if (!user?.id) {
				throw new Error("로그인이 필요합니다");
			}
			return toggleLike(post.id, user.id);
		},
		// 낙관적 업데이트 적용 - 즉시 UI 반영
		onMutate: async () => {
			// 이전 데이터 백업
			const previousData = queryClient.getQueryData<Post>(["free_board", post.id]);
			const previousBoardsData = queryClient.getQueryData(["free_boards"]);

			// 새로운 좋아요 상태 계산
			const newIsLiked = !isLiked;
			const newLikeCount = newIsLiked
				? (post.like_count || 0) + 1
				: (post.like_count || 0) - 1;

			// UI 상태 업데이트
			setIsLiked(newIsLiked);

			// 1. 단일 게시글 캐시 업데이트
			if (previousData) {
				queryClient.setQueryData(["free_board", post.id], {
					...previousData,
					is_liked: newIsLiked,
					like_count: newLikeCount,
				});
			}

			// 2. 게시글 목록 캐시 업데이트
			queryClient.setQueriesData({ queryKey: ["free_boards"] }, (oldData: any) => {
				if (!oldData) return oldData;
				return oldData.map((item: Post) =>
					item.id === post.id
						? {
								...item,
								is_liked: newIsLiked,
								like_count: newLikeCount,
						  }
						: item
				);
			});

			return { previousData, previousBoardsData };
		},
		// 오류 발생 시 롤백
		onError: (error, _, context) => {
			console.error("좋아요 처리 중 오류 발생:", error);
			setIsLiked(!!context?.previousData?.is_liked);

			if (context?.previousData) {
				queryClient.setQueryData(["free_board", post.id], context.previousData);
			}

			if (context?.previousBoardsData) {
				queryClient.setQueryData(["free_boards"], context.previousBoardsData);
			}
		},
		// 성공 시 최신 데이터로 캐시 갱신
		onSuccess: async (resultIsLiked) => {
			// 서버 응답 기반으로 상태 확인
			setIsLiked(resultIsLiked);

			// 필요한 경우 캐시 갱신 (이미 낙관적 업데이트로 UI는 변경됨)
			await queryClient.refetchQueries({
				queryKey: ["free_boards"],
				exact: true,
			});
		},
	});

	return (
		<article className="bg-[#17222D] p-4 border border-[#384D63] rounded-lg text-[#688DB2]">
			<div className="flex items-center gap-2 mb-5">
				<div className="w-[50px] h-[50px] bg-[#384D63] rounded-full overflow-hidden">
					{post.author_profile_image.indexOf("profile_default_sd") !== -1 ? (
						<img
							src={post.author_profile_image}
							alt="user"
							className="object-none object-[50%_35%]"
						/>
					) : (
						<img
							src={post.author_profile_image}
							alt="user"
							className="w-full h-full object-cover"
						/>
					)}
				</div>
				<div>
					<Typography
						variant="h5"
						className="mb-1"
						style={{ color: "#F0F3FF", lineHeight: "1" }}
					>
						{post.author_nickname}
					</Typography>
					<Typography variant="small">{formattedDate}</Typography>
				</div>
			</div>
			<div className="px-2 border-b border-[#384D63] pb-5 mb-3">
				<Typography className="mb-1" variant="h5" style={{ color: "#fff" }}>
					{post.title}
				</Typography>

				{/*content*/}
				<Typography
					variant="paragraph"
					as="div"
					style={{
						color: "#fff",
						overflow: "hidden",
						display: "-webkit-box",
						WebkitBoxOrient: "vertical",
						WebkitLineClamp: detail ? "none" : 5, // 5줄 제한
					}}
					dangerouslySetInnerHTML={{ __html: sanitizedContent }}
				></Typography>
			</div>
			<div className="flex items-center gap-1">
				<Button
					variant="text"
					color="white"
					className="flex items-center gap-2 px-2"
					size="sm"
				>
					<ChatBubbleOutlineOutlinedIcon className="w-6 h-6" />
					<Typography variant="paragraph">{post.comments_count}</Typography>
				</Button>
				<Button
					variant="text"
					color="white"
					className={`flex items-center gap-2 px-2 ${isLiked ? "text-[#15F5BA]" : ""}`}
					size="sm"
					onClick={(e) => {
						e.preventDefault(); // 링크의 기본 동작 방지
						e.stopPropagation();

						// 로그인 확인
						if (!user?.id) {
							alert("좋아요를 누르려면 로그인이 필요합니다.");
							return;
						}

						mutation.mutate();
					}}
				>
					{/* 좋아요 상태에 따라 다른 아이콘 표시 */}
					{isLiked ? (
						<ThumbUpOutlinedIcon className="w-6 h-6 relative top-[-1px]" />
					) : (
						<ThumbUpOutlinedIcon className="w-6 h-6 relative top-[-1px]" />
					)}
					<Typography variant="paragraph">{post.like_count}</Typography>
				</Button>
			</div>
		</article>
	);
}
