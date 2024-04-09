import { Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { CableForm } from "./CableForm";
import dstvLogo from "../../../public/assets/dstv.png";
import gotvLogo from "../../../public/assets/gotv.png";
import startimesLogo from "../../../public/assets/startimes.png";
import { ProviderCard } from "../ProviderCard";
import axios from "axios";
import { useUserCountry } from "@/utils/UserCountryContext";

const Cable = (props: any) => {
  const { userCurrencyTicker, userCountryCode, userCountry } = useUserCountry();
  const [page, setPage] = useState("list");
  const [merchants, setMerchants] = useState([
    { country: "NG", cables: 
      [ { name: "DSTV", logo: dstvLogo, id: "BIL121" },
        { name: "GOTV", logo: gotvLogo, id: "BIL122" },
        { name: "STARTIMES", logo: startimesLogo, id: "BIL123" }] 
    },
    { country: "GH", cables: 
      [ { name: "DSTV GHANA", logo: dstvLogo, id: "BIL137", itemCode: "CB279" },
        { name: "GOTV GHANA", logo: gotvLogo, id: "BIL138", itemCode: "CB227" }]
    },
    { country: "KE", cables: 
      [ { name: "DSTV KENYA", logo: dstvLogo, id: "BIL190", itemCode: "CB500" },
        { name: "GOTV KENYA", logo: gotvLogo, id: "BIL92", itemCode: "CB503" }, 
        { name: "STARTIME KENYA", logo: startimesLogo, id: "BIL93", itemCode: "CB504" }]
    }
  ]);
  
  const merchantsByCountry = merchants.find(country => country.country === userCountry);
  const [merchantName, setMerchantName] = useState(null);
  const [merchantId, setMerchantId] = useState(null);
  const [itemCode, setItemcode] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}v2/get-bill-info/?biller_code=BIL099`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  return (
    <>
      {page === "list" && (
        <VStack width={"full"} gap={"40px"} my={"40px"}>
          <Text fontSize={"2xl"} textAlign={"center"}>
            Please Select Cable Provider
          </Text>
          <VStack width={"full"} gap={"10px"}>
            {merchantsByCountry && merchantsByCountry.cables && merchantsByCountry.cables.length > 0
              ? merchantsByCountry.cables.map((provider: any, id) => {
                  return (
                    <ProviderCard
                      key={id}
                      action={() => {
                        setPage("buy");
                        setMerchantId(provider.id);
                        setMerchantName(provider.name);
                        setItemcode(provider?.itemCode);
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
          itemCode={itemCode}
          back={() => setPage("list")}
        />
      )}
    </>
  );
};

export default Cable;
