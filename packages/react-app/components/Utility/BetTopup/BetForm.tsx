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
import { ArrowBackIcon, CloseIcon, InfoIcon, WarningIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { buyAirtime, transferCUSD } from "@/utils/transaction";
import { useBalance } from "@/utils/useBalance";
import { useFetchRates } from "@/utils/useFetchRates";
import { useUserCountry } from "@/utils/UserCountryContext";
type Inputs = {
  account_number: string;
  short_code: string;
  amount: string;
  type: string;
  email: string;
};

export const BetForm = (props: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Inputs>();
  type CountrySettings = {
    minAmount: number;
    minPhoneDigits:number;
    maxPhoneDigits: number;
    placeHolder:string
    
  };
  const settings: { [key: string]: CountrySettings } = {
    KE: { minAmount: 10, minPhoneDigits:10,maxPhoneDigits: 10,placeHolder:"10" },
  };
  const toast = useToast();
  const { address, isConnected } = useAccount();
  const walletBalance = useBalance(address, isConnected);
  const { tokenToNairaRate, isLoading } = useFetchRates();
  const {userCurrencyTicker,cashback,userCountry} = useUserCountry()
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);
  const [nairaAmount, setNairaAmount] = useState(0);
  const [feeInToken,setFeeInToken] = useState(0)
  const [currency, setCurrency] = useState("cusd");
  const [networkId, setNetworkId] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [betProviders,setBetProviders] = useState([
    {
        "name": "1XBET",
        "paybill": 290011
    },
    {
        "name": "BETIKA",
        "paybill": 290290
    },
    {
        "name": "BETNARE",
        "paybill": 4087777
    },
    {
        "name": "MOZZARTBET KENYA",
        "paybill": 290059
    },
    {
        "name": "GAMEMANIA",
        "paybill": 290077
    },
    {
        "name": "PEPETABETS",
        "paybill": 779900
    },
    {
        "name": "GAMING INTERNATIONAL LIMITED",
        "paybill": 290020
    },
    {
        "name": "KESSGAME",
        "paybill": 565619
    },
    {
        "name": "ODIBETS",
        "paybill": 290680
    },
    {
        "name": "BANGBET",
        "paybill": 999880
    },
    {
        "name": "NUNTIS HOLDINGS LIMITED",
        "paybill": 7325515
    },
    {
        "name": "KAYA GAME LIMITED",
        "paybill": 783227
    },
    {
        "name": "KILIBET",
        "paybill": 663661
    },
    {
        "name": "LIGIBET",
        "paybill": 299690
    },
    {
        "name": "BETLION",
        "paybill": 212927
    },
    {
        "name": "PLAYMASTER",
        "paybill": 141114
    },
    {
        "name": "KWIKBET",
        "paybill": 290028
    }
])
  const [betProvider,setBetProvider] = useState(betProviders[0].name)
  const countrySettings = settings[userCountry] || { minAmount: 0, maxPhoneDigits: 0 };
  const rotateMessages = ()=>{
    if(loadingText === "Connecting To Provider..."){
      setTimeout(()=>{
        setLoadingText("Processing Payment...")
      },2000)
      
    }
    
  }

  setInterval(rotateMessages, 1000);

  const updateBetProviders =  async() =>{
    setLoading(true)
    axios.get("https://pretium.africa/api/flagged-paybills?betting").then((response)=>{
      console.log(response)
      setBetProviders(response.data.paybills)
    }).catch((error)=>{
      toast({title:"Error fetching blacklisted vendors"})
    }).finally(()=>{
      setLoading(false)
    })
  }
 
  const handleProviderChange = (e:any) =>{
    const provider = e.target.value.split(",")[1]
    console.log(provider)
    setBetProvider(provider)

  }
  const handleAmountChange = (e: any) => {
    const tempNairaAmount = e.target.value;
    setNairaAmount(tempNairaAmount);
    if (currency === "usdt_tron" || currency === "cusd") {
      const tempTokenAmount = tempNairaAmount / tokenToNairaRate
      setFeeInToken(tempTokenAmount*0.05)
      setTokenAmount(tempNairaAmount / tokenToNairaRate);
    } else {
      setTokenAmount(tokenToNairaRate * tempNairaAmount);
    }
  };
  const payBill = async (data: any) => {
    const short_code =  data.short_code.split(",")[0]
      data.short_code = short_code
      if (window.ethereum) {
        try {
          setLoading(true);
          data.bill_type="PAYBILL"
          data.country = userCountry;
          data.chain = "cusd";
          data.wallet_address = address;
          data.crypto_amount = tokenAmount+feeInToken;
          data.customer=data.short_code

          if(data.account_number ===""){
            delete data.account_number
          }else{
            data.customer = `${data.short_code}/${data.account_number}`
          }
  
          console.log(data);
          

         
            setLoadingText("Requesting transfer...");
          const response = await transferCUSD(
            userAddress,
            data.crypto_amount.toString()
          );
  
          if (response.status===1) {
            data.transaction_hash = response.hash;
            const newDate = new Date()
            data.timestamp= newDate.getTime().toString()
          data.offset = newDate.getTimezoneOffset().toString() 
            setLoadingText("Connecting to provider");
            const giftCardResponse: any = await buyAirtime(data); // Call recharge airtime  functions
            console.log(giftCardResponse);
  
            if (giftCardResponse?.status === 200) {
              // Gift card created successfully
              toast({
                title: "Payment successful. Processing disbursement..",
                status: "success",
              });
              props.onClose();
            } else {
              toast({ title: "Error occured ", status: "warning" });
              props.onClose();

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

     
    

    // data.token_amount = data.data.split(",")[1];
    // delete data.network;
    // delete data.data;
  };

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
    updateBetProviders()
    
  }, [address, isConnected]);

  return (
    <VStack my={"20px"} gap={"10px"} width={"full"}>
      <Text fontSize={"xs"} textAlign={"center"}>
      🔥Spend over {userCurrencyTicker}{cashback} and get 10% back

        </Text>
      <HStack width={"full"} alignItems={"center"}>
        <HStack width={"full"} justifyContent={"cener"}>
          <Text
            fontSize={"24px"}
            fontWeight={"700"}
            textTransform={"uppercase"}
            width={"full"}
          >
            M-pesa Bet Topup
          </Text>
        </HStack>
      </HStack>
      <HStack fontSize={"sm"} fontWeight={400} color={"#8B4000"}> <WarningIcon/> <Text fontSize={"xs"}> Verify details carefully. Transactions sent to wrong details are non-refundable</Text> </HStack>


      <form style={{ width: "100%" }} onSubmit={handleSubmit(payBill)}>
        <VStack width={"full"} gap={"10px"}>
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
              placeholder={countrySettings.placeHolder}
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
                {tokenAmount.toFixed(4)}{" "}
                {currency}
                <br/>
                
              </Text>
              <Text color={"red"} fontSize={"xx-small"}>
                {errors.amount && errors.amount.message}
              </Text>
            </HStack>
            <HStack
              width={"full"}
              alignItems={"center"}
              justifyContent={"space-between"}
              mt={"5px"}
            >
              <Text fontSize={"xs"} textAlign={"right"}>
              Fee
                
              </Text>
              <Text  fontSize={"xs"}>
               ≈ {(tokenAmount*0.05).toFixed(4)}
              </Text>
            </HStack>
            <FormErrorMessage>
              {errors.amount && errors.amount.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel fontSize={"sm"} color={"#000"}>
              Bet Provider
            </FormLabel>
            <Select
              fontSize={"16px"}
              border={"1px solid #506DBB"}
              {...register("short_code", { onChange: handleProviderChange })}
              required
            >
             {
              betProviders.map((provider:any)=>{
                return <option value={[provider.paybill,provider.name]}>
                  {provider.name}
                  </option>
              })
             }
            </Select>
            <HStack width={"fulll"} justifyContent={"flex-end"}><Text color={"red"} fontSize={"xs"}>
                {errors.short_code && errors.short_code.message}
              </Text></HStack>
          </FormControl>
          <FormControl>
            <FormLabel fontSize={"sm"} color={"#000"}>
              Account Number
            </FormLabel>

            <Input
              fontSize={"16px"}
              border={"1px solid #506DBB"}
              outline={"none"}
              required
              placeholder={`Your ${betProvider} account number`}
              {...register("account_number")}
            />
            <HStack width={"fulll"} justifyContent={"flex-end"}><Text color={"red"} fontSize={"xs"}>
                {errors.account_number && errors.account_number.message}
              </Text></HStack>
          </FormControl>

          <FormControl>
            <FormLabel fontSize={"sm"} color={"#000"}>
              Email to receive receipt
            </FormLabel>

            <Input
              border={"1px solid #506DBB"}
              outline={"none"}
              placeholder="Email address"
              fontSize={"16px"}
              type="email"
              required
              {...register("email")}
            />
            <FormErrorMessage></FormErrorMessage>
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
            Top up
          </Button>
          <HStack fontSize={"sm"} fontWeight={400} color={"#4d4c4c"}> <InfoIcon/> <Text>This may take up to 15 seconds</Text> </HStack>

        </VStack>
      </form>
    </VStack>
  );
};
