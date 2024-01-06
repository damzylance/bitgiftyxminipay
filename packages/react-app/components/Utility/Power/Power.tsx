import { Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import axios from "axios";
import { PowerForm } from "./PowerForm";
import powerIcon from "../../../public/assets/idea.png";
import { ProviderCard } from "../ProviderCard";

const Electricity = (props: any) => {
  const [page, setPage] = useState("list");
  const [merchants, setMerchants] = useState([
    { name: "IKEDC  PREPAID", id: "BIL113" },
    { name: "EKEDC PREPAID TOPUP", id: "BIL112" },
    {
      name: "ABUJA DISCO Prepaid",
      id: "BIL204",
    },
    {
      name: "IBADAN DISCO ELECTRICITY PREPAID",
      id: "BIL114",
    },
    { name: "KANO DISCO PREPAID TOPUP", id: "BIL120" },

    {
      name: "KADUNA PREPAID",
      id: "BIL119",
    },
  ]);

  const [merchantName, setMerchantName] = useState("");
  const [merchantId, setMerchantId] = useState("");
  return (
    <>
      {page === "list" && (
        <VStack width={"full"} gap={"40px"} my={"40px"}>
          <Text fontSize={"2xl"} textAlign={"center"}>
            {" "}
            Plese Select Your Disco
          </Text>
          <VStack width={"full"} gap={"10px"}>
            {merchants.length > 0
              ? merchants.map((provider: any, id) => {
                  provider.link = powerIcon;
                  return (
                    <ProviderCard
                      key={id}
                      action={() => {
                        setPage("buy");
                        setMerchantId(provider.id);
                        setMerchantName(provider.name);
                      }}
                      name={provider.name}
                      logo={provider.link}
                    />
                  );
                })
              : ""}
          </VStack>
        </VStack>
      )}
      {page === "buy" && (
        <PowerForm
          onClose={props.action}
          name={merchantName}
          disco={merchantId}
          back={() => setPage("list")}
        />
      )}
    </>
  );
};

export default Electricity;
