import { HStack, Text, VStack } from "@chakra-ui/react";
import React, { FC, ReactNode, useEffect, useState } from "react";
import whatsapp from "../public/assets/whatsapplogo.png";
import Image from "next/image";
import Link from "next/link";
import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

interface Props {
  children: ReactNode;
}
const WidgetContainer: FC<Props> = ({ children }) => {
  const [hideConnectBtn, setHideConnectBtn] = useState(false);

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      setHideConnectBtn(true);
      connect();
    }
  }, []);

  return (
    <VStack
      w={"full"}
      bg={"#fff"}
      height={"100vh"}
      justifyContent={"flex-start"}
      mt={0}
    >
      <VStack width={"full"} maxW={"500px"} marginX={"auto"}>
        {children}
      </VStack>
      <Link href={"https://wa.me/message/5NRO44DIOIKKH1"} style={{ position: "fixed", bottom: "1%", right: "1%" }}>
        <VStack gap={"0px"}>
          <Text fontSize={"sm"} marginBottom={"-12px"}>Need help?</Text>
        <Image src={whatsapp} width={80} height={80} alt={"Whatsapp Logo"} />
        </VStack>
        
      </Link>
    </VStack>
  );
};

export default WidgetContainer;
