import React, { useEffect, useState } from "react";

import {

  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { PayBillForm } from "./PayBillForm";
import mtnLogo from "../../../public/assets/mtn_logo.png";
import gloLogo from "../../../public/assets/glo_logo.webp";
import airtelLogo from "../../../public/assets/airtel_logo.png";
import nineMobileLogo from "../../../public/assets/9mobile_logo.jpeg";
import safaricomLogo from "../../../public/assets/safaricom_logo.png";

import { ProviderCard } from "../ProviderCard";
import { useUserCountry } from "@/utils/UserCountryContext";
const PayBill = (props: any) => {
  const telcos = [

    {country:"NG",telcos:[{ name: "mtn", logo: mtnLogo, id: "BIL108" },
    { name: "glo", logo: gloLogo, id: "BIL109" },
    { name: "airtel", logo: airtelLogo, id: "BIL110" },
    { name: "9mobile", logo: nineMobileLogo, id: "BIL111" },]},
    {country:"KE",telcos:[{ name: "Paybill Number", logo: safaricomLogo, id: "BIL111" }]},
    {country:"GH",telcos:[]},
  ];
 
const {userCurrencyTicker,userCountryCode,userCountry} = useUserCountry()
const telcosBycountry = telcos.find(country => country.country === userCountry)

  const [page, setPage] = useState("buy");
  const [telco, setTelco] = useState("");
  const [name, setName] = useState("");

  return (
    <>
      {page === "list" && (
        <VStack width={"full"} gap={"40px"} my={"40px"}>
                    <Text fontSize={"24px"} fontWeight={700} > Select Telco Provider</Text>

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
              : <Text>Country not supported for data subscription</Text>}
          </VStack>
        </VStack>
      )}
      {page === "buy" && (
        <PayBillForm
          telco={telco}
          onClose={props.action}
          name={"name"}
          back={() => setPage("list")}
        />
      )}
    </>
  );
};

export default PayBill;
