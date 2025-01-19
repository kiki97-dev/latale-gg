"use client";
import React from "react";
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

export function UserDropdown({ session }) {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);

	// profile menu component
	const profileMenuItems = [
		{
			label: session?.user?.user_metadata?.name,
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

	const closeMenu = () => setIsMenuOpen(false);

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
						src={session?.user?.user_metadata?.avatar_url}
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
