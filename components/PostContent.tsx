"use client";
import { Typography } from "@material-tailwind/react";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { Button } from "@material-tailwind/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import sanitizeHtml from "sanitize-html";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "actions/like-actions";
import { useRecoilValue } from "recoil";
import { userInfo } from "store/userState";
import { useState } from "react";

export default function PostContent({ post, detail = false }) {
	dayjs.extend(utc);
	dayjs.extend(timezone);
	const formattedDate = dayjs
		.utc(post.created_at)
		.tz("Asia/Seoul")
		.format("YYYY년 MM월 DD일 HH:mm");

	const sanitizedContent = sanitizeHtml(post.content, {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]), // img 태그 허용
		allowedAttributes: {
			img: ["src", "alt", "width", "height"],
		},
	});

	const user = useRecoilValue(userInfo); // 전역 세션 값 가져오기
	const queryClient = useQueryClient();
	const [isLiked, setIsLiked] = useState(post.is_liked || false);

	// 좋아요 추가/삭제
	const mutation = useMutation({
		mutationFn: async () => {
			if (!user?.id) {
				throw new Error("User ID is undefined");
			}
			return toggleLike(post.id, user.id);
		},
		onSuccess: async (isLiked) => {
			// 좋아요 상태 업데이트
			setIsLiked(isLiked);

			// ✅ 캐시된 `free_board` 데이터를 직접 수정
			queryClient.setQueryData(["free_board", post.id], (oldData: any) => {
				if (!oldData) return oldData;

				return {
					...oldData,
					like_count: isLiked
						? (oldData.like_count || 0) + 1
						: (oldData.like_count || 0) - 1, // 좋아요 추가 또는 취소 반영
				};
			});

			// ✅ free_boards 쿼리 무효화 → 최신 좋아요 개수 반영
			await queryClient.refetchQueries({ queryKey: ["free_boards"] });
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
			<div className="px-2  border-b border-[#384D63] pb-5 mb-3">
				<Typography className="mb-1" variant="h5" style={{ color: "#fff" }}>
					{post.title}
				</Typography>

				{/*content  */}
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
						mutation.mutate();
					}}
				>
					<ThumbUpOutlinedIcon className="w-6 h-6  relative top-[-1px]" />
					<Typography variant="paragraph">{post.like_count}</Typography>
				</Button>
			</div>
		</article>
	);
}
