import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  HStack,
  Text,
  VStack,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import {
  MdConnectedTv,
  MdElectricBolt,
  MdPhoneInTalk,
  MdWifiTethering,
} from "react-icons/md";
import { UtilityCard } from "./UtilityCard";
import { UtilityModal } from "./UtilityModal";
import Link from "next/link";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useAccount } from "wagmi";
import { useBalance } from "@/utils/useBalance";
import { useFetchRates } from "@/utils/useFetchRates";
const Utility = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [type, setType] = useState("");
  const { address, isConnected } = useAccount();
  const balance = useBalance(address, isConnected);
  const { tokenToNairaRate } = useFetchRates();
  return (
    <Container>
      <HStack
        width={"full"}
        padding={"10px"}
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        color={"#000"}
      >
        <VStack
          color={"#000"}
          width={"full"}
          gap={"5px"}
          alignItems={"flex-start"}
        >
          <HStack
            fontSize={"sm"}
            color={"#747474"}
            fontWeight={600}
            alignItems={"center"}
          >
            <Text>Your Available Balance</Text>
          </HStack>
          <HStack
            fontWeight={"600"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            gap={"4px"}
            fontSize={"xl"}
          >
            <Text>&#8358;</Text>
            <Text>
              {(
                parseFloat(balance) * parseFloat(tokenToNairaRate.toString())
              ).toFixed(2)}
            </Text>
          </HStack>
          <HStack
            fontWeight={"500"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            gap={"4px"}
            fontSize={"sm"}
          >
            <Text>{parseFloat(balance).toFixed(2)}</Text>
            <Text>cUSD</Text>
          </HStack>
        </VStack>
      </HStack>

      <HStack
        fontSize={"sm"}
        fontWeight={600}
        alignItems={"center"}
        width={"full"}
        my={"30px"}
        padding={"10px"}
        justifyContent={"space-between"}
        bg={"rgb(237, 250, 253)"}
      >
        <Text>Transaction History</Text>
        <Link href={"/transaction-history"}>
          <Text
            color={"#fff"}
            padding={"15px 30px"}
            textAlign={"center"}
            bg={
              "linear-gradient(106deg, rgb(16, 61, 150) 27.69%, rgb(48, 111, 233) 102.01%)"
            }
          >
            View All
          </Text>
        </Link>
      </HStack>
      <Grid
        width={"full"}
        templateColumns="repeat(2, 1fr)"
        borderRadius={"12px"}
        gap={"20px"}
        justifyItems={"center"}
        alignItems={"center"}
      >
        <UtilityCard
          icon={<MdPhoneInTalk />}
          text={"Airtime"}
          action={() => {
            setType("airtime");
            onOpen();
          }}
        />
        <UtilityCard
          icon={<MdWifiTethering />}
          text={"Data"}
          action={() => {
            setType("data");
            onOpen();
          }}
        />
        <UtilityCard
          icon={<MdElectricBolt />}
          text={"Electricity"}
          action={() => {
            setType("electricity");
            onOpen();
          }}
        />
        <UtilityCard
          icon={<MdConnectedTv />}
          text={"Cable"}
          action={() => {
            setType("cable");
            onOpen();
          }}
        />
      </Grid>

      <UtilityModal type={type} isOpen={isOpen} onClose={onClose} />
    </Container>
  );
};

export default Utility;
