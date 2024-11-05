export const supportedTokens = ["CUSD", "USDT", "USDC"];
export function getCountryCurrency(countryCode: string): string {
	const countryCurrencyMap: { [key: string]: string } = {
		UG: "UGX", // Uganda Shilling
		GH: "GHS", // Ghanaian Cedi
		NG: "NGN", // Nigerian Naira
		KE: "KES", // Kenyan Shilling
		ZA: "ZAR", // South African Rand
	};

	return countryCurrencyMap[countryCode] || "Currency not supported";
}

import {
	FaMoneyBillWave,
	FaBolt,
	FaTv,
	FaMobileAlt,
	FaGlobe,
} from "react-icons/fa";
import bet9jaLogo from "../public/assets/bet9ja-logo.webp";
import Image from "next/image";

export const servicesByCountry = [
	{
		country: "NG",
		services: [
			{
				name: "Airtime",
				icon: <FaMobileAlt />,
				bg: "linear-gradient(87.57deg, rgba(63, 255, 163, 0.35) 0%, rgba(0, 143, 204, 0.35) 100%)",
			},
			{
				name: "Data",
				icon: <FaGlobe />,
				bg: "linear-gradient(272.43deg, rgba(255, 74, 128, 0.35) 0%, rgba(0, 87, 255, 0.35) 100%)",
			},
			{
				name: "Electricity",
				icon: <FaBolt />,
				bg: "linear-gradient(272.43deg, rgba(255, 184, 0, 0.35) 0%, rgba(255, 74, 128, 0.35) 100%)",
			},
			{
				name: "Cable",
				icon: <FaTv />,
				bg: "linear-gradient(87.3deg, rgba(186, 102, 255, 0.35) -0.49%, rgba(0, 206, 206, 0.35) 100%)",
			},
			{
				name: "Bet9ja",
				icon: (
					<Image
						src={bet9jaLogo}
						style={{ borderRadius: "6px" }}
						width={50}
						height={50}
						alt=""
					/>
				),
				bg: "linear-gradient(23.9deg, rgba(71, 183, 57, 0.35) 0%, rgba(141, 243, 229, 0.35) 100%)",
			},
		],
	},
	{
		country: "GH",
		services: [
			{
				name: "MoMo",
				icon: <FaMoneyBillWave />,
				bg: "linear-gradient(23.9deg, rgba(71, 183, 57, 0.35) 0%, rgba(141, 243, 229, 0.35) 100%)",
			}, // Mobile Money
		],
	},
	{
		country: "KE",
		services: [
			{
				name: "Airtime",
				icon: <FaMobileAlt />,
				bg: "linear-gradient(87.57deg, rgba(63, 255, 163, 0.35) 0%, rgba(0, 143, 204, 0.35) 100%)",
			},
			{
				name: "Data",
				icon: <FaGlobe />,
				bg: "linear-gradient(272.43deg, rgba(255, 74, 128, 0.35) 0%, rgba(0, 87, 255, 0.35) 100%)",
			},
			{
				name: "Buy Goods",
				icon: <FaMoneyBillWave />,
				bg: "linear-gradient(23.9deg, rgba(71, 183, 57, 0.35) 0%, rgba(141, 243, 229, 0.35) 100%)",
			}, // M-PESA "Buy Goods"
			{
				name: "Pay Bills",
				icon: <FaMoneyBillWave />,
				bg: "linear-gradient(87.3deg, rgba(186, 102, 255, 0.35) -0.49%, rgba(0, 206, 206, 0.35) 100%)",
			},
		],
	},
	{
		country: "UG",
		services: [
			{
				name: "Airtime",
				icon: <FaMobileAlt />,
				bg: "linear-gradient(87.57deg, rgba(63, 255, 163, 0.35) 0%, rgba(0, 143, 204, 0.35) 100%)",
			},
			// {
			// 	name: "Momo",
			// 	icon: <FaMoneyBillWave />,
			// 	bg: "linear-gradient(23.9deg, rgba(71, 183, 57, 0.35) 0%, rgba(141, 243, 229, 0.35) 100%)",
			// },
		],
	},
	{
		country: "ZA",
		services: [
			{
				name: "Airtime",
				icon: <FaMobileAlt />,
				bg: "linear-gradient(87.57deg, rgba(63, 255, 163, 0.35) 0%, rgba(0, 143, 204, 0.35) 100%)",
			},
			// { name: "Momo", icon: <FaMoneyBillWave /> },
		],
	},
];

export function getRandomBackground() {
	// Helper function to generate random RGBA color
	const getRandomColor = () => {
		const r = Math.floor(Math.random() * 256);
		const g = Math.floor(Math.random() * 256);
		const b = Math.floor(Math.random() * 256);
		const a = 0.35; // Constant opacity for this use case
		return `rgba(${r}, ${g}, ${b}, ${a})`;
	};

	// Generate random angle for the gradient
	const angle = Math.random() * 360;

	// Generate two random colors
	const color1 = getRandomColor();
	const color2 = getRandomColor();

	// Return the random linear-gradient CSS value
	return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
}
