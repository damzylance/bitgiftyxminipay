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
import { ArrowBackIcon, InfoIcon, WarningIcon } from "@chakra-ui/icons";
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
export const ByGoodsForm = (props: any) => {
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

	const handleAmountChange = (e: any) => {
		const tempNairaAmount = e.target.value;
		setNairaAmount(tempNairaAmount);
		if (currency === "CUSD" || currency === "USDT" || currency == "USDC") {
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
				data.bill_type = "BUY_GOODS";
				data.country = userCountry;
				data.chain = currency.toLowerCase();
				data.wallet_address = address;
				data.crypto_amount = tokenAmount.toFixed(5) + feeInToken.toFixed(5);
				data.customer = data.short_code;
				console.log(data);
				setLoadingText("Requesting transfer...");
				const response = await transferCUSD(
					userAddress,
					parseFloat(data.crypto_amount).toFixed(5),
					currency
				);

				if (response.status === 1) {
					data.transaction_hash = response.hash;
					const newDate = new Date();
					data.timestamp = newDate.getTime().toString();
					data.offset = newDate.getTimezoneOffset().toString();
					setLoadingText("Connecting to provider");
					const giftCardResponse: any = await buyAirtime(data); // Call recharge airtime  function
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
		} else {
			toast({
				title: "You can only perfom transaction from MiniPay",
				status: "warning",
			});
		}
	};

	useEffect(() => {
		if (isConnected && address) {
			setUserAddress(address);
		}
	}, [address, isConnected]);

	return (
		<VStack my={"40px"} gap={"10px"} width={"full"}>
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
						Buy Goods
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
				<VStack width={"full"} gap={"20px"}>
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
							Till Number
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
							background: "#152654",
						}}
						variant={"solid"}
					>
						Buy Good
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
