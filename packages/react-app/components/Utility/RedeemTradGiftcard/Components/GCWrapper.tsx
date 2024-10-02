import { VStack, Image, Text, Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

type Props = {
	imageSrc: string; // Image source
	text: string; // Text to display
	page: string;
};

const GCWrapper = ({ imageSrc, text, page }: Props) => {
	return (
		<VStack
			width={"full"}
			spacing={4}
			align="center"
			p={"4px"}
			bg={"#d8eff3"}
			borderRadius={"6px"}
		>
			<Link href={`/redeem/${page}`}>
				<Image src={imageSrc} alt="Image" height={100} borderRadius={"6px"} />
				<Text fontSize="sm" textAlign={"center"}>
					{text}
				</Text>
			</Link>
		</VStack>
	);
};

export default GCWrapper;
