import { HStack, Text } from "@chakra-ui/react";
import Image from "next/image";

type Props = { action: any; logo: string; name: string };

export const ProviderCard = (props: Props) => {
  return (
    <HStack
      width={"full"}
      padding={"10px"}
      borderRadius={"10px"}
      background={"#F0F4FF"}
      _hover={{ background: "#f0f0f0" }}
      cursor={"pointer"}
      gap={"10px"}
      onClick={props.action}
      border={"1px solid #bbcdf1"}
    >
      <Image alt="" width={40} height={40} style={{borderRadius:"8px"}} src={props.logo} />
      <Text fontSize={"sm"} fontWeight={"600"} textTransform={"uppercase"}>
        {props.name}
      </Text>
    </HStack>
  );
};
