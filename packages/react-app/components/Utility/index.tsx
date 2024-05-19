import React, { useEffect, useState } from "react";

import bitgiftyLogo from "../../public/assets/bitgifty-logo.png";


import {
  Container,
  Grid,
  HStack,
  Text,
  VStack,
  useDisclosure,
  Button,
  Box,
  Select,
  Avatar,
  Spinner,
  
} from "@chakra-ui/react";
import {
  MdConnectedTv,
  MdElectricBolt,
  MdPhoneInTalk,
  MdWifiTethering,
} from "react-icons/md";
import { UtilityCard } from "./UtilityCard";
import { UtilityDrawer } from "./UtilityModal";
import { ArrowForwardIcon, ArrowRightIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useAccount } from "wagmi";
import { useBalance } from "@/utils/useBalance";
import { useFetchRates } from "@/utils/useFetchRates";
import Link from "next/link";
import { BrowserProvider, ethers, formatEther } from "ethers";
import { useUserCountry } from "@/utils/UserCountryContext";
import Image from "next/image";
import axios from "axios";
const Utility = () => {
  const {userCountry,setUserCountry,supportedCountries,userCurrencyTicker,setUserCurrencyTicker,setUserCountryCode,cashback,setCashback} = useUserCountry()
  supportedCountries.map(()=>{
    
  })

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [type, setType] = useState("");
  const { address, isConnected } = useAccount();
  const balance = useBalance(address, isConnected);
  const CUSD_ADDRESS = process.env.NEXT_PUBLIC_SC as string;
  const [dollarBalance,setDollarBalance]=useState(balance)
  const [loading,setLoading] = useState(true)
  const [transactions,setTransactions] = useState([])
const handleCountryChange = (e:any)=>{
  let country = e.target.value
  country =country.split(",")
  console.log(country[0])
  setUserCountry(country[0])
  setUserCountryCode(country[1])
  setUserCurrencyTicker(country[2])
  setCashback(country[3])
  localStorage.setItem("userCountry",country)

}

  const fetchBalance = async () => {
    if (isConnected && address) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const abi = [
          "function balanceOf(address account) view returns (uint256)",
        ];

        const contract = new ethers.Contract(CUSD_ADDRESS, abi, provider);
        const cusdBalanceInWei = await contract.balanceOf(address);
        const cusdBalance = formatEther(cusdBalanceInWei.toString());
        const netCusdBalance=((parseFloat(cusdBalance)-0.002).toString())
        setDollarBalance(netCusdBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };
  function shortify(hash: String) {
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(hash.length - 3, hash.length);
    return `${prefix}...${suffix}`;
  }

  function formatDate (date:string){
    const toDate =new Date(date)
    const day = toDate.toLocaleDateString("en-NG")
    .toString()
    .replaceAll("/", "-");
    const time = toDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const formatedDate = `${day} ${time}`
    return formatedDate
  }

  useEffect(() => {
    if (isConnected && address) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}transactions/?wallet_address=${address}&limit=5`
        )
        .then((response) => {
          setLoading(false);
          setTransactions(response.data.results);
          console.log(response);
          // rate = parseFloat(response.data);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
        
      
    } else {
      setLoading(false);
    }
    // fetchRates();
  }, [address, isConnected]);

  useEffect(() => {
    fetchBalance();
  }, [isConnected,address]);
  const { tokenToNairaRate } = useFetchRates();
  return (
    <VStack width={"full"} position={"relative"} gap={"2px"}>
      <VStack background={"#53bfb9"} p={"10px"} width={"full"} borderRadius={"md"}>
        <Text fontSize={"sm"}>
          Get 10% cashback for bill payments over {userCurrencyTicker}{cashback} 
        </Text>
      </VStack>
      <VStack width={"full"} pb={"10px"} gap={"40px"} bg={"#152654"}>
      <VStack
        p={"10px 24px"}
          color={"#fff"}
          width={"full"}
          gap={"10px"}
          
          alignItems={"flex-start"}
          position={"relative"}
        >
        <HStack position={"relative"} width={"full"}> <VStack alignItems={"center"} width={"full"} gap={0}>
          <Image src={bitgiftyLogo} width={85} height={46} alt={"Bitgifty Logo"}/>
          <Text fontSize={"14px"} fontWeight={"500"} mt={"20px"}>
          Pay your bills easily with MiniPay
          </Text>
          </VStack>
         <VStack position={"absolute"} right={"-20px"} top={"2"} >
        <Select zIndex={1}
 size={"xs"} onChange={handleCountryChange}>
        {supportedCountries.filter((country)=>{
            return country.country==userCountry
          }).map((country) => {
  return <option value={[country.country,country.countryCode,country.ticker,country.cashback]} key={country.currency}>{country.country}  {country.flag}</option>;
})}          {supportedCountries.filter((country)=>{
            return country.country!=userCountry
          }).map((country) => {
  return <option value={[country.country,country.countryCode,country.ticker,country.cashback]} key={country.currency}>{country.country}  {country.flag}</option>;
})}
        </Select>
        
        </VStack>
        </HStack>
         

          <HStack
          width={"full"}
            fontWeight={"700"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={"4px"}
            fontSize={"32px"}

          >
            <Text>{userCurrencyTicker}</Text>
            <Text>
              {(
                parseFloat(dollarBalance) * parseFloat(tokenToNairaRate.toString())
              ).toFixed(2)}
            </Text>
          </HStack>
          <HStack
          width={"full"}
            fontWeight={"500"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={"4px"}
            fontSize={"16px"}
          >
            <Text fontStyle={"italic"}>{parseFloat(dollarBalance).toFixed(2)}</Text>
            <Text>cUSD</Text>
          </HStack>
        </VStack>


   <VStack width={"full"} padding={"0 24px"} background={"#152654"}  alignItems={"flex-start"} gap={"24px"} >
     <VStack
        width={"full"}

        borderRadius={"12px"}
        gap={"20px"}
      >
        <UtilityCard
        bg={"linear-gradient(87.57deg, rgba(63, 255, 163, 0.35) 0%, rgba(0, 143, 204, 0.35) 100%)"}
          icon={<MdPhoneInTalk />}
          text={"Buy Airtime"}
          action={() => {
            setType("airtime");
            onOpen();
          }}
        />
        <UtilityCard
        bg={"linear-gradient(272.43deg, rgba(255, 74, 128, 0.35) 0%, rgba(0, 87, 255, 0.35) 100%)"}
          icon={<MdWifiTethering />}
          text={"Buy Data"}
          action={() => {
            setType("data");
            onOpen();
          }}
        />
        <UtilityCard
          bg={"linear-gradient(272.43deg, rgba(255, 184, 0, 0.35) 0%, rgba(255, 74, 128, 0.35) 100%)"}
          icon={<MdElectricBolt />}
          text={"Pay Electricity"}
          action={() => {
            setType("electricity");
            onOpen();
          }}
        />
        <UtilityCard
          bg={"linear-gradient(87.3deg, rgba(186, 102, 255, 0.35) -0.49%, rgba(0, 206, 206, 0.35) 100%)"}
          icon={<MdConnectedTv />}
          text={"Pay Cable"}
          action={() => {
            setType("cable");
            onOpen();
          }}
        />
      </VStack>

   </VStack>
    
   <VStack width={"90%"}  box-shadow = {"0px 2px 8px 0px #0000000F"}  borderRadius={"16px"} background= {"#FFFFFF0D"}padding={"10px"}   alignItems={"center"} gap={"24px"} >
    <Text fontSize={"16px"} color={"#fff"} fontWeight={"600"}>
      History
    </Text>
    <VStack width={"full"} gap={"20px"}>
        {loading ? (
          <Spinner />
        ) : transactions.length > 0 ? (
          transactions.map((transaction: any, id) => {
            let statusColor;
            let statusMessage
            if (transaction.status === "success") {
              statusColor = "#29C087";
              statusMessage ="Success"
            } else if (transaction.status === "pending") {
              statusColor = "#fe8d59";
              statusMessage ="Processing"

            } else if(transaction.status ==="handled") {
              statusColor = "#476621";
              statusMessage ="Success"

            }else{
              statusColor = "#f44336";
              statusMessage = transaction.status
            }
            return (
              <HStack key={id} width={"full"} justifyContent={"space-between"}>
                <HStack gap={"10px"}>
                  <Avatar bg={"#81a0dc"} size={"sm"} icon={<MdPhoneInTalk />} />
                  <VStack gap={"5px"} alignItems={"flex-start"}>
                    <Link
                      href={`https://celoscan.io/tx/${transaction.transaction_hash}`}
                    >
                      {" "}
                      <Text
                        fontSize={"14px"}
                        fontWeight={"500"}
                        color={"#fff"}
                      >
                        {shortify(transaction.transaction_hash)}
                      </Text>
                    </Link>

                    <Text fontSize={"xs"} color={"#fff"} fontWeight={"400"}>
                      {transaction.transaction_type} <br />
                      <span
                        style={{
                          color: statusColor,
                          textTransform: "capitalize",
                        }}
                      >
                        {statusMessage}
                      </span>
                      <br/>
                      <span
                      >
                        {transaction.customer}
                      </span>
                    </Text>
                  </VStack>
                </HStack>
                <VStack gap={"5px"} alignItems={"flex-end"}>
                  <Text fontSize={"14px"} fontWeight={"500"} color={"#fff"}>
                    -&#8358;{transaction.amount}
                  </Text>
                  <Text fontSize={"xs"} fontWeight={"400"} color={"#fff"}>
                    -{parseFloat(transaction.crypto_amount).toFixed(2)} cUSD
                  </Text>
                  
                  <Text fontSize={"xs"} fontWeight={"400"} color={"#FFFFFF80"}>{formatDate(transaction.time)}</Text>
                </VStack>
              </HStack>
            );
          })
        ) : (
          <Text color={"#fff"}>No transactions to display</Text>
        )}
       
      </VStack>
      <Link href={"/transaction-history"} style={{width:"100%"}}>
        <HStack width={"full"} borderRadius={"full"} justifyContent={"center"} bg={"#FFFFFF1A"} padding={"10px"}>
          <Text color={"#fff"} fontWeight={"500"} fontSize={"14px"}>See All</Text>
        </HStack>
        </Link>

   </VStack>
      
</VStack>
       
     

      <UtilityDrawer type={type} isOpen={isOpen} onClose={()=>{
        fetchBalance()
        onClose()
        }} />
    </VStack>
  );
};

export default Utility;
