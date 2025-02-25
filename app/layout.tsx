import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "config/material-tailwind-theme-provider";
import { ReactNode } from "react";
import ReactQueryClientProvider from "config/ReactQueryClientProvider";
import AuthProvider from "config/auth-provider";
import Header from "components/Header";
import { Sidebar } from "components/Sidebar";
import { Toaster } from "react-hot-toast";
import RecoilProvider from "config/RecoilProvider";
import Aside from "components/Aside";
import { createServerSupabaseClient } from "utils/supabase/server";

export const metadata: Metadata = {
	title: "LATALE.GG",
	description: "LATALE.GG",
};

const pretendard = localFont({
	src: "../fonts/PretendardVariable.woff2",
	display: "swap",
	weight: "45 920",
	variable: "--font-pretendard",
});

export default async function RootLayout({ children }: { children: ReactNode }) {
	/* 여기코드 지우면 auth 프로바이더에서 빌드오류남 */
	const supabase = await createServerSupabaseClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	return (
		<html lang="ko">
			<head>
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
					integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
					crossOrigin="anonymous"
					referrerPolicy="no-referrer"
				/>
			</head>
			<body className={`${pretendard.variable} font-pretendard bg-[#121B24] relative`}>
				<ReactQueryClientProvider>
					<ThemeProvider>
						<RecoilProvider>
							<AuthProvider>
								<div>
									<Toaster />
								</div>
								<Header />
								<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex pt-[90px]">
									<Sidebar />
									<div className="flex items-start flex-1 ml-[calc(272px+1.75rem)]">
										{children}
									</div>
									<Aside />
								</div>
							</AuthProvider>
						</RecoilProvider>
					</ThemeProvider>
				</ReactQueryClientProvider>
			</body>
		</html>
	);
}
