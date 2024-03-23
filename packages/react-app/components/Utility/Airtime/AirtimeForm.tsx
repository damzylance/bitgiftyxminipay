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
  const walletBalance = useBalance(address, isConnected);
  const { tokenToNairaRate, isLoading } = useFetchRates();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [nairaAmount, setNairaAmount] = useState();
  const [tokenAmount, setTokenAmount] = useState(0);
  const [currency, setCurrency] = useState("cusd");
  const [minAmount, setMinAmount] = useState("");
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
    try {
      setLoading(true);
      const amount = data.amount;
      data.bill_type = "AIRTIME";
      data.country = "NG";
      data.chain = "cusd";
      data.wallet_address = address;
      data.crypto_amount = tokenAmount;
      setLoadingText("Requesting transfer...");
      const response = await transferCUSD(userAddress, tokenAmount.toString());
      if (response.hash) {
        setLoadingText("Connecting To Provider...");
        data.transaction_hash = response.hash;
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
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected, toast]);
  return (
    <VStack my={"40px"} gap={"20px"} width={"full"}>
      <HStack width={"full"} alignItems={"center"}>
        <ArrowBackIcon
          fontSize={"20px"}
          cursor={"pointer"}
          onClick={props.onClose}
        />
        <HStack width={"full"} justifyContent={"center"}>
          <Text
            textAlign={"center"}
            fontSize={"2xl"}
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
            <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
              Beneficiary Phone Number
            </FormLabel>

            <Input
              border={"1px solid #f9f9f9"}
              outline={"none"}
              fontSize={"16px"}
              type="tel"
              placeholder="080***"
              required
              
              {...register("customer",{minLength:{value:11,message:"Phone number should be 11 digits"},maxLength:{value:11,message:"Phone number should be 11 digits"}})}
              />
              <HStack width={"fulll"} justifyContent={"flex-end"}><Text color={"red"} fontSize={"xs"}>
                  {errors.customer && errors.customer.message}
                </Text></HStack>
          </FormControl>
          <FormControl>
            <HStack width={"full"} justifyContent={"space-between"}>
              {" "}
              <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
                Amount (&#8358;)
              </FormLabel>
              <Text fontSize={"xs"} color={"blackAlpha.700"}>
                Balance(&#8358;):{" "}
                {(
                  parseFloat(walletBalance) *
                  parseFloat(tokenToNairaRate.toString())
                ).toFixed(2)}
              </Text>
            </HStack>

            <Input
              border={"1px solid #f9f9f9"}
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
                  value: 100,
                  message: `Minimum recharge amount is N100`,
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
            // type="submit"
            width={"full"}
            borderRadius={"none"}
            background={
              " linear-gradient(106deg, #103D96 27.69%, #306FE9 102.01%)"
            }
            _hover={{
              background:
                "linear-gradient(106deg, #103D96 27.69%, #306FE9 102.01%)",
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
