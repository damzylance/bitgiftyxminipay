import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ArrowBackIcon, InfoIcon } from "@chakra-ui/icons";
import { set, useForm } from "react-hook-form";
import axios from "axios";
import { useAccount } from "wagmi";
import { useBalance } from "@/utils/useBalance";
import { useFetchRates } from "@/utils/useFetchRates";
import { buyAirtime, transferCUSD } from "@/utils/transaction";

type Inputs = {
  customer: string;
  plan: string;
  amount: string;
  email: string;
};
export const CableForm = (props: any) => {
  const toast = useToast();
  const { address, isConnected } = useAccount();
  const walletBalance = useBalance(address, isConnected);
  const { tokenToNairaRate, isLoading } = useFetchRates();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Inputs>();
  const [loading, setLoading] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [plans, setPlans] = useState([]);
  const [loadingText, setLoadingText] = useState("");

  const [tokenAmount, setTokenAmount] = useState(0);
  const [nairaAmount, setNairaAmount] = useState(0);
  const [currency, setCurrency] = useState("");
  const fee = parseFloat(process.env.NEXT_PUBLIC_TF as string);
  const [customerDetails,setCustomerDetails] = useState("")
  const [itemCode,setItemCode] = useState("")

  const rotateMessages = ()=>{
    if(loadingText === "Connecting To Provider..."){
      setTimeout(()=>{
        setLoadingText("Processing Payment...")
      },2000)
      
    }
    
  }

  setInterval(rotateMessages, 1000);

  const handlePlanChange = (e: any) => {
    const tempNairaAmount = parseInt(e.target.value.split(",")[1]);
    setItemCode(e.target.value.split(",")[2])
    setNairaAmount(tempNairaAmount);
    setTokenAmount((tempNairaAmount + fee) / tokenToNairaRate);
  };

  const fetchDataPlans = async () => {
    setLoading(true);
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}get-bill-categories/?bill-type=cable`
      )
      .then((response) => {
        console.log(response);
        setPlans(
          response.data.data.filter((plan: any) => {
            return plan.biller_code === props.cable;
          })
        );
        setLoading(false);
      })
      .catch((error) => {
        toast({
          title: error.response.data.error,
          status: "warning",
        });
      });
  };
  const validateMeter = async (e:any)=>{
    setLoadingText("Validating Smart Card Number...");
    setLoading(true)
    const customer =e.target.value
    if(customer.length===10){
      const validate = await axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}validate-bill-service/?item-code=${itemCode}&biller-code=${props.disco}&customer=${customer}`
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
      setCustomerDetails("")
      toast({
        title: "Could not validate Smart Card Number",
        status: "warning",
      });
    }
    }else{
      setLoading(false)
      setCustomerDetails("")
    }
    
  }

  const buyCable = async (data: any) => {
    if (
      parseInt(data.plan.split(",")[1]) <
      parseFloat(walletBalance) * tokenToNairaRate
    ) {
      try {
        setLoading(true);
        data.country = "NG";
        data.bill_type = data.plan.split(",")[0];
        data.amount = data.plan.split(",")[1];
        delete data.plan;
        data.country = "NG";
        data.chain = "cusd";
        data.wallet_address = address;
        data.crypto_amount = tokenAmount;

        console.log(data);
        setLoadingText("Requesting transfer...");
          const response = await transferCUSD(
            userAddress,
            tokenAmount.toString()
          );

          if (response.hash) {
            data.transaction_hash = response.hash;
            setLoadingText("Connecting to cable provider");
            const giftCardResponse: any = await buyAirtime(data); // Call recharge airtime  function
            setLoadingText("processing payment")
            console.log(giftCardResponse);

            if (giftCardResponse?.status === 200) {
              // Gift card created successfully
              toast({
                title: "Cable subscription successful",
                status: "success",
              });
              props.onClose();
            } else {
              toast({ title: "Error occured ", status: "warning" });
            }
          } else if (response.message.includes("ethers-user-denied")) {
            toast({
              title: "User rejected transaction",
              status: "warning",
            });
          } else {
            toast({ title: "An error occurred", status: "warning" });
          }
       
      } catch (error: any) {
        console.log(error);
        toast({ title: error.message, status: "warning" });
      } finally {
        setLoading(false);
      }
    } else {
      console.log(parseFloat(walletBalance) * tokenToNairaRate);
      toast({ title: "insufficient balance ", status: "warning" });
    }
  };
  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
    fetchDataPlans();
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
            Subscribe For {props.name}
          </Text>
        </HStack>
      </HStack>
      <form style={{ width: "100%" }} onSubmit={handleSubmit(buyCable)}>
        <VStack width={"full"} gap={"20px"}>
          <FormControl>
            <HStack
              alignItems={"center"}
              width={"full"}
              justifyContent={"space-between"}
            >
              {" "}
              <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
                Select Cable Plan (&#8358;)
              </FormLabel>
              <Text fontSize={"xs"} color={"blackAlpha.700"}>
                Balance(&#8358;):{" "}
                {(
                  parseFloat(walletBalance) *
                  parseFloat(tokenToNairaRate.toString())
                ).toFixed(2)}
              </Text>
            </HStack>
            <Select
              fontSize={"16px"}
              {...register("plan", { onChange: handlePlanChange })}
              required
            >
             <option>Select Plan</option>
              {plans.map((plan: any, index) => {
                return (
                  <option
                    value={[plan.biller_name, plan.amount, plan.item_code]}
                    key={index}
                  >
                    {plan.biller_name} {plan.validity} (N{plan.amount})
                  </option>
                );
              })}
            </Select>
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
                  : tokenAmount.toFixed(3)}
                {" cUSD"}
              </Text>
              <Text color={"red"} fontSize={"xx-small"}>
                {errors.amount && errors.amount.message}
              </Text>
            </HStack>
          </FormControl>
          
          <FormControl>
            <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
              Smart Card Number
            </FormLabel>

            <Input
              fontSize={"16px"}
              border={"1px solid #f9f9f9"}
              outline={"none"}
              required
              {...register("customer",{onChange:validateMeter,minLength:{value:10,message:"Smart card number should be 10 digits"},maxLength:{value:10,message:"Smart card number should be 10 digits"}})}
            />
            <HStack width={"fulll"} mt={"5px"} justifyContent={"space-between"}>
              <Text fontSize={"xs"} color={"blackAlpha.700"}>
                {customerDetails}
              </Text>
              <Text color={"red"} fontSize={"xs"}>
                {errors.customer && errors.customer.message}
              </Text></HStack>
          </FormControl>
          <FormControl>
            <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
              Email
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
          </FormControl>

          <Button
            isLoading={loading || isLoading}
            loadingText={loadingText}
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
            Subscribe
          </Button>
          <HStack fontSize={"sm"} fontWeight={400} color={"#4d4c4c"}> <InfoIcon/> <Text>This may take up to 15 seconds</Text> </HStack>

        </VStack>
      </form>
    </VStack>
  );
};
