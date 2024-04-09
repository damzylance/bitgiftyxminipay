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
import vodafoneLogo from "../../../public/assets/vodafone_logo.png";

import { ProviderCard } from "../ProviderCard";
import { useUserCountry } from "@/utils/UserCountryContext";
const Data = (props: any) => {
  const telcos = [

    {country:"NG",telcos:[{ name: "mtn", logo: mtnLogo, id: "BIL108" },
    { name: "glo", logo: gloLogo, id: "BIL109" },
    { name: "airtel", logo: airtelLogo, id: "BIL110" },
    { name: "9mobile", logo: nineMobileLogo, id: "BIL111" },]},
    {country:"KE",telcos:[]},
    {country:"GH",telcos:[
      {name:"Vodafone ADSL",logo:vodafoneLogo,id:"BIL139",},
      {name:"SURFLINE",logo:vodafoneLogo,id:"BIL141",}

    ]},
  ];
 
const {userCurrencyTicker,userCountryCode,userCountry} = useUserCountry()
const telcosBycountry = telcos.find(country => country.country === userCountry)

  const [page, setPage] = useState("list");
  const [telco, setTelco] = useState("");
  const [name, setName] = useState("");

  return (
    <>
      {page === "list" && (
        <VStack width={"full"} gap={"40px"} my={"40px"}>
          <Text fontSize={"2xl"}>Plese Select Telco Provider</Text>

          <VStack width={"full"} gap={"10px"}>
            {telcosBycountry && telcosBycountry.telcos && telcosBycountry.telcos.length > 0
              ? telcosBycountry?.telcos.map((provider: any, id) => {
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
              : <Text>Country Not Supported for Data Subscription</Text>}
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
