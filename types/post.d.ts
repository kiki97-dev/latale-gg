// 게시글 타입 정의 (필요에 따라 별도 파일로 분리 가능)
export interface Post {
	id: number;
	title: string;
	content: string;
	created_at: string;
	author_nickname: string;
	author_profile_image: string;
	comments_count: number;
	like_count: number;
	is_liked?: boolean;
}
