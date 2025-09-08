"use client";
import { Input } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import SignIn from "./SignIn";
import SignOut from "./SignOut";
import { UserDropdown } from "./UserDropdown";
import { useRecoilValue } from "recoil";
import { sessionState } from "store/userState";

export default function Header() {
	const session = useRecoilValue(sessionState); // 전역 세션 값 가져오기
	return (
		<header className="bg-[#17222D] text-[#fff] fixed top-0 left-0 w-full z-10 border-b border-[#1C2936] ">
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
				<div className="hedaer-search">
					<Input
						className="!text-[#fff] !bg-[#121B24] border-none rounded-full pl-5 !font-light focus:outline-1  focus:outline-[#15F5BA] duration-0 placeholder-[#688DB2] placeholder:opacity-100"
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
