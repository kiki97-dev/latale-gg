"use client"; // 클라이언트 전용 컴포넌트로 분리

import UpdateContentModal from "components/UpdateContentModal";
import { useRecoilState } from "recoil";
import { currentPostState, modalOpenState } from "store/updateContentModalState";

export default function ClientLayout({ children }) {
	const [open, setOpen] = useRecoilState(modalOpenState);
	const [currentPost, setCurrentPost] = useRecoilState(currentPostState);

	const closeModal = (e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		// 모달 닫기
		setOpen(false);

		// 약간의 딜레이 후 현재 포스트 정보 초기화 (애니메이션 완료 후)
		setTimeout(() => {
			setCurrentPost(null);
		}, 300);
	};

	return (
		<>
			{children}
			{currentPost && (
				<UpdateContentModal closeModal={closeModal} open={open} post={currentPost} />
			)}
		</>
	);
}
