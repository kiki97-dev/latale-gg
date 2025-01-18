import type { Config } from "tailwindcss";
import withMT from "@material-tailwind/react/utils/withMT";

const config: Config = {
	content: [
		"./utils/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				// 프리텐다드를 기본 글꼴로 설정
				sans: ['"Pretendard"', "sans-serif"], // 기본 sans 글꼴로 프리텐다드 추가
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};

export default withMT(config);
