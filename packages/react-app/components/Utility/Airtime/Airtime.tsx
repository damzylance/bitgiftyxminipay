import { ArrowBackIcon } from "@chakra-ui/icons";
import { Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import mtnLogo from "../../../public/assets/mtn_logo.png";
import gloLogo from "../../../public/assets/glo_logo.webp";
import airtelLogo from "../../../public/assets/airtel_logo.png";
import nineMobileLogo from "../../../public/assets/9mobile_logo.jpeg";
import Image from "next/image";

import { AirtimeForm } from "./AirtimeForm";
import { ProviderCard } from "../ProviderCard";

type Props = { action: any };

const Airtime = (props: Props) => {
  const telcos = [
    { name: "mtn", logo: mtnLogo, id: "BIL099" },
    { name: "glo", logo: gloLogo, id: "BIL102" },
    { name: "airtel", logo: airtelLogo, id: "BIL100" },
    { name: "9mobile", logo: nineMobileLogo, id: "BIL103" },
  ];

  const [page, setPage] = useState("buy");
  const [telco, setTelco] = useState(null);
  const [networkId, setNetworkID] = useState(null);

  return (
    <>
      {page === "list" && (
        <VStack width={"full"} gap={"40px"} my={"40px"}>
          <Text fontSize={"2xl"} textAlign={"center"}>
            {" "}
            Plese Select Telco Provider
          </Text>
          <VStack width={"full"} gap={"10px"}>
            {telcos.length > 0
              ? telcos.map((provider: any) => {
                  return (
                    <ProviderCard
                      action={() => {
                        setPage("buy");
                        setTelco(provider.name);
                        setNetworkID(provider.id);
                      }}
                      name={provider.name}
                      logo={provider.logo}
                      key={provider.id}
                    />
                  );
                })
              : ""}
          </VStack>
        </VStack>
      )}
      {page === "buy" && (
        <AirtimeForm
          telco={telco}
          onClose={props.action}
          back={() => setPage("list")}
        />
      )}
    </>
  );
};

export default Airtime;
