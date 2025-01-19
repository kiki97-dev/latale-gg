"use client";
import { Input } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
	return (
		<header className="bg-[#17222D] text-[#fff] fixed top-0 left-0 w-full ">
			<div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
				<Link href={"/"} className="flex items-center gap-1">
					<Image
						src="/images/baby_rat.png"
						width={48}
						height={49}
						alt="아기 쥐돌이"
						className="h-[40px] object-contain"
					/>
					LATALE.GG
				</Link>
				<div>
					<Input
						className="!text-[#fff] bg-[#121B24] border-none placeholder:text-[inherit] placeholder:opacity-70 rounded-full pl-5 !font-light focus:outline-1  focus:outline-[#15F5BA] duration-0"
						color="white"
						placeholder="검색어를 입력하세요."
						icon={<i className="fas fa-search text-[#15F5BA]" />}
						labelProps={{
							className: "hidden",
						}}
						containerProps={{ className: "min-w-0 md:min-w-[360px]" }}
					/>
				</div>

				<div>
					<Button
						variant="filled"
						color="white"
						size="sm"
						className="text-sm font-extrabold bg-[#15F5BA] text-[#261E5A] whitespace-nowrap"
					>
						로그인
					</Button>
				</div>
			</div>
		</header>
	);
}
