import { UserCountryProvider, useUserCountry } from "@/utils/UserCountryContext";
import { buyAirtime, transferCUSD } from "@/utils/transaction";
import { useBalance } from "@/utils/useBalance";
import { useFetchRates } from "@/utils/useFetchRates";
import { ArrowBackIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount } from "wagmi";
type Props = {
  onClose: any;
  back: any;
  telco: any;
  itemCode:any;
  billerCode:any;

};
type Inputs = {
  customer: string;
  amount: string;
  email: string;
};

export const AirtimeForm = (props: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const toast = useToast();
  const { address, isConnected } = useAccount();
  const {userCurrencyTicker,userCountryCode,userCountry,cashback} = useUserCountry()
  const walletBalance = useBalance(address, isConnected);
  const { tokenToNairaRate, isLoading } = useFetchRates();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [nairaAmount, setNairaAmount] = useState();
  const [tokenAmount, setTokenAmount] = useState(0);
  const [currency, setCurrency] = useState("cusd");
  type CountrySettings = {
    minAmount: number;
    minPhoneDigits:number;
    maxPhoneDigits: number;
    placeHolder:string
    
};
const settings: { [key: string]: CountrySettings } = {
  NG: { minAmount: 100,minPhoneDigits:10, maxPhoneDigits: 11,placeHolder:"8012345890" },
  KE: { minAmount: 30, minPhoneDigits:10,maxPhoneDigits: 10,placeHolder:"0712345890" },
  GH: { minAmount: 1, minPhoneDigits:9,maxPhoneDigits: 10, placeHolder:"212345678" }
};
const countrySettings = settings[userCountry] || { minAmount: 0, maxPhoneDigits: 0 };

  const [userAddress, setUserAddress] = useState("");
 
  const rotateMessages = ()=>{
    if(loadingText === "Connecting To Provider..."){
      setTimeout(()=>{
        setLoadingText("Processing Payment...")
      },2000)
      
    }
    
  }
  setInterval(rotateMessages, 1000);


  
  const rechargeAirtime = async (data: any) => {
    if (window.ethereum ) {
      try {
        setLoading(true);
        const amount = data.amount;
        data.bill_type = "AIRTIME"
        data.biller_code = props.billerCode
        data.item_code = props.itemCode
        data.country = userCountry;
        data.chain = "cusd";
        data.wallet_address = address;
        data.crypto_amount = tokenAmount;     
        setLoadingText("Requesting transfer...");
        const response = await transferCUSD(userAddress, tokenAmount.toString());
        if (response.status === 1) {
          setLoadingText("Connecting To Provider...");
          data.transaction_hash = response.hash;
          const newDate = new Date()
          data.timestamp= newDate.getTime().toString()
          data.offset = newDate.getTimezoneOffset().toString() 
          console.log(data);
          const giftCardResponse: any = await buyAirtime(data); // Call recharge airtime  function
          console.log(giftCardResponse);
  
          if (giftCardResponse?.status === 200) {
            // Gift card created successfully
            toast({
              title: "Airtime purchased succesfully",
              status: "success",
            });
            props.onClose();
          } else {
            toast({ title: "Error occured ", status: "warning" });
          }
        } else if (response.message.includes("ethers-user-denied")) {
          toast({ title: "User rejected transaction", status: "warning" });
        } else {
          toast({ title: "An error occurred", status: "warning" });
        }
      } catch (error: any) {
        console.log(error);
        toast({ title: error.message, status: "warning" });
      } finally {
        setLoading(false);
        
      }
    }else{
      toast({ title: "You can only perfom transaction from MiniPay", status: "warning" });
    }
   
  };
  const handleAmountChange = (e: any) => {
    const tempNairaAmount = e.target.value;
    setNairaAmount(tempNairaAmount);
    if (currency === "usdt_tron" || currency === "cusd") {
      setTokenAmount(tempNairaAmount / tokenToNairaRate);
    } else {
      setTokenAmount(tokenToNairaRate * tempNairaAmount);
    }
  };

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}v2/get-biller-info/?country=KE&category=AIRTIME`).then((response:any)=>console.log(response)).catch((error:any)=>{
console.log(error)
    })
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected, toast]);
  return (
    <VStack my={"40px"} position={"relative"} gap={"10px"} width={"full"}>
      <Text fontSize={"xs"} textAlign={"center"}>
      🔥Spend over {userCurrencyTicker}{cashback} and get 10% back
        </Text>
      <HStack width={"full"} alignItems={"center"}>
        <HStack width={"full"} justifyContent={"center"}>
          <Text
            fontSize={"24px"}
            fontWeight={"700"}
            textTransform={"uppercase"}
            width={"full"}
          >
            BUY {props.telco} AIRTIME
          </Text>
        </HStack>
      </HStack>

      <form style={{ width: "100%" }} onSubmit={handleSubmit(rechargeAirtime)}>
        <VStack width={"full"} gap={"20px"}>
          <FormControl>
            <FormLabel fontSize={"sm"} color={"#000"}>
              Beneficiary Phone Number
            </FormLabel>

            <InputGroup size={"sm"}>
    <InputLeftAddon>
      {userCountryCode}
          </InputLeftAddon>
             <Input
              border={"1px solid #f9f9f9"}
              outline={"none"}
              fontSize={"16px"}
              type="tel"
              placeholder={countrySettings.placeHolder}
              required
              
              {...register("customer",{minLength:{value:countrySettings.minPhoneDigits,message:"The mobile must be 10 digits"},maxLength:{value:countrySettings.maxPhoneDigits,message:"The mobile must be 10 digits"}})}
              />
          </InputGroup>
              <HStack width={"fulll"} justifyContent={"flex-end"}><Text color={"red"} fontSize={"xs"}>
                  {errors.customer && errors.customer.message}
                </Text></HStack>
          </FormControl>
          <FormControl>
            <HStack width={"full"} justifyContent={"space-between"}>
              {" "}
              <FormLabel fontSize={"sm"} color={"#000"}>
                Amount {`(${userCurrencyTicker})`}
              </FormLabel>
              <Text fontSize={"xs"} color={"#000"}>
                Balance ({userCurrencyTicker}):{" "}
                {(
                  parseFloat(walletBalance) *
                  parseFloat(tokenToNairaRate.toString())
                ).toFixed(2)}
              </Text>
            </HStack>
           
            <Input
              border={"1px solid #506DBB"}
              outline={"none"}
              fontSize={"16px"}
              type="number"
              placeholder="100"
              required
              {...register("amount", {
                onChange: handleAmountChange,

                max: {
                  value: parseFloat(walletBalance) * tokenToNairaRate,
                  message: "Insufficient balance",
                },
                min: {
                  value: countrySettings.minAmount,
                  message: `Minimum recharge amount is ${countrySettings.minAmount}`,
                },
              })}
            />
            <HStack
              width={"full"}
              alignItems={"center"}
              justifyContent={"space-between"}
              mt={"5px"}
            >
              <Text fontSize={"xs"} textAlign={"right"}>
                ≈{" "}
                {currency === "btc"
                  ? tokenAmount.toFixed(6)
                  : tokenAmount.toFixed(4)}{" "}
                {currency}
              </Text>
              <Text color={"red"} fontSize={"xx-small"}>
                {errors.amount && errors.amount.message}
              </Text>
            </HStack>

            <FormErrorMessage>
              {errors.amount && errors.amount.message}
            </FormErrorMessage>
          </FormControl>
          
          <Button
            isLoading={loading || isLoading}
            loadingText={loadingText}
            type="submit"
            size={"lg"}
            width={"full"}
            borderRadius={"full"}
            background={"#152654"}
            _hover={{
              background:
                "#152654",
            }}
            variant={"solid"}
          >
            Buy Airtime
          </Button>
          <HStack fontSize={"sm"} fontWeight={400} color={"#4d4c4c"}> <InfoIcon/> <Text>This may take up to 15 seconds</Text> </HStack>

        </VStack>
      </form>
    </VStack>
  );
};
