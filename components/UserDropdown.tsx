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
	Cog6ToothIcon,
	InboxArrowDownIcon,
	LifebuoyIcon,
	PowerIcon,
	UserCircleIcon,
} from "@heroicons/react/24/solid";

export function UserDropdown({ session }) {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);

	// profile menu component
	const profileMenuItems = [
		{
			label: `${session?.user?.email?.split("@")?.[0]}`,
			icon: UserCircleIcon,
		},
		{
			label: "Edit Profile",
			icon: Cog6ToothIcon,
		},
		{
			label: "Inbox",
			icon: InboxArrowDownIcon,
		},
		{
			label: "Help",
			icon: LifebuoyIcon,
		},
		{
			label: "Sign Out",
			icon: PowerIcon,
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
						className=" p-0.5 border-[#15F5BA]"
						src="https://docs.material-tailwind.com/img/face-2.jpg"
					/>
				</Button>
			</MenuHandler>
			<MenuList className="p-1">
				{profileMenuItems.map(({ label, icon }, key) => {
					const isLastItem = key === profileMenuItems.length - 1;
					return (
						<MenuItem
							key={label}
							onClick={closeMenu}
							className={`flex items-center gap-2 rounded ${
								isLastItem
									? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
									: ""
							}`}
						>
							{React.createElement(icon, {
								className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
								strokeWidth: 2,
							})}
							<Typography
								as="span"
								variant="small"
								className="font-normal"
								color={isLastItem ? "red" : "inherit"}
							>
								{label}
							</Typography>
						</MenuItem>
					);
				})}
			</MenuList>
		</Menu>
	);
}
