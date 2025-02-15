import { Button } from "@material-tailwind/react";
import { Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { sessionState } from "store/userState";

export default function CommentInput() {
	const [content, setContent] = useState(""); // 댓글 입력창 관련 상태
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (e.target.value.length > 1000) return; // 1000자 초과 방지
		setContent(e.target.value);
	};
	const session = useRecoilValue(sessionState); // 전역 세션 값 가져오기

	return (
		<div className="flex  gap-3 mt-3">
			<div className="w-[50px] h-[50px] bg-[#384D63] rounded-full overflow-hidden">
				<img
					src={session?.user.user_metadata.avatar_url}
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
	);
}
