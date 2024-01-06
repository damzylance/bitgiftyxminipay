import WidgetContainer from "@/components/WidgetContainer";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import MenuCard from "@/components/MenuCard";
import redeemIcon from "../public/assets/redeem_giftcard.png";
import gitfcardIcon from "../public/assets/giftcard.png";
import spend from "../public/assets/spend.png";

import Image from "next/image";
import Link from "next/link";
import UtilityHome from "./spend";

export default function Home({}) {
  const [userAddress, setUserAddress] = useState("");
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);

  return (
    <VStack width={"full"} mt={"20px"} gap={"40px"}>
      <UtilityHome />
      <Text>Address: {userAddress}</Text>
    </VStack>
  );
}
