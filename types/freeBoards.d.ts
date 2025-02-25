import { Database } from "types_db";

// 기존 FreeBoardsRow 타입
export type BaseFreeBoardsRow = Database["public"]["Views"]["free_boards_with_user_info"]["Row"];

// 확장된 인터페이스
export interface FreeBoardsRow extends BaseFreeBoardsRow {
	is_liked?: boolean; // 선택적 속성으로 추가
}
