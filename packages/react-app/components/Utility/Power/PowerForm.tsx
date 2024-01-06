import { buyAirtime, transferCUSD } from "@/utils/transaction";
import { ArrowBackIcon } from "@chakra-ui/icons";
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
  console.log(props.disco);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Inputs>();
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [nairaAmount, setNairaAmount] = useState(0);
  const [tokenToNairaRate, setTokenToNairaRate] = useState(1100);
  const [currency, setCurrency] = useState("cusd");
  const [userAddress, setUserAddress] = useState("");

  const handlePlanChange = (e: any) => {
    const nairaAmount = parseInt(e.target.value.split(",")[1]);
    setNairaAmount(parseInt(e.target.value.split(",")[1]));
    setTokenAmount(tokenToNairaRate * nairaAmount);
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

  const buyElectricity = async (data: any) => {
    try {
      setIsLoading(true);
      const amount = data.amount;
      data.bill_type = props.name;
      data.country = "NG";
      data.chain = "cusd";
      data.crypto_amount = tokenAmount;
      data.wallet_address = address;
      console.log(data);

      const response = await transferCUSD(userAddress, tokenAmount.toString());

      if (response.hash) {
        data.transaction_hash = response.hash;
        const giftCardResponse: any = await buyAirtime(data); // Call recharge airtime  function
        console.log("electricity", giftCardResponse);

        if (giftCardResponse?.status === 200) {
          // Gift card created successfully
          toast({
            title: "Airtime purchased succesfully",
            status: "success",
          });
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
      setIsLoading(false);
    }
  };

  const fetchRates = async () => {
    setIsLoading(true);
    await axios
      .get(`${process.env.NEXT_PUBLIC_UTIL_BASE_URL}swap/get-dollar-price`)
      .then((response) => {
        console.log(response);
        setTokenToNairaRate(parseFloat(response.data));
        setIsLoading(false);
        // rate = parseFloat(response.data);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        toast({
          title: error.response.data.error,
          status: "warning",
        });
      });
  };

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
      fetchRates();
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
            <FormLabel>Select Meter Type</FormLabel>
            <Select fontSize={"16px"} disabled>
              <option value={"prepaid"}>Prepaid</option>
              <option value={"postpaid"}>Postpaid</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
              Meter Number
            </FormLabel>

            <Input
              fontSize={"16px"}
              border={"1px solid #f9f9f9"}
              outline={"none"}
              type="tel"
              required
              {...register("customer")}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
              Amount (₦)
            </FormLabel>

            <Input
              border={"1px solid #f9f9f9"}
              outline={"none"}
              fontSize={"16px"}
              type="number"
              min={50}
              required
              {...register("amount", {
                onChange: handleAmountChange,
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
            <FormErrorMessage></FormErrorMessage>
          </FormControl>

          <Button
            isLoading={isLoading}
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
            Pay
          </Button>
        </VStack>
      </form>
    </VStack>
  );
};
