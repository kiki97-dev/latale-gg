import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function CommentSkeleton() {
	return (
		<div className="bg-[#17222D] p-4 rounded-lg border border-[#384D63]">
			<div className="flex gap-3 items-center w-full flex-1 mb-4">
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
						height={30}
						baseColor="#1B2834"
						highlightColor="#384D63"
					/>
					<Skeleton
						className="flex-1"
						width="100%"
						height={15}
						baseColor="#1B2834"
						highlightColor="#384D63"
					/>
				</div>
			</div>
			<Skeleton height={120} baseColor="#1B2834" highlightColor="#384D63" />
		</div>
	);
}
