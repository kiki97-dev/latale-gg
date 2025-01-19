"use client";

import { Button } from "@material-tailwind/react";
import { useState } from "react";
import SignInModal from "./SignInModal";

export default function SignIn() {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen((cur) => !cur);

	return (
		<>
			<Button
				variant="filled"
				color="white"
				size="sm"
				className="text-sm font-extrabold bg-[#15F5BA] text-[#261E5A] whitespace-nowrap"
				onClick={handleOpen}
			>
				로그인
			</Button>
			<SignInModal open={open} handleOpen={handleOpen} />
		</>
	);
}
