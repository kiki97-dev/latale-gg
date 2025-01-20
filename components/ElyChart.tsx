import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";

// If you're using Next.js please use the dynamic import for react-apexcharts and remove the import from the top for the react-apexcharts
import dynamic from "next/dynamic";
import Image from "next/image";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const chartConfig = {
	type: "line",
	height: 200,
	series: [
		{
			name: "Sales",
			data: [190, 200, 210, 215, 195],
		},
	],
	options: {
		chart: {
			toolbar: {
				show: false,
			},
		},
		title: {
			show: "",
		},
		dataLabels: {
			enabled: false,
		},
		colors: ["#15F5BA"],
		stroke: {
			lineCap: "round",
			curve: "smooth",
			width: 2,
		},
		markers: {
			size: 5,
		},
		xaxis: {
			axisTicks: {
				show: false,
			},
			axisBorder: {
				show: false,
			},
			labels: {
				style: {
					colors: "#688DB2",
					fontSize: "12px",
					fontFamily: "inherit",
					fontWeight: 400,
				},
			},
			categories: ["1일", "2일", "3일", "4일", "5일"],
		},
		yaxis: {
			labels: {
				style: {
					colors: "#688DB2",
					fontSize: "12px",
					fontFamily: "inherit",
					fontWeight: 400,
				},
			},
		},
		grid: {
			show: true,
			borderColor: "#688DB2",
			strokeDashArray: 10,
			xaxis: {
				lines: {
					show: true,
				},
			},
			padding: {
				top: 5,
				right: 20,
			},
		},
		fill: {
			opacity: 0.8,
		},
		tooltip: {
			theme: "dark",
		},
	},
};
export default function ElyChart() {
	return (
		<Card className="bg-[#17222D]">
			<CardHeader
				floated={false}
				shadow={false}
				color="transparent"
				className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
			>
				<Image src="/images/cash.png" alt="캐시" width={38} height={33} />
				<div>
					<Typography variant="h6" className="font-normal text-[#15F5BA]">
						엘리시세
					</Typography>
					<Typography variant="small" className="max-w-sm font-normal text-[#688DB2]">
						당근 구현 안됨
					</Typography>
				</div>
			</CardHeader>
			<CardBody className=" px-0 pb-0 pt-0 ">
				<Chart {...chartConfig} />
			</CardBody>
		</Card>
	);
}
