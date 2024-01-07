import { buyAirtime, transferCUSD } from "@/utils/transaction";
import { useBalance } from "@/utils/useBalance";
import { useFetchRates } from "@/utils/useFetchRates";
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
  const walletBalance = useBalance(address, isConnected);
  const { tokenToNairaRate, isLoading } = useFetchRates();

  const [loading, setLoading] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [nairaAmount, setNairaAmount] = useState(0);
  const [currency, setCurrency] = useState("cusd");
  const [userAddress, setUserAddress] = useState("");
  const fee = parseFloat(process.env.NEXT_PUBLIC_TF as string);

  const handleAmountChange = (e: any) => {
    const tempNairaAmount = parseFloat(e.target.value);
    setNairaAmount(tempNairaAmount);
    setTokenAmount((tempNairaAmount + fee) / tokenToNairaRate);
  };

  const buyElectricity = async (data: any) => {
    try {
      setLoading(true);
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
      setLoading(false);
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
              type="tel"
              required
              {...register("customer")}
            />
          </FormControl>
          <FormControl>
            <HStack width={"full"} justifyContent={"space-between"}>
              {" "}
              <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
                Amount (&#8358;)
              </FormLabel>
              <Text fontSize={"xs"} color={"blackAlpha.700"}>
                Balance(cUSD) : {walletBalance}
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
                  value: 1000,
                  message: `Minimum recharge amount is N1000`,
                },
                max: {
                  value: parseFloat(walletBalance) / tokenToNairaRate,
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
            isLoading={loading || isLoading}
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
