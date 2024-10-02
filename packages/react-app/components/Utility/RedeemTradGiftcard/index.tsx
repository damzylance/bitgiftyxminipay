import { Grid, GridItem, VStack } from "@chakra-ui/react";
import React from "react";
import { supportedGiftCards } from "./offerings";
import GCWrapper from "./Components/GCWrapper";

type Props = {};

const RedeemHome = (props: Props) => {
	return (
		<VStack width={"full"}>
			<Grid templateColumns="repeat(2, 1fr)" gap={6}>
				{supportedGiftCards.map((giftCard: any) => {
					console.log(giftCard.icon.src);
					return (
						<GridItem key={giftCard.name}>
							<GCWrapper
								imageSrc={giftCard.icon.src}
								text={giftCard.name}
								page={giftCard.name.toLowerCase()}
							/>
						</GridItem>
					);
				})}
			</Grid>
		</VStack>
	);
};

export default RedeemHome;
