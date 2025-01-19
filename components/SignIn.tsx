"use client";
import { IconButton } from "@material-tailwind/react";
import {
	Button,
	Dialog,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Typography,
	Input,
	Checkbox,
} from "@material-tailwind/react";
import Image from "next/image";
import { useState } from "react";

export default function SignIn() {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen((cur) => !cur);

	return (
		<>
			<Button
				variant="filled"
				color="white"
				size="sm"
				className="text-sm font-extrabold bg-[#15F5BA] text-[#261E5A] whitespace-nowrap"
				onClick={handleOpen}
			>
				로그인
			</Button>
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
							onClick={handleOpen}
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
