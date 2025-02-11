"use client";
import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import ArticleIcon from "@mui/icons-material/Article";
import PaidIcon from "@mui/icons-material/Paid";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import React from "react";
import ElyChart from "./ElyChart";

const sidebarMeun = [
	{
		label: "자유게시판",
		icon: ArticleIcon,
	},
	{
		label: "거래게시판",
		icon: PaidIcon,
	},
	{
		label: "인챈트 조회",
		icon: EqualizerIcon,
	},
];

export function Sidebar() {
	const [selected, setSelected] = React.useState(1);
	const setSelectedItem = (value) => setSelected(value);

	return (
		<Card className="h-auto w-full max-w-[17rem] fixed top-[84px] bg-[#17222D] shadow-none">
			<List className="min-w-0 text-[#677079] ">
				{sidebarMeun.map(({ label, icon }, i) => {
					return (
						<ListItem
							key={i}
							className={`hover:bg-[#1C2936] hover:text-[#15F5BA] focus:bg-[#1C2936] focus:text-[#15F5BA] ${
								selected === i + 1 ? "bg-[#17222D] text-[#15F5BA]" : ""
							}`}
							selected={selected === i + 1}
							onClick={() => setSelectedItem(i + 1)}
						>
							<ListItemPrefix>
								{React.createElement(icon, {
									className: `h-5 w-5`,
								})}
							</ListItemPrefix>
							{label}
						</ListItem>
					);
				})}
			</List>

			<ElyChart />
		</Card>
	);
}
