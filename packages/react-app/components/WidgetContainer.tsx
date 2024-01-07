import { HStack, Text, VStack } from "@chakra-ui/react";
import React, { FC, ReactNode, useEffect, useState } from "react";
import logo from "../public/assets/logo-inline-transparent.png";
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
    >
      <VStack py={"4px"} width={"full"} maxW={"500px"} marginX={"auto"}>
        {children}
      </VStack>
    </VStack>
  );
};

export default WidgetContainer;
