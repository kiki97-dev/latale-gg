"use client";

import FreeBoards from "components/FreeBoards";
import PostInput from "components/PostInput";
import { useRecoilValue } from "recoil";
import { sessionState } from "store/authState";

export default function Ui() {
	const session = useRecoilValue(sessionState); // 전역 세션 값 가져오기
	return (
		<>
			<section className="flex-1 flex flex-col gap-3 pb-10">
				<PostInput session={session} />
				<FreeBoards />
			</section>
		</>
	);
}
