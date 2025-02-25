import { Typography } from "@material-tailwind/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export default function Comment({ comment }) {
	dayjs.extend(utc);
	dayjs.extend(timezone);
	const formattedDate = dayjs.utc(comment.created_at).tz("Asia/Seoul").format("YY.MM.DD HH:mm");
	return (
		<>
			<div className="flex  gap-3 mt-3">
				<div className="w-[50px] h-[50px] bg-[#384D63] rounded-full overflow-hidden">
					{comment.profile_image.indexOf("profile_default_sd") !== -1 ? (
						<img
							src={comment.profile_image}
							alt="user"
							className="object-none object-[50%_35%]"
						/>
					) : (
						<img
							src={comment.profile_image}
							alt="user"
							className="w-full h-full object-cover"
						/>
					)}
				</div>
				<div className="flex flex-1 flex-col bg-[#1C2936] rounded-lg px-4 py-3">
					<div className="flex items-center gap-2">
						<Typography variant="h6" color="white">
							{comment.nickname}
						</Typography>
						<Typography variant="small" className="text-[#688DB2]">
							{formattedDate}
						</Typography>
					</div>
					<Typography variant="paragraph" color="white">
						{comment.content}
					</Typography>
				</div>
			</div>
		</>
	);
}
