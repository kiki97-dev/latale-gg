import { DialogBody } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { Textarea } from "@material-tailwind/react";
import { DialogFooter } from "@material-tailwind/react";
import { IconButton } from "@material-tailwind/react";
import { Dialog } from "@material-tailwind/react";

export default function UpdateContentModal({ closeModal, open }) {
	return (
		<Dialog
			open={open}
			size="xs"
			className="bg-[#17222D] border border-[#384D63] z-[9999]"
			dismiss={{ outsidePress: false, escapeKey: false }}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			<div className="flex justify-end px-4 py-3" onClick={(e) => e.stopPropagation()}>
				<IconButton
					color="white"
					size="sm"
					variant="text"
					onClick={(e) => {
						// 수정 로직 구현
						closeModal(e);
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						className="h-5 w-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</IconButton>
			</div>
			<DialogBody>
				<div className="grid gap-6">
					<Textarea color="white" label="Message" />
				</div>
			</DialogBody>
			<DialogFooter className="space-x-2">
				<Button
					variant="text"
					color="white"
					onClick={(e) => {
						// 수정 로직 구현
						closeModal(e);
					}}
				>
					취소하기
				</Button>
				<Button
					className="bg-[#15F5BA] text-[#261E5A]"
					variant="gradient"
					color="white"
					onClick={(e) => {
						// 수정 로직 구현
						closeModal(e);
					}}
				>
					등록하기
				</Button>
			</DialogFooter>
		</Dialog>
	);
}
