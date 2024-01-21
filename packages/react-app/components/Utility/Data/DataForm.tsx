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
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { buyAirtime, transferCUSD } from "@/utils/transaction";
import { useBalance } from "@/utils/useBalance";
import { useFetchRates } from "@/utils/useFetchRates";
type Inputs = {
  customer: string;
  amount: string;
  type: string;
  email: string;
};

type Plan = { biller_name: string; amount: string };
export const DataForm = (props: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Inputs>();
  const toast = useToast();
  const { address, isConnected } = useAccount();
  const walletBalance = useBalance(address, isConnected);
  const { tokenToNairaRate, isLoading } = useFetchRates();

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);
  const [nairaAmount, setNairaAmount] = useState(0);
  const [currency, setCurrency] = useState("cUSD");
  const [plans, setPlans] = useState([]);
  const [networkId, setNetworkId] = useState([]);
  const [userAddress, setUserAddress] = useState("");

  const fetchPlans = async () => {
    setLoading(true);
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}get-bill-categories/?bill-type=data_bundle`
      )
      .then((response) => {
        console.log(response);
        setPlans(
          response.data.data.filter((plan: any) => {
            return plan.biller_code === props.telco;
          })
        );
        setLoading(false);
      })
      .catch((error) => {
        toast({
          title:
            error.response?.data?.error || "Error occured fetching data plan",
          status: "warning",
        });
      });
  };

  const handlePlanChange = (e: any) => {
    const tempNairaAmount = parseInt(e.target.value.split(",")[1]);
    setNairaAmount(tempNairaAmount);
    setTokenAmount(tempNairaAmount / tokenToNairaRate);
  };
  const buyData = async (data: any) => {
    if (
      parseInt(data.type.split(",")[1]) <
      parseFloat(walletBalance) * tokenToNairaRate
    ) {
      try {
        setLoading(true);
        setLoadingText("Validating provider");
        data.amount = parseInt(data.type.split(",")[1]);
        data.bill_type = data.type.split(",")[0];
        delete data.type;
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
          setLoadingText("Connecting To Provider...");
          data.transaction_hash = response.hash;
          const giftCardResponse: any = await buyAirtime(data); // Call recharge airtime  function
          console.log(giftCardResponse);

          if (giftCardResponse?.status === 200) {
            // Gift card created successfully
            toast({
              title: "Data purchased succesfully",
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
    } else {
      toast({ title: "insufficient balance ", status: "warning" });
    }

    // data.token_amount = data.data.split(",")[1];
    // delete data.network;
    // delete data.data;
  };

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
    fetchPlans();
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
            BUY {props.name} DATA
          </Text>
        </HStack>
      </HStack>

      <form style={{ width: "100%" }} onSubmit={handleSubmit(buyData)}>
        <VStack width={"full"} gap={"20px"}>
          <FormControl>
            <HStack width={"full"} justifyContent={"space-between"}>
              {" "}
              <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
                Data Plans (&#8358;)
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
              {...register("type", { onChange: handlePlanChange })}
              required
            >
              <option>Choose Plan</option>;
              {plans.map((plan: Plan, index) => {
                return (
                  <option value={[plan.biller_name, plan.amount]} key={index}>
                    {plan.biller_name} (N{plan.amount})
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
                  : tokenAmount.toFixed(3)}{" "}
                {currency}
              </Text>
              <Text color={"red"} fontSize={"xx-small"}>
                {errors.amount && errors.amount.message}
              </Text>
            </HStack>
            <FormErrorMessage></FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
              Beneficiary Phone Number
            </FormLabel>

            <Input
              fontSize={"16px"}
              border={"1px solid #f9f9f9"}
              outline={"none"}
              type="tel"
              required
              minLength={11}
              maxLength={11}
              {...register("customer")}
            />
            <FormErrorMessage></FormErrorMessage>
          </FormControl>

          {/* <FormControl>
            <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
              Amount
            </FormLabel>

            <Input
              border={"1px solid #f9f9f9"}
              value={amount}
              outline={"none"}
              fontSize={"14px"}
              type="number"
              min={100}
              required
            />
            <FormErrorMessage></FormErrorMessage>
          </FormControl> */}

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
            Buy Data
          </Button>
        </VStack>
      </form>
    </VStack>
  );
};
