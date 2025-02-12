"use client";
import { Typography } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

export default function BackButton() {
	const router = useRouter();

	const handleBack = () => {
		if (window.history.length > 1) {
			router.back();
		} else {
			router.push("/"); // 홈으로 이동
		}
	};

	return (
		<div className="flex items-center">
			<Button
				size="sm"
				variant="text"
				color="white"
				ripple="light"
				className="flex items-center gap-2"
				onClick={handleBack}
			>
				<i className="fa-solid fa-arrow-left fa-lg"></i>
				<Typography variant="h5" style={{ color: "#F0F3FF", lineHeight: "1" }}>
					뒤로가기
				</Typography>
			</Button>
		</div>
	);
}
