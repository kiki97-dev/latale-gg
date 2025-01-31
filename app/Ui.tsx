"use clinet";

import FreeBoards from "components/FreeBoards";

export default function Ui() {
	return (
		<div className="flex items-start flex-1 ml-[calc(272px+1.75rem)]">
			<section className="flex-1">
				<FreeBoards />
			</section>
			<aside className="w-[300px] h-[300px] bg-blue-gray-200 ml-7"></aside>
		</div>
	);
}
