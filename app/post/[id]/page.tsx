import Ui from "./Ui";

export default async function PostDetailPage({ params }) {
	const { id } = await params;
	const postId = Number(id);

	return <Ui id={postId} />;
}
