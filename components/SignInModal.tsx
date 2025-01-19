"use client";
import { IconButton } from "@material-tailwind/react";
import { Button, Dialog, Card, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import { createBrowserSupabaseClient } from "utils/supabase/client";
import Image from "next/image";

export default function SignInModal({ open, handleOpen }) {
	const supabase = createBrowserSupabaseClient();

	const signInWithKakao = async function signInWithKakao() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "kakao",
			options: {
				redirectTo: process.env.NEXT_PUBLIC_VERCEL_URL
					? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback`
					: "http://localhost:3000/auth/callback",
			},
		});
	};

	return (
		<>
			<Dialog
				size="xs"
				open={open}
				handler={handleOpen}
				className="bg-transparent shadow-none"
				animate={{
					mount: {
						scale: 1.1, // 모달이 나타날 때 살짝 커지는 효과
						y: 0,
						transition: { type: "spring", stiffness: 300, damping: 15 }, // 강한 스프링 효과
					},
					unmount: {
						scale: 0.85, // 모달이 사라질 때 약간 작아지는 효과
						y: 0,
						transition: { type: "spring", stiffness: 300, damping: 15 }, // 강한 스프링 효과
					},
				}}
			>
				<Card className="mx-auto w-full max-w-[24rem] border border-[#15F5BA] border-opacity-20 bg-[#17222D]">
					<CardBody className="flex flex-col gap-4 items-center">
						<div className="flex justify-between w-full items-center">
							<Typography variant="h4" style={{ color: "#F0F3FF" }}>
								로그인
							</Typography>
							<IconButton color="white" size="sm" variant="text" onClick={handleOpen}>
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
						<Image
							src="/images/traveler_sd.png"
							width={300}
							height={318}
							alt="여행자SD"
						/>

						<Typography
							className="mb-1 font-light"
							variant="paragraph"
							style={{ color: "#688DB2" }}
						>
							<span className="text-[#15F5BA]">라테일 </span>
							팬카페 커뮤니티 사이트입니다
						</Typography>
					</CardBody>
					<CardFooter className="pt-0">
						<Button
							variant="fill"
							onClick={() => signInWithKakao()}
							fullWidth
							color="white"
							className="bg-[#15F5BA] text-[#261E5A] text-sm"
						>
							카카오 로그인
						</Button>
					</CardFooter>
				</Card>
			</Dialog>
		</>
	);
}
