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
      [ ]
    },
    { country: "KE", cables: 
      [ ]
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
                    <Text fontSize={"24px"} fontWeight={700} >

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
              : <Text>Country not supported for cable subscription</Text>}
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
