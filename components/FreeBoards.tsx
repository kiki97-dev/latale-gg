"use client";
import { Typography } from "@material-tailwind/react";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { Button } from "@material-tailwind/react";

export default function FreeBoards({ post }) {
	return (
		<article className="bg-[#17222D] p-4 border border-[#384D63] rounded-lg text-[#688DB2]">
			<div className="flex items-center gap-2 mb-5">
				<div className="w-[50px] h-[50px] bg-blue-gray-50 rounded-full overflow-hidden">
					<img
						src={post.author_profile_image}
						alt="user"
						className="w-full h-full object-cover"
					/>
				</div>
				<div>
					<Typography
						variant="h5"
						className="mb-1"
						style={{ color: "#F0F3FF", lineHeight: "1" }}
					>
						{post.author_nickname}
					</Typography>
					<Typography variant="caption" style={{ lineHeight: "1", fontSize: "0.85rem" }}>
						{post.created_at}
					</Typography>
				</div>
			</div>
			<div className="px-2  ">
				<Typography className="mb-1" variant="h5" style={{ color: "#fff" }}>
					{post.title}
				</Typography>
				<Typography
					className="border-b border-[#384D63] pb-5 mb-3"
					variant="body1"
					style={{ color: "#fff" }}
				>
					{post.content}
				</Typography>
			</div>
			<div className="flex items-center gap-1">
				<Button
					variant="text"
					color="white"
					className="flex items-center gap-2 px-2"
					size="sm"
				>
					<ChatBubbleOutlineOutlinedIcon className="w-6 h-6" />
					<Typography variant="caption">
						{post.comments_count ? post.comments_count : 0}
					</Typography>
				</Button>
				<Button
					variant="text"
					color="white"
					className="flex items-center gap-2 px-2"
					size="sm"
				>
					<ThumbUpOutlinedIcon className="w-6 h-6  relative top-[-1px]" />
					<Typography variant="caption">{post.likes ? post.likes : 0}</Typography>
				</Button>
			</div>
		</article>
	);
}
