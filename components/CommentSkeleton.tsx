"use client";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function CommentSkeleton() {
	return (
		<div>
			<div className="flex gap-3 items-start w-full flex-1 mb-4">
				<Skeleton
					circle
					height={50}
					width={50}
					baseColor="#1B2834"
					highlightColor="#384D63"
				/>
				<div className="flex-1">
					<Skeleton
						className="flex-1"
						width="100%"
						height={70}
						baseColor="#1B2834"
						highlightColor="#384D63"
					/>
				</div>
			</div>
		</div>
	);
}
