import { ArrowBackIcon } from "@chakra-ui/icons";
import { Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import mtnLogo from "../../../public/assets/mtn_logo.png";
import gloLogo from "../../../public/assets/glo_logo.webp";
import airtelLogo from "../../../public/assets/airtel_logo.png";
import safaricomLogo from "../../../public/assets/safaricom_logo.png";
import telkomLogo from "../../../public/assets/telkom_logo.jpeg";

import nineMobileLogo from "../../../public/assets/9mobile_logo.jpeg";
import Image from "next/image";

import { AirtimeForm } from "./AirtimeForm";
import { ProviderCard } from "../ProviderCard";
import { useUserCountry } from "@/utils/UserCountryContext";

type Props = { action: any };

const Airtime = (props: Props) => {
	const telcos = [
		{
			country: "NG",
			telcos: [
				{ name: "mtn", logo: mtnLogo, id: "BIL099", item_code: "AT099" },
				{ name: "airtel", logo: airtelLogo, id: "BIL100", item_code: "AT100" },
				{ name: "glo", logo: gloLogo, id: "BIL102", item_code: "AT133" },
				{
					name: "9mobile",
					logo: nineMobileLogo,
					id: "BIL103",
					item_code: "AT134",
				},
			],
		},
		{
			country: "KE",
			telcos: [
				{ name: "AIRTEL", logo: airtelLogo, id: "BIL187", item_code: "AT497" },
				{
					name: "SAFARICOM",
					logo: safaricomLogo,
					id: "BIL188",
					item_code: "AT498",
				},
				{ name: "TELKOM", logo: telkomLogo, id: "BIL189", item_code: "AT499" },
			],
		},
		{
			country: "GH",
			telcos: [
				// { name: "MTN GHANA", logo: mtnLogo, id: "BIL132", item_code: "AT217" },
				// { name: "TIGO", logo: airtelLogo, id: "BIL133", item_code: "AT218" },
				// {
				// 	name: "VODAFONE",
				// 	logo: telkomLogo,
				// 	id: "BIL134",
				// 	item_code: "AT219",
				// },
			],
		},
		{
			country: "UG",
			telcos: [
				{
					id: 3,
					name: "Airtel",
					logo: airtelLogo,
				},
				{
					id: 2,
					name: "MTN",
					logo: mtnLogo,
				},
			],
		},
		{
			country: "ZA",
			telcos: [
				{
					id: 5,
					name: "Vodacom",
					logo: "https://pretium.africa/images/mobile/vodacom_2.jpeg",
					itemCode: "",
				},
				{
					id: 5,
					name: "MTN",
					logo: mtnLogo,
					itemCode: "",
				},
				{
					id: 6,
					name: "Cell-c",
					logo: "https://pretium.africa/images/mobile/cellc-logo.png",
					itemCode: "",
				},
			],
		},
	];

	const { userCurrencyTicker, userCountryCode, userCountry } = useUserCountry();
	const telcosBycountry = telcos.find(
		(country) => country.country === userCountry
	);
	console.log(telcosBycountry);

	const [page, setPage] = useState("list");
	const [telco, setTelco] = useState(null);
	const [itemCode, setItemCode] = useState(null);
	const [billerCode, setBillerCode] = useState(null);

	return (
		<>
			{page === "list" && (
				<VStack width={"full"} gap={"20px"} my={"10px"}>
					<Text fontSize={"24px"} fontWeight={700}>
						{" "}
						Select Telco Provider
					</Text>
					<VStack width={"full"} gap={"10px"}>
						{telcos.length > 0 ? (
							telcosBycountry?.telcos.map((provider: any) => {
								return (
									<ProviderCard
										action={() => {
											setPage("buy");
											setTelco(provider.name);
											setBillerCode(provider.id);
											setItemCode(provider.item_code);
										}}
										name={provider.name}
										logo={provider.logo}
										key={provider.id}
									/>
								);
							})
						) : (
							<Text>Coming Soon</Text>
						)}
					</VStack>
				</VStack>
			)}
			{page === "buy" && (
				<AirtimeForm
					telco={telco}
					billerCode={billerCode}
					itemCode={itemCode}
					onClose={props.action}
					back={() => setPage("list")}
				/>
			)}
		</>
	);
};

export default Airtime;
