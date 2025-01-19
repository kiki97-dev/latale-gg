"use client";
import { Input } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import SignIn from "./SignIn";
import SignOut from "./SignOut";
import { UserDropdown } from "./UserDropdown";

export default function Header({ session }) {
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
				{/* 검색 */}
				<div>
					<Input
						className="!text-[#fff] !bg-[#121B24] border-none placeholder:text-[inherit] placeholder:opacity-70 rounded-full pl-5 !font-light focus:outline-1  focus:outline-[#15F5BA] duration-0"
						color="white"
						placeholder="검색어를 입력하세요."
						icon={<i className="fas fa-search text-[#15F5BA]" />}
						labelProps={{
							className: "hidden",
						}}
						containerProps={{ className: "min-w-0 md:min-w-[360px]" }}
					/>
				</div>
				{/* 로그인버튼 */}
				<div className="flex gap-4 items-center">
					{session?.user ? (
						<>
							<UserDropdown session={session} />
							<SignOut />
						</>
					) : (
						<SignIn />
					)}
				</div>
			</div>
		</header>
	);
}
