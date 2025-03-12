"use client";
import { Button } from "@material-tailwind/react";
import { Typography } from "@material-tailwind/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "actions/comments-actions";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { userInfo } from "store/userState";
import SignInModal from "./SignInModal";
import toast from "react-hot-toast";
import Image from "next/image";

export default function CommentInput({ postId }) {
	const [isSubmitting, setIsSubmitting] = useState(false); // ✅ 중복 방지용 상태
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setContent(e.target.value);
	};
	const [content, setContent] = useState(""); // 댓글 입력창 관련 상태
	const user = useRecoilValue(userInfo); // 전역 세션 값 가져오기

	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen((cur) => !cur);

	// QueryClient 인스턴스 가져오기
	const queryClient = useQueryClient();

	const createCommentMutation = useMutation({
		mutationFn: () => {
			if (!user?.id) {
				handleOpen();
				throw new Error("User ID is undefined");
			}
			return createComment(postId, user.id, content);
		},
		onMutate: () => {
			setIsSubmitting(true); // ✅ 요청 시작 시 중복 방지
		},
		onSuccess: async () => {
			// ✅ 댓글 목록 쿼리 무효화 → 최신 댓글 데이터 불러옴
			queryClient.invalidateQueries({ queryKey: ["comments", postId] });

			// ✅ 캐시된 `free_boards` 데이터를 직접 수정 → comments_count 증가 반영
			queryClient.setQueryData(["free_boards", postId], (oldData: any) => {
				if (!oldData) return oldData;
				return {
					...oldData,
					comments_count: (oldData.comments_count || 0) + 1, // 기존 값에 1 추가
				};
			});

			// 입력 폼 초기화
			setContent("");

			// ✅ 게시글 목록에서도 `comments_count` 최신화
			await queryClient.refetchQueries({ queryKey: ["free_boards"] });
		},
		onSettled: () => {
			setIsSubmitting(false); // ✅ 요청 완료 후 다시 활성화
		},
	});

	return (
		<>
			<div className="flex  gap-3 mt-3">
				<div className="w-[50px] h-[50px] bg-[#384D63] rounded-full overflow-hidden flex justify-center items-center">
					{user?.profile_image ? (
						<Image
							width={200}
							height={200}
							src={user?.profile_image}
							alt="user"
							className={`object-none object-[50%_35%]`}
						/>
					) : (
						<Image
							width={40}
							height={40}
							src={"/images/default_profile.gif"}
							alt="user"
							className={`object-cover `}
							unoptimized
						/>
					)}
				</div>
				<div className="flex flex-1 gap-3 flex-col bg-[#1C2936] rounded-lg p-4">
					{user ? (
						<>
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
							<div className="flex w-full items-end justify-between gap-3">
								<Typography
									variant="small"
									color="white"
									style={{ lineHeight: "1" }}
									className="opacity-60 pb-1"
								>
									<span className="text-[#15F5BA]">{content.length}</span> / 1000
								</Typography>
								<Button
									disabled={isSubmitting || content.length === 0}
									variant="filled"
									color="white"
									size="sm"
									className="text-sm font-extrabold bg-[#15F5BA] text-[#261E5A] whitespace-nowrap"
									onClick={() => {
										if (isSubmitting) {
											alert("댓글을 등록하는 중입니다. 잠시만 기다려주세요!");
											return;
										}

										if (content.length > 1000) {
											toast.error("최대 글자 수 1000자를 초과했습니다", {
												style: {
													background: "#17222D",
													color: "#fff",
													border: "1px solid #384D63",
												},
											});
											return;
										}
										createCommentMutation.mutate();
									}}
									loading={createCommentMutation.isPending}
								>
									등록
								</Button>
							</div>
						</>
					) : (
						<>
							<Typography
								variant="paragraph"
								color="white"
								style={{ lineHeight: "1" }}
							>
								로그인 후 댓글을 작성할 수 있습니다.
							</Typography>
						</>
					)}
				</div>
			</div>
			<SignInModal open={open} handleOpen={handleOpen} />
		</>
	);
}
