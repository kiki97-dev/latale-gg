import { DialogBody } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { Typography } from "@material-tailwind/react";
import { DialogFooter } from "@material-tailwind/react";
import { IconButton } from "@material-tailwind/react";
import { Dialog } from "@material-tailwind/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import ReactQuill from "react-quill";

export default function UpdateContentModal({ closeModal, open, post, formattedDate }) {
	const [title, setTitle] = useState(post.title);
	const [content, setContent] = useState(post.content); // 퀼 에디터에서 관리하는 내용

	const quillRef = useRef<ReactQuill | null>(null); // ReactQuill에 대한 ref 설정
	// QueryClient 인스턴스 가져오기
	const queryClient = useQueryClient();

	// 퀼 에디터에서 내용 변경 처리
	const handleContentChange = (value: string) => {
		setContent(value);
	};

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
					className="bg-[#15F5BA] text-[#261E5A] text-sm"
					variant="gradient"
					color="white"
					onClick={(e) => {
						// 수정 로직 구현
						closeModal(e);
					}}
				>
					등록하기
				</Button>
			</DialogFooter>
		</Dialog>
	);
}
