import { useUserCountry } from "@/utils/UserCountryContext";
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
  Select,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount } from "wagmi";
type Inputs = {
  customer: string;
  amount: string;
  email: string;
};

export const PowerForm = (props: any) => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Inputs>();
  const { address, isConnected } = useAccount();
  const walletBalance = useBalance(address, isConnected);
  const { tokenToNairaRate, isLoading } = useFetchRates();
  const {userCurrencyTicker,userCountryCode,userCountry} = useUserCountry()

  const [loading, setLoading] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [nairaAmount, setNairaAmount] = useState(0);
  const [currency, setCurrency] = useState("cusd");
  const [userAddress, setUserAddress] = useState("");
  const [loadingText, setLoadingText] = useState("");
  const [customerDetails,setCustomerDetails] = useState("")
  const fee = parseFloat(process.env.NEXT_PUBLIC_TF as string);
  const minAmount = userCountry==="NG"?500:userCountry==="KE"?50:userCountry==="GH"?5:0

  const rotateMessages = ()=>{
    if(loadingText === "Connecting To Provider..."){
      setTimeout(()=>{
        setLoadingText("Processing Payment...")
      },2000)
      
    }
    
  }

  setInterval(rotateMessages, 1000);


  const handleAmountChange = (e: any) => {
    const tempNairaAmount = parseFloat(e.target.value);
    setNairaAmount(tempNairaAmount);
    setTokenAmount((tempNairaAmount + fee) / tokenToNairaRate);
  };

  const validateMeter = async (e:any)=>{
    setLoadingText("Validating Meter Number...");
    setLoading(true)
    const customer =e.target.value
      const validate = await axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}validate-bill-service/?item-code=${props.item_code}&biller-code=${props.disco}&customer=${customer}`
      )
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      }).finally(()=>{
        setLoading(false)
      });
    console.log(validate);
    if (validate?.data?.data?.response_message === "Successful") {
      console.log(validate.data.data.response_message)
      setCustomerDetails(`${validate.data.data.name}`)
    } else {
      setLoading(false);
      toast({
        title: "Could not verify meter number",
        status: "warning",
      });
    }
    
    
  }

  const buyElectricity = async (data: any) => {
    if (window.ethereum) {
      try {
      setLoading(true);
      const amount = data.amount;
      data.bill_type = "UTILITYBILLS";
      data.biller_code=props.disco;
      data.item_code=props.item_code
      data.country = userCountry;
      data.chain = "cusd";
      data.crypto_amount = tokenAmount;
      data.wallet_address = address;
      console.log(data);

      setLoadingText("Requesting transfer...");

        const response = await transferCUSD(
          userAddress,
          tokenAmount.toString()
        );

        if (response.status===1) {
          data.transaction_hash = response.hash;
          const newDate = new Date()
          data.timestamp= newDate.getTime().toString()
          data.offset = newDate.getTimezoneOffset().toString() 
          setLoadingText("Connecting To Provider...");
          const giftCardResponse: any = await buyAirtime(data); // Call recharge airtime  function
          console.log("electricity", giftCardResponse);

          if (giftCardResponse?.status === 200) {
            // Gift card created successfully
            toast({
              title: "Electricity purchased succesfully. Check email for token ",
              status: "success",
            });
            props.onClose();
          } else {
            console.log(giftCardResponse);
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

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);
  return (
    <VStack my={"40px"} gap={"20px"} width={"full"}>
      <HStack width={"full"} alignItems={"center"}>
        <ArrowBackIcon
          fontSize={"20px"}
          cursor={"pointer"}
          onClick={props.back}
        />
        <HStack width={"full"} justifyContent={"cener"}>
          <Text
            textAlign={"center"}
            fontSize={"2xl"}
            textTransform={"uppercase"}
            width={"full"}
          >
            {props.name}
          </Text>
        </HStack>
      </HStack>
      <form style={{ width: "100%" }} onSubmit={handleSubmit(buyElectricity)}>
        <VStack width={"full"} gap={"20px"}>
          <FormControl>
            <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
              Meter Number
            </FormLabel>

            <Input
              fontSize={"16px"}
              border={"1px solid #f9f9f9"}
              outline={"none"}
              type={"number"}
              required
              {...register("customer",{onBlur:validateMeter})}
            />
            <HStack width={"fulll"} mt={"5px"} justifyContent={"space-between"}>

            <Text fontSize={"xs"} color={"blackAlpha.700"}>
                {customerDetails}
            </Text>
              
              <Text color={"red"} fontSize={"xs"}>
                {errors.customer && errors.customer.message}
              </Text>
              </HStack>
          </FormControl>
          <FormControl>
            <HStack width={"full"} justifyContent={"space-between"}>
              {" "}
              <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
                Amount ({userCurrencyTicker})
              </FormLabel>
              <Text fontSize={"xs"} color={"blackAlpha.700"}>
                Balance({userCurrencyTicker}):{" "}
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
              required
              {...register("amount", {
                onChange: handleAmountChange,
                min: {
                  value: minAmount,
                  message: `Minimum recharge amount is ${minAmount}`,
                },
                max: {
                  value: parseFloat(walletBalance) * tokenToNairaRate,
                  message: "Insufficient balance",
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
                  : tokenAmount.toFixed(3)}{" "}
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
          <FormControl>
            <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
              Email to receive token
            </FormLabel>

            <Input
              border={"1px solid #f9f9f9"}
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
            isDisabled
            type="submit"
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
            Buy Electricity
          </Button>
          
          <HStack fontSize={"sm"} fontWeight={400} color={"#4d4c4c"}> <InfoIcon/> <Text>This may take up to 15 seconds</Text> </HStack>
        </VStack>
      </form>
    </VStack>
  );
};
