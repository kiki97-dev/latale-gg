"use client";

import { Typography } from "@material-tailwind/react";

export default function Aside() {
	return (
		<aside className="w-[300px] h-[300px] bg-[#17222D] ml-7 rounded-lg flex justify-center items-center flex-col gap-3 border border-[#384D63]">
			<img src="/images/grim_reaper.gif" alt="" />
			<Typography variant="paragraph" className="text-[#fff] text-center">
				컨텐츠 뭐 넣지?
				<br />
				준비중이에오
			</Typography>
		</aside>
	);
}
