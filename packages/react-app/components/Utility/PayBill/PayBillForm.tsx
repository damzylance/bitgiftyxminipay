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
import {
	ArrowBackIcon,
	CloseIcon,
	InfoIcon,
	WarningIcon,
} from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { buyAirtime, transferCUSD } from "@/utils/transaction";
import { useBalance } from "@/utils/useBalance";
import { useFetchRates } from "@/utils/useFetchRates";
import { useUserCountry } from "@/utils/UserCountryContext";
import { useMultipleBalance } from "@/utils/useMultipleBalances";
type Inputs = {
	account_number: string;
	short_code: string;
	amount: string;
	type: string;
	email: string;
};

type Plan = {
	biller_name: string;
	biller_code: string;
	item_code: string;
	amount: string;
};
export const PayBillForm = (props: any) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm<Inputs>();
	type CountrySettings = {
		minAmount: number;
		minPhoneDigits: number;
		maxPhoneDigits: number;
		placeHolder: string;
	};
	const settings: { [key: string]: CountrySettings } = {
		KE: {
			minAmount: 10,
			minPhoneDigits: 10,
			maxPhoneDigits: 10,
			placeHolder: "10",
		},
	};
	const toast = useToast();
	const { address, isConnected } = useAccount();
	const { tokenToNairaRate, isLoading } = useFetchRates();
	const { userCurrencyTicker, cashback, userCountry } = useUserCountry();
	const [loading, setLoading] = useState(false);
	const [loadingText, setLoadingText] = useState("");
	const [tokenAmount, setTokenAmount] = useState(0);
	const [nairaAmount, setNairaAmount] = useState(0);
	const [feeInToken, setFeeInToken] = useState(0);
	const storedToken = localStorage.getItem("bgtPreferredToken") as
		| "CUSD"
		| "USDT"
		| "USDC"
		| null;
	const defaultToken: "CUSD" | "USDT" | "USDC" = storedToken ?? "CUSD";
	const [currency, setCurrency] = useState<"CUSD" | "USDT" | "USDC">(
		defaultToken
	);
	const { tokenBalance } = useMultipleBalance(address, isConnected, currency);
	const [plans, setPlans] = useState([]);
	const [networkId, setNetworkId] = useState([]);
	const [userAddress, setUserAddress] = useState("");
	const [blackList, setBlackList] = useState([
		"955100",
		"7650880",
		"888880",
		"5212121",
		"888888",
		"79079",
		"260680",
		"247979",
		"800088",
		"718085",
		"8228252",
		"955700",
		"290290",
		"4087777",
		"290059",
		"290077",
		"779900",
		"290020",
		"565619",
		"290680",
		"880185",
	]);
	const countrySettings = settings[userCountry] || {
		minAmount: 0,
		maxPhoneDigits: 0,
	};
	const rotateMessages = () => {
		if (loadingText === "Connecting To Provider...") {
			setTimeout(() => {
				setLoadingText("Processing Payment...");
			}, 2000);
		}
	};

	setInterval(rotateMessages, 1000);

	// const updateBlacklist =  async() =>{
	//   setLoading(true)
	//   axios.get("https://pretium.africa/flagged-paybills.json").then((response)=>{
	//     console.log(response)
	//     setBlackList(response.data.paybills)
	//   }).catch((error)=>{
	//     toast({title:"Error fetching blacklisted vendors"})
	//   }).finally(()=>{
	//     setLoading(false)
	//   })
	// }
	const verifyPaybill = (paybillNumber: string) => {
		return blackList.find((item) => item === paybillNumber);
	};

	const handleAmountChange = (e: any) => {
		const tempNairaAmount = e.target.value;
		setNairaAmount(tempNairaAmount);
		if (currency === "CUSD" || currency === "USDT" || currency === "USDC") {
			const tempTokenAmount = tempNairaAmount / tokenToNairaRate;
			setFeeInToken(tempTokenAmount * 0.001);
			setTokenAmount(tempNairaAmount / tokenToNairaRate);
		} else {
			setTokenAmount(tokenToNairaRate * tempNairaAmount);
		}
	};
	const payBill = async (data: any) => {
		if (window.ethereum) {
			try {
				setLoading(true);
				data.bill_type = "PAYBILL";
				data.country = userCountry;
				data.chain = currency.toLocaleLowerCase();
				data.wallet_address = address;
				const FeePlusAmount = tokenAmount + feeInToken;
				data.crypto_amount = parseFloat(FeePlusAmount.toString()).toFixed(5);
				data.customer = data.short_code;

				if (data.account_number === "") {
					delete data.account_number;
				} else {
					data.customer = `${data.short_code}/${data.account_number}`;
				}

				console.log(data);
				setLoadingText("Validating paybill number");

				const invalidShortCode = verifyPaybill(data.short_code);
				console.log(invalidShortCode);

				if (!invalidShortCode) {
					setLoadingText("Requesting transfer...");
					const response = await transferCUSD(
						userAddress,
						data.crypto_amount,
						currency
					);

					if (response.status === 1) {
						data.transaction_hash = response.hash;
						const newDate = new Date();
						data.timestamp = newDate.getTime().toString();
						data.offset = newDate.getTimezoneOffset().toString();
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
				} else {
					toast({ title: "Paybill number not supported ", status: "warning" });
					setLoading(false);
				}
			} catch (error: any) {
				console.log(error);
				toast({ title: error.message, status: "warning" });
			} finally {
				setLoading(false);
			}
		} else {
			toast({
				title: "You can only perfom transaction from MiniPay",
				status: "warning",
			});
		}

		// data.token_amount = data.data.split(",")[1];
		// delete data.network;
		// delete data.data;
	};

	useEffect(() => {
		if (isConnected && address) {
			setUserAddress(address);
		}
		// updateBlacklist()
	}, [address, isConnected]);

	return (
		<VStack my={"20px"} gap={"10px"} width={"full"}>
			<Text fontSize={"xs"} textAlign={"center"}>
				🔥Spend over {userCurrencyTicker}
				{cashback} and get 10% back
			</Text>
			<HStack width={"full"} alignItems={"center"}>
				<HStack width={"full"} justifyContent={"cener"}>
					<Text
						fontSize={"24px"}
						fontWeight={"700"}
						textTransform={"uppercase"}
						width={"full"}
					>
						Pay Bill
					</Text>
				</HStack>
			</HStack>
			<HStack fontSize={"sm"} fontWeight={400} color={"#8B4000"}>
				{" "}
				<WarningIcon />{" "}
				<Text fontSize={"xs"}>
					{" "}
					Verify details carefully. Transactions sent to wrong details are
					non-refundable
				</Text>{" "}
			</HStack>

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
									parseFloat(tokenBalance) *
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
									value: parseFloat(tokenBalance) * tokenToNairaRate,
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
								≈ {tokenAmount.toFixed(4)} {currency}
								<br />
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
							<Text fontSize={"xs"}>≈ {(tokenAmount * 0.05).toFixed(4)}</Text>
						</HStack>
						<FormErrorMessage>
							{errors.amount && errors.amount.message}
						</FormErrorMessage>
					</FormControl>
					<FormControl>
						<FormLabel fontSize={"sm"} color={"#000"}>
							Paybill Number
						</FormLabel>

						<Input
							fontSize={"16px"}
							border={"1px solid #506DBB"}
							outline={"none"}
							type="number"
							required
							{...register("short_code")}
						/>
						<HStack width={"fulll"} justifyContent={"flex-end"}>
							<Text color={"red"} fontSize={"xs"}>
								{errors.short_code && errors.short_code.message}
							</Text>
						</HStack>
					</FormControl>
					<FormControl>
						<FormLabel fontSize={"sm"} color={"#000"}>
							Account Number
						</FormLabel>

						<Input
							fontSize={"16px"}
							border={"1px solid #506DBB"}
							outline={"none"}
							{...register("account_number")}
						/>
						<HStack width={"fulll"} justifyContent={"flex-end"}>
							<Text color={"red"} fontSize={"xs"}>
								{errors.account_number && errors.account_number.message}
							</Text>
						</HStack>
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
						// isDisabled={true}
						type="submit"
						size={"lg"}
						width={"full"}
						borderRadius={"full"}
						background={"#152654"}
						_hover={{
							background: "#152654",
						}}
						variant={"solid"}
					>
						Pay Bill
					</Button>
					<HStack fontSize={"sm"} fontWeight={400} color={"#4d4c4c"}>
						{" "}
						<InfoIcon /> <Text>This may take up to 15 seconds</Text>{" "}
					</HStack>
				</VStack>
			</form>
		</VStack>
	);
};
