import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  HStack,
  Text,
  VStack,
  useDisclosure,
  Button,
  Box,
  
} from "@chakra-ui/react";
import {
  MdConnectedTv,
  MdElectricBolt,
  MdPhoneInTalk,
  MdWifiTethering,
} from "react-icons/md";
import { UtilityCard } from "./UtilityCard";
import { UtilityModal } from "./UtilityModal";
import { ArrowForwardIcon, ArrowRightIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useAccount } from "wagmi";
import { useBalance } from "@/utils/useBalance";
import { useFetchRates } from "@/utils/useFetchRates";
import Link from "next/link";
const Utility = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [type, setType] = useState("");
  const { address, isConnected } = useAccount();
  const balance = useBalance(address, isConnected);
  const { tokenToNairaRate } = useFetchRates();
  return (
    <VStack width={"full"} position={"relative"}>
      
        <VStack
        height={"232px"}
        p={"30px 24px"}
          color={"#fff"}
          width={"full"}
          gap={"10px"}
          bg={"#103D96"}
          alignItems={"flex-start"}
          position={"relative"}
        >
          <Box position={"absolute"}  left={0} top={0}>
          <svg xmlns="http://www.w3.org/2000/svg" width="190" height="137" viewBox="0 0 190 137" fill="none">
<g filter="url(#filter0_b_1429_622)">
<path d="M45.6035 15.7431C-49.3161 23.5761 -112.52 136.99 -112.52 136.99L-129 -62.711L189.57 -89C189.57 -89 140.523 7.91019 45.6035 15.7431Z" fill="white" fillOpacity="0.05"/>
</g>
<defs>
<filter id="filter0_b_1429_622" x="-133" y="-93" width="326.57" height="233.99" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feGaussianBlur in="BackgroundImageFix" stdDeviation="2"/>
<feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_1429_622"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_1429_622" result="shape"/>
</filter>
</defs>
</svg>
          </Box>
          <Box position={"absolute"}  right={0}  >
          <svg xmlns="http://www.w3.org/2000/svg" width="257" height="232" viewBox="0 0 257 232" fill="none">
  <g filter="url(#filter0_b_1429_621)">
    <path d="M138.701 125.393C233.231 113.774 290.256 -15.0726 290.256 -15.0726L317.67 207.964L0.405004 246.961C0.405004 246.961 44.1697 137.012 138.701 125.393Z" fill="white" fillOpacity="0.05"/>
  </g>
  <defs>
    <filter id="filter0_b_1429_621" x="-3.59497" y="-19.0728" width="325.266" height="270.033" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feGaussianBlur in="BackgroundImageFix" stdDeviation="2"/>
      <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_1429_621"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_1429_621" result="shape"/>
    </filter>
  </defs>
</svg>
          </Box>
          <Box position={"absolute"}  right={0}  bottom={0} >
          <svg xmlns="http://www.w3.org/2000/svg" width="360" height="93" viewBox="0 0 360 93" fill="none">
  <g filter="url(#filter0_b_1429_619)">
    <path d="M166.234 50.0466C280.351 50.0466 367 0 367 0V93H-16C-16 93 52.1175 50.0466 166.234 50.0466Z" fill="white" fillOpacity="0.05"/>
  </g>
  <defs>
    <filter id="filter0_b_1429_619" x="-20" y="-4" width="391" height="101" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feGaussianBlur in="BackgroundImageFix" stdDeviation="2"/>
      <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_1429_619"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_1429_619" result="shape"/>
    </filter>
  </defs>
</svg>
          </Box>
          <HStack
            fontSize={"sm"}
            fontWeight={600}
            alignItems={"center"}
            justifyContent={"space-between"}
            width={"full"}
            zIndex={1}
          >
            <Text color={"#d8d8d8"} fontSize={"14px"} fontWeight={"400"}>Available Balance</Text>
            <Link  href ={"/transaction-history"}><HStack alignItems={"center"} color={"#d8d8d8"} fontSize={"14px"} fontWeight={"400"}>
            <Text>History</Text>
            <ArrowForwardIcon fontSize={"14px"}/>
            </HStack></Link>
            
            
          </HStack>
          <HStack
            fontWeight={"600"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            gap={"4px"}
            fontSize={"32px"}

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
            fontSize={"16px"}
          >
            <Text>{parseFloat(balance).toFixed(2)}</Text>
            <Text>cUSD</Text>
          </HStack>
        </VStack>


   <VStack position={"relative"} zIndex={"0"} width={"full"} padding={"24px"} bg={"#fff"} alignItems={"flex-start"} gap={"24px"} borderTopRadius={"32px"} mt={"-34px"}>
    <Text color={"#1C201F"} fontSize={"20px"} fontWeight={"600"}>Utilities</Text>
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
   </VStack>
     

      <UtilityModal type={type} isOpen={isOpen} onClose={onClose} />
    </VStack>
  );
};

export default Utility;
