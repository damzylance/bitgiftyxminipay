import RedeemHome from "@/components/Utility/RedeemTradGiftcard";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

type Props = {};

const Redeem = (props: Props) => {
	return (
		<VStack width={"full"} p={"10px"} gap={"20px"} bg={"#152654"}>
			<HStack width={"full"} justifyContent={"center"}>
				{" "}
				<Link href={"/"}>
					<ArrowBackIcon fontSize={"24px"} color={"#fff"} />
				</Link>
				<HStack width={"full"} justifyContent={"center"}>
					{" "}
					<Text fontSize={"16px"} color={"#fff"} fontWeight={"600"}>
						Sell Gift Cards
					</Text>
				</HStack>
			</HStack>
			<RedeemHome />
		</VStack>
	);
};

export default Redeem;
