import { Box, HStack, Text, VStack } from "@chakra-ui/react";

type Props = {
  action: any;
  icon: any;
  text: any;
  bg:string;
};
export const UtilityCard = (props: Props) => {
  return (
    <HStack
     height={"58px"}
      padding={"12px 16px"}
      width={"full"}
      cursor={"pointer"}
      bg={props.bg}
      alignSelf={"center"}
      alignItems={"center"}
      borderRadius={"12px"}
      justifyContent={"flex-start"}
      gap={"10px"}
      position={"relative"}
      onClick={props.action}
      color={"#fff"}

    >
     
      <HStack
       width={"28px"}
       height={"28px"}
        justifyContent={"center"}
        fontSize={"28px"}
        alignItems={"center"}
        color={"#fff"}
        fontWeight={"extrabold"}
      >
        {props.icon}
      </HStack>

      <Text fontWeight={"600"}>{props.text}</Text>
    </HStack>
  );
};
