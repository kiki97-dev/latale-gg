"use client";
import { DialogBody } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { Typography } from "@material-tailwind/react";
import { DialogFooter } from "@material-tailwind/react";
import { IconButton } from "@material-tailwind/react";
import { Dialog } from "@material-tailwind/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import ReactQuill from "react-quill";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { updateFreeBoard } from "actions/free_boards-actions";
import toast from "react-hot-toast";

export default function UpdateContentModal({ closeModal, open, post }) {
	const [isSubmitting, setIsSubmitting] = useState(false); // ✅ 중복 요청 방지용 상태
	const [title, setTitle] = useState(post.title);
	const [content, setContent] = useState(post.content); // 퀼 에디터에서 관리하는 내용

	const quillRef = useRef<ReactQuill | null>(null); // ReactQuill에 대한 ref 설정
	// QueryClient 인스턴스 가져오기
	const queryClient = useQueryClient();

	//글 업데이트
	const updatePostMutation = useMutation({
		mutationFn: () => updateFreeBoard(post.id, title, content, post.author_id),
		onMutate: () => {
			setIsSubmitting(true); // ✅ 요청 시작 시 isSubmitting 활성화
		},
		onSuccess: () => {
			// ✅ free_boards 쿼리 무효화 → 최신 데이터 불러옴
			queryClient.invalidateQueries({ queryKey: ["free_boards", post.id] });
		},
		onSettled: () => {
			closeModal();
			setIsSubmitting(false); // ✅ 요청 완료 후 다시 활성화
		},
	});

	// 퀼 에디터에서 내용 변경 처리
	const handleContentChange = (value: string) => {
		setContent(value);
	};

	function stripHtml(html: string) {
		const doc = new DOMParser().parseFromString(html, "text/html");
		return doc.body.textContent || "";
	}

	dayjs.extend(utc);
	dayjs.extend(timezone);
	const formattedDate = dayjs
		.utc(post.created_at)
		.tz("Asia/Seoul")
		.format("YYYY년 MM월 DD일 HH:mm");

	return (
		<Dialog
			open={open}
			size="xs"
			className="bg-[#17222D] border border-[#384D63] z-[9999]"
			dismiss={{ outsidePress: false, escapeKey: false }}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			<div className="flex items-center p-4 gap-3 pb-0" onClick={(e) => e.stopPropagation()}>
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
				<div className="flex-1">
					<Typography
						variant="h5"
						className="mt-2 mb-1"
						style={{ color: "#F0F3FF", lineHeight: "1" }}
					>
						{post.author_nickname}
					</Typography>
					<Typography variant="small">{formattedDate}</Typography>
				</div>
				<IconButton
					className="self-start"
					color="white"
					size="sm"
					variant="text"
					onClick={(e) => {
						// 수정 로직 구현
						closeModal(e);
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						className="h-5 w-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</IconButton>
			</div>
			<DialogBody>
				<div className="border border-[#384D63] p-4 rounded-lg max-h-[500px] overflow-y-auto">
					<input
						type="text"
						placeholder="제목을 입력해 주세요"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full border-b outline-none bg-transparent text-[#fff] placeholder:text-[#688DB2] text-xl font-semibold border-none placeholder:opacity-100 mb-2"
					/>
					<ReactQuill
						theme="snow"
						placeholder="오늘의 생각을 공유해보세요!"
						ref={quillRef} // ReactQuill에 ref 전달
						value={content}
						onChange={handleContentChange}
						className="w-full rounded-lg resize-none bg-transparent text-[#fff] placeholder:text-[#688DB2] placeholder:opacity-100 outline-none font-light border-none"
						style={{
							fontFamily: "inherit", // 기본 글꼴 설정
						}}
					/>
				</div>
			</DialogBody>
			<DialogFooter className="space-x-2">
				<Button
					className="text-sm"
					variant="text"
					color="white"
					onClick={(e) => {
						// 수정 로직 구현
						closeModal(e);
					}}
				>
					취소하기
				</Button>
				<Button
					disabled={
						isSubmitting || title.trim() === "" || stripHtml(content).trim() === ""
					}
					className="bg-[#15F5BA] text-[#261E5A] text-sm"
					variant="gradient"
					color="white"
					onClick={(e) => {
						if (isSubmitting) {
							alert("글을 등록하는 중입니다. 잠시만 기다려주세요!"); // ✅ 경고 메시지 추가
							return;
						}

						const maxLength = 1000; // 최대 글자 수
						const textLength = content.replace(/<[^>]*>/g, "").length; // HTML 태그 제외한 글자 수
						if (textLength > maxLength) {
							toast.error("최대 글자 수 1000자를 초과했습니다", {
								style: {
									background: "#17222D",
									color: "#fff",
									border: "1px solid #384D63",
								},
							});
							return;
						}
						if (title.length > 30) {
							toast.error("제목은 최대 30자까지", {
								style: {
									background: "#17222D",
									color: "#fff",
									border: "1px solid #384D63",
								},
							});
							return;
						}
						updatePostMutation.mutate();
					}}
					loading={updatePostMutation.isPending}
				>
					등록하기
				</Button>
			</DialogFooter>
		</Dialog>
	);
}
