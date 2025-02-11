"use client";

import { useState, useRef } from "react";
import { Button } from "@material-tailwind/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./postinput.css";
import SignInModal from "./SignInModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFreeBoard } from "actions/free_boards-actions";
import { toast } from "react-hot-toast";

export default function PostInput({ session }) {
	const [isWriting, setIsWriting] = useState(false);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState(""); // 퀼 에디터에서 관리하는 내용
	const [images, setImages] = useState<string[]>([]); // 붙여넣은 이미지 URL 저장
	const [open, setOpen] = useState(false); //로그인 모달창

	const quillRef = useRef<ReactQuill | null>(null); // ReactQuill에 대한 ref 설정

	// QueryClient 인스턴스 가져오기
	const queryClient = useQueryClient();

	//로그인 모달 오픈
	const handleOpen = () => setOpen((cur) => !cur);

	// 글쓰기 버튼 클릭 → 입력 폼 열기
	const handleStartWriting = () => {
		if (session?.user) {
			setIsWriting(true);
		} else {
			handleOpen();
		}
	};

	// 취소 버튼 클릭 → 초기화 후 닫기
	const handleCancel = () => {
		setIsWriting(false);
		setTitle("");
		setContent("");
		setImages([]);
	};

	// 퀼 에디터에서 내용 변경 처리
	const handleContentChange = (value: string) => {
		setContent(value);
	};

	// 이미지 붙여넣기 핸들러
	const handleImageUpload = (file: File) => {
		// 파일 크기 체크 후 업로드
		const fileSizeLimit = 2 * 1024 * 1024; // 5MB
		if (file.size > fileSizeLimit) {
			alert("이미지 파일 크기는 2MB 이하로 업로드해야 합니다.");
			return;
		}

		// 이미지 URL 생성 후 에디터에 삽입
		const imageUrl = URL.createObjectURL(file);
		setImages((prev) => [...prev, imageUrl]);

		// 퀼 에디터에서 이미지 삽입
		if (quillRef.current) {
			const editor = quillRef.current.getEditor(); // 퀼 인스턴스를 가져옴
			const range = editor.getSelection(); // 선택된 위치 가져오기

			// range가 null이 아닐 경우에만 삽입
			if (range) {
				const imageHTML = `<img src="${imageUrl}" alt="첨부 이미지" style="max-width:100%;"/>`;
				editor.insertEmbed(range.index, "image", imageHTML); // 선택된 위치에 이미지 삽입
			} else {
				// range가 null일 경우, 커서 위치에 이미지를 삽입
				const imageHTML = `<img src="${imageUrl}" alt="첨부 이미지" style="max-width:100%;"/>`;
				editor.insertEmbed(0, "image", imageHTML); // 커서 위치에 이미지 삽입 (range가 없으므로 0번째 인덱스에 삽입)
			}
		}
	};

	//글 업로드
	const createPostMutation = useMutation({
		mutationFn: () => createFreeBoard(title, content, session.user.id),
		onSuccess: () => {
			// ✅ free_boards 쿼리 무효화 → 최신 데이터 불러옴
			queryClient.invalidateQueries({ queryKey: ["free_boards"] });
			// 입력 폼 초기화
			setIsWriting(false);
			setTitle("");
			setContent("");
			setImages([]);
		},
	});

	function stripHtml(html: string) {
		const doc = new DOMParser().parseFromString(html, "text/html");
		return doc.body.textContent || "";
	}

	return (
		<>
			<div className="border border-[#384D63] bg-[#17222D] px-4 py-3 rounded-lg">
				{!isWriting ? (
					// 글쓰기 전 상태
					<div className="flex items-center justify-between gap-3">
						<div className="bg-[#121B24] flex-1 px-5 py-2 rounded-full">
							<p className="text-[#688DB2] ">오늘의 생각을 공유해보세요!</p>
						</div>

						<Button
							variant="filled"
							color="white"
							size="sm"
							className="text-sm font-extrabold bg-[#15F5BA] text-[#261E5A] whitespace-nowrap"
							onClick={() => {
								handleStartWriting();
							}}
						>
							글쓰기
						</Button>
					</div>
				) : (
					// 글쓰기 모드
					<div>
						<input
							type="text"
							placeholder="제목을 입력해 주세요"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full px-2 pt-2 border-b outline-none bg-transparent text-[#fff] placeholder:text-[#688DB2] text-xl font-semibold border-none placeholder:opacity-100"
						/>

						{/* react-quill 에디터 */}
						<ReactQuill
							theme="snow"
							placeholder="오늘의 생각을 공유해보세요!"
							ref={quillRef} // ReactQuill에 ref 전달
							value={content}
							onChange={handleContentChange}
							className="w-full p-2 rounded-lg resize-none bg-transparent text-[#fff] placeholder:text-[#688DB2] placeholder:opacity-100 outline-none font-light border-none"
							style={{
								fontFamily: "inherit", // 기본 글꼴 설정
							}}
						/>

						{/* 버튼 영역 */}
						<div className="flex justify-end mt-2 gap-2">
							<Button
								color="red"
								size="sm"
								className="text-sm font-extrabold whitespace-nowrap shadow-none"
								onClick={handleCancel}
							>
								취소
							</Button>
							<Button
								disabled={title.trim() === "" || stripHtml(content).trim() === ""}
								variant="filled"
								color="white"
								size="sm"
								className="text-sm font-extrabold bg-[#15F5BA] text-[#261E5A] whitespace-nowrap"
								onClick={() => {
									const maxLength = 1000; // 최대 글자 수
									const textLength = content.replace(/<[^>]*>/g, "").length; // HTML 태그 제외한 글자 수
									if (textLength > maxLength) {
										toast.error("최대 글자 수 1000자를 초과했습니다");
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
									createPostMutation.mutate();
								}}
								loading={createPostMutation.isPending}
							>
								등록
							</Button>
						</div>
					</div>
				)}
			</div>
			<SignInModal open={open} handleOpen={handleOpen} />
		</>
	);
}
