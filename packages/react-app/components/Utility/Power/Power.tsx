import { Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import axios from "axios";
import { PowerForm } from "./PowerForm";
import powerIcon from "../../../public/assets/idea.png";
import { ProviderCard } from "../ProviderCard";
import { useUserCountry } from "@/utils/UserCountryContext";

const Electricity = (props: any) => {
  const {userCurrencyTicker,userCountryCode,userCountry} = useUserCountry()
  const [page, setPage] = useState("list");
  const [merchants, setMerchants] = useState([{country:"NG",billers:[{ name: "IKEDC  PREPAID", id: "BIL113", item_code: "UB159" },
  { name: "EKEDC PREPAID TOPUP", id: "BIL112", item_code: "UB157" },
  {
    name: "ABUJA DISCO Prepaid",
    id: "BIL204",
    item_code: "UB584",
  },
  {
    name: "IBADAN DISCO ELECTRICITY PREPAID",
    id: "BIL114",
    item_code: "UB161",
  },
  { name: "KANO DISCO PREPAID TOPUP", id: "BIL120", item_code: "UB169" },

  {
    name: "KADUNA DISCO ELECTRICITY BILLS",
    id: "BIL119",
    item_code: "UB602",
  },
  {
    name: "ENUGU DISCO ELECTRIC BILLS PREPAID TOPUP",
    id: "BIL115",
    item_code: "UB163",
  },]},
  {country:"GH",billers:[
    {
      name: "Electricity Company of Ghana",
      id: "BIL142",
      item_code: "UB231",
    }
  ]},
  {country:"KE",billers:[
    {
      name: "KPLC Electricity Prepaid",
      id: "BIL191",
      item_code: "UB501",
    }
  ]},
    
  ]);


  const merchantByCountry = merchants.find(country => country.country === userCountry)

  const [merchantName, setMerchantName] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [itemCode, setItemCode] = useState("");
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}v2/get-bill-info/?biller_code=BIL142`
      )
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
            {" "}
            Plese Select Your Disco
          </Text>
          <VStack width={"full"} gap={"10px"}>
            {merchantByCountry && merchantByCountry?.billers && merchantByCountry.billers.length > 0
              ? merchantByCountry?.billers.map((provider: any, id) => {
                  provider.link = powerIcon;
                  return (
                    <ProviderCard
                      key={id}
                      action={() => {
                        setPage("buy");
                        setMerchantId(provider.id);
                        setMerchantName(provider.name);
                        setItemCode(provider.item_code);
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
          item_code={itemCode}
          back={() => setPage("list")}
        />
      )}
    </>
  );
};

export default Electricity;
