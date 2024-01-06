import { HStack, Text } from "@chakra-ui/react";
import Image from "next/image";

type Props = { action: any; logo: string; name: string };

export const ProviderCard = (props: Props) => {
  return (
    <HStack
      width={"full"}
      padding={"10px"}
      borderRadius={"10px"}
      background={"#fff"}
      _hover={{ background: "#f0f0f0" }}
      cursor={"pointer"}
      gap={"10px"}
      onClick={props.action}
      border={"1px solid #bbcdf1"}
    >
      <Image alt="" width={50} src={props.logo} />
      <Text fontSize={"lg"} textTransform={"uppercase"}>
        {props.name}
      </Text>
    </HStack>
  );
};
