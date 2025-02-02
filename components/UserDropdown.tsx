"use client";
import React, { useEffect, useState } from "react";
import {
	Avatar,
	Button,
	Menu,
	MenuHandler,
	MenuItem,
	MenuList,
	Typography,
} from "@material-tailwind/react";
import {
	ChatBubbleOvalLeftEllipsisIcon,
	DocumentTextIcon,
	LifebuoyIcon,
	UserCircleIcon,
} from "@heroicons/react/24/solid";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export function UserDropdown({ session }) {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);

	const closeMenu = () => setIsMenuOpen(false);

	//유저 정보 가지고 오기
	const [userInfo, setUserInfo] = useState<{ nickname: string; profile_image: string } | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserInfo = async () => {
			if (!session) return;

			const supabase = await createBrowserSupabaseClient();

			try {
				const { data, error } = await supabase
					.from("users")
					.select("nickname, profile_image")
					.eq("id", session.user.id)
					.single();

				if (error) throw error;

				setUserInfo(data); // 사용자 정보 업데이트
			} catch (err) {
				setError((err as Error).message); // 에러 상태 업데이트
			} finally {
				setLoading(false); // 로딩 끝
			}
		};

		fetchUserInfo(); // 컴포넌트 마운트 후 호출
	}, [session]); // 세션이 변경될 때마다 데이터 새로 고침

	if (loading) {
		return (
			<Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
				로딩중
			</Menu>
		);
	}

	if (error) {
		return (
			<Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
				에러: {error}
			</Menu>
		);
	}

	// profile menu component
	const profileMenuItems = [
		{
			label: userInfo?.nickname || session?.user?.user_metadata?.name || "이름 없음",
			icon: UserCircleIcon,
		},
		{
			label: "작성글",
			icon: DocumentTextIcon,
		},
		{
			label: "댓글",
			icon: ChatBubbleOvalLeftEllipsisIcon,
		},
		{
			label: "Help",
			icon: LifebuoyIcon,
		},
	];

	return (
		<Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
			<MenuHandler>
				<Button
					variant="text"
					color="blue-gray"
					className="flex items-center rounded-full p-0"
				>
					<Avatar
						variant="circular"
						size="sm"
						alt="tania andrew"
						withBorder={true}
						className=" p-0.5 border-[#15F5BA] w-[40px] h-[40px]"
						src={userInfo?.profile_image}
					/>
				</Button>
			</MenuHandler>
			<MenuList className="p-1 bg-[#17222D] border-[#15F5BA] text-[#688DB2] border-opacity-10">
				{profileMenuItems.map(({ label, icon }, key) => {
					return (
						<MenuItem
							key={label}
							onClick={closeMenu}
							className={`flex items-center gap-2 rounded hover:bg-[#1C2936] focus:bg-[#1C2936] active:bg-[#1C2936] hover:text-[#15F5BA] focus:text-[#15F5BA] active:text-[#15F5BA] `}
						>
							{React.createElement(icon, {
								className: `h-5 w-5 `,
								strokeWidth: 2,
							})}
							<Typography as="span" variant="small" className="font-normal">
								{label}
							</Typography>
						</MenuItem>
					);
				})}
			</MenuList>
		</Menu>
	);
}
