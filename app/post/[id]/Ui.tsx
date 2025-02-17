"use client";
import PostDetail from "components/PostDetail";
import BackButton from "components/BackButton";

export default function Ui({ id }) {
	return (
		<section className="flex-1 flex flex-col gap-3 pb-10">
			<BackButton />
			<PostDetail postId={id} />
		</section>
	);
}
