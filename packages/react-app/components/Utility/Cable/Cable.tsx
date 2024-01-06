import { Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { CableForm } from "./CableForm";
import dstvLogo from "../../../public/assets/dstv.png";
import gotvLogo from "../../../public/assets/gotv.png";
import startimesLogo from "../../../public/assets/startimes.png";
import { ProviderCard } from "../ProviderCard";

const Cable = (props: any) => {
  const [page, setPage] = useState("list");
  const [merchants, setMerchants] = useState([
    { name: "DSTV", logo: dstvLogo, id: "BIL121" },
    { name: "GOTV", logo: gotvLogo, id: "BIL122" },
    { name: "STARTIMES", logo: startimesLogo, id: "BIL123" },
  ]);

  const [merchantName, setMerchantName] = useState(null);
  const [merchantId, setMerchantId] = useState(null);
  return (
    <>
      {page === "list" && (
        <VStack width={"full"} gap={"40px"} my={"40px"}>
          <Text fontSize={"2xl"} textAlign={"center"}>
            {" "}
            Plese Select Cable Provider
          </Text>
          <VStack width={"full"} gap={"10px"}>
            {merchants.length > 0
              ? merchants.map((provider: any, id) => {
                  return (
                    <ProviderCard
                      key={id}
                      action={() => {
                        setPage("buy");
                        setMerchantId(provider.id);
                        setMerchantName(provider.name);
                      }}
                      name={provider.name}
                      logo={provider.logo}
                    />
                  );
                })
              : ""}
          </VStack>
        </VStack>
      )}
      {page === "buy" && (
        <CableForm
          onClose={props.action}
          name={merchantName}
          cable={merchantId}
          back={() => setPage("list")}
        />
      )}
    </>
  );
};

export default Cable;
