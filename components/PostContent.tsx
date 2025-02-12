"use client";
import { Typography } from "@material-tailwind/react";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { Button } from "@material-tailwind/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import sanitizeHtml from "sanitize-html";

export default function PostContent({ post, detail = false }) {
	dayjs.extend(utc);
	dayjs.extend(timezone);
	const formattedDate = dayjs
		.utc(post.created_at)
		.tz("Asia/Seoul")
		.format("YYYY년 MM월 DD일 HH:mm");

	const sanitizedContent = sanitizeHtml(post.content, {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]), // img 태그 허용
		allowedAttributes: {
			img: ["src", "alt", "width", "height"],
		},
	});

	return (
		<article className="bg-[#17222D] p-4 border border-[#384D63] rounded-lg text-[#688DB2]">
			<div className="flex items-center gap-2 mb-5">
				<div className="w-[50px] h-[50px] bg-[#384D63] rounded-full overflow-hidden">
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
					<Typography variant="small">{formattedDate}</Typography>
				</div>
			</div>
			<div className="px-2  border-b border-[#384D63] pb-5 mb-3">
				<Typography className="mb-1" variant="h5" style={{ color: "#fff" }}>
					{post.title}
				</Typography>

				{/*content  */}
				<Typography
					variant="paragraph"
					as="div"
					style={{
						color: "#fff",
						overflow: "hidden",
						display: "-webkit-box",
						WebkitBoxOrient: "vertical",
						WebkitLineClamp: detail ? "none" : 5, // 5줄 제한
					}}
					dangerouslySetInnerHTML={{ __html: sanitizedContent }}
				></Typography>
			</div>
			<div className="flex items-center gap-1">
				<Button
					variant="text"
					color="white"
					className="flex items-center gap-2 px-2"
					size="sm"
				>
					<ChatBubbleOutlineOutlinedIcon className="w-6 h-6" />
					<Typography variant="paragraph">
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
					<Typography variant="paragraph">{post.likes ? post.likes : 0}</Typography>
				</Button>
			</div>
		</article>
	);
}
