"use client";
import { Typography } from "@material-tailwind/react";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { Button } from "@material-tailwind/react";

export default function FreeBoards() {
	return (
		<article className="bg-[#17222D] p-4 border border-[#384D63] rounded-lg text-[#688DB2]">
			<div className="flex items-center gap-2 mb-5">
				<div className="w-[50px] h-[50px] bg-blue-gray-50 rounded-full"></div>
				<div>
					<Typography
						variant="h5"
						className="mb-1"
						style={{ color: "#F0F3FF", lineHeight: "1" }}
					>
						작성자
					</Typography>
					<Typography variant="caption" style={{ lineHeight: "1", fontSize: "0.85rem" }}>
						1 시간 전
					</Typography>
				</div>
			</div>
			<div className="px-2">
				<Typography variant="h5" style={{ color: "#fff" }}>
					제목 어쩌구 저쩌구
				</Typography>
				<Typography variant="body1" style={{ color: "#fff" }}>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum nisi velit sunt
					quae quasi doloribus corporis expedita, eos quos molestias sapiente nihil iusto
					consequuntur maxime, vel fuga vero impedit cupiditate!
				</Typography>
				<div className="flex items-center gap-1 border-t border-[#384D63] pt-3 mt-5 ">
					<Button
						variant="text"
						color="white"
						className="flex items-center gap-2 px-2"
						size="sm"
					>
						<ChatBubbleOutlineOutlinedIcon className="w-6 h-6" />
						<Typography variant="caption">0</Typography>
					</Button>
					<Button
						variant="text"
						color="white"
						className="flex items-center gap-2 px-2"
						size="sm"
					>
						<ThumbUpOutlinedIcon className="w-6 h-6  relative top-[-1px]" />
						<Typography variant="caption">0</Typography>
					</Button>
				</div>
			</div>
		</article>
	);
}
