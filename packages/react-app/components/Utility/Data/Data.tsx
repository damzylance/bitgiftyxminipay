import React, { useEffect, useState } from "react";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { DataForm } from "./DataForm";
import mtnLogo from "../../../public/assets/mtn_logo.png";
import gloLogo from "../../../public/assets/glo_logo.webp";
import airtelLogo from "../../../public/assets/airtel_logo.png";
import nineMobileLogo from "../../../public/assets/9mobile_logo.jpeg";
import { ProviderCard } from "../ProviderCard";
const Data = (props: any) => {
  const telcos = [
    { name: "mtn", logo: mtnLogo, id: "BIL108" },
    { name: "glo", logo: gloLogo, id: "BIL109" },
    { name: "airtel", logo: airtelLogo, id: "BIL110" },
    { name: "9mobile", logo: nineMobileLogo, id: "BIL111" },
  ];

  const [page, setPage] = useState("list");
  const [telco, setTelco] = useState("");
  const [name, setName] = useState("");

  return (
    <>
      {page === "list" && (
        <VStack width={"full"} gap={"40px"} my={"40px"}>
          <Text fontSize={"2xl"}>Plese Select Telco Provider</Text>

          <VStack width={"full"} gap={"10px"}>
            {telcos.length > 0
              ? telcos.map((provider: any, id) => {
                  return (
                    <ProviderCard
                      key={id}
                      action={() => {
                        setPage("buy");
                        setTelco(provider.id);
                        setName(provider.name);
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
        <DataForm
          telco={telco}
          onClose={props.action}
          name={name}
          back={() => setPage("list")}
        />
      )}
    </>
  );
};

export default Data;
