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
import { ArrowBackIcon, InfoIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { buyAirtime, transferCUSD } from "@/utils/transaction";
import { useBalance } from "@/utils/useBalance";
import { useFetchRates } from "@/utils/useFetchRates";
import { useUserCountry } from "@/utils/UserCountryContext";
import { useMultipleBalance } from "@/utils/useMultipleBalances";
type Inputs = {
	customer: string;
	amount: string;
	type: string;
	email: string;
};

type Plan = {
	biller_name: string;
	biller_code: string;
	item_code: string;
	amount: string;
	package: string;
	cost: string;
	id: string;
	category: string;
};
export const DataForm = (props: any) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm<Inputs>();
	const toast = useToast();
	const { address, isConnected } = useAccount();
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
	const { tokenToNairaRate, isLoading } = useFetchRates();
	const { userCurrencyTicker, cashback, userCountry } = useUserCountry();
	const [loading, setLoading] = useState(false);
	const [loadingText, setLoadingText] = useState("");
	const [tokenAmount, setTokenAmount] = useState(0);
	const [nairaAmount, setNairaAmount] = useState(0);
	const [plans, setPlans] = useState([]);
	const [networkId, setNetworkId] = useState([]);
	const [isDisabled, setIsDisabled] = useState(false);
	const [itemCode, setItemCode] = useState("");
	type CountrySettings = {
		minAmount: number;
		minPhoneDigits: number;
		maxPhoneDigits: number;
		placeHolder: string;
	};
	const settings: { [key: string]: CountrySettings } = {
		NG: {
			minAmount: 100,
			minPhoneDigits: 10,
			maxPhoneDigits: 11,
			placeHolder: "8012345890",
		},
		KE: {
			minAmount: 30,
			minPhoneDigits: 10,
			maxPhoneDigits: 10,
			placeHolder: "0712345890",
		},
		GH: {
			minAmount: 1,
			minPhoneDigits: 9,
			maxPhoneDigits: 10,
			placeHolder: "212345678",
		},
	};
	const countrySettings = settings[userCountry] || {
		minAmount: 0,
		maxPhoneDigits: 0,
	};
	const [userAddress, setUserAddress] = useState("");
	const rotateMessages = () => {
		if (loadingText === "Connecting To Provider...") {
			setTimeout(() => {
				setLoadingText("Processing Payment...");
			}, 2000);
		}
	};

	setInterval(rotateMessages, 1000);
	const validatePhone = async (e: any) => {
		if (userCountry === "NG") {
			setLoadingText("Validating Phone Number...");
			setLoading(true);
			const customer = e.target.value;
			const validate = await axios
				.get(
					`${process.env.NEXT_PUBLIC_BASE_URL}validate-bill-service/?item-code=${itemCode}&biller-code=${props.telco}&customer=${customer}`
				)
				.then((response) => {
					setLoading(false);
					return response;
				})
				.catch((error) => {
					return error;
				});
			console.log(validate);
			if (validate?.data?.data?.response_message === "Successful") {
				setIsDisabled(false);
				console.log(validate.data.data.response_message);
			} else {
				setLoading(false);
				setIsDisabled(true);
				toast({
					title: "Invalid phone number",
					status: "warning",
				});
			}
		}
	};
	const fetchPlans = async () => {
		setLoading(true);
		if (userCountry === "KE") {
			await axios
				.get(`${process.env.NEXT_PUBLIC_BASE_URL}v2/get-data-packages/1/`)
				.then((response) => {
					console.log(response);
					setLoading(false);
					setPlans(response.data.data);
				})
				.catch((error) => {
					setLoading(false);
					toast({
						title:
							error.response?.data?.error || "Error occured fetching data plan",
						status: "warning",
					});
				});
		} else {
			await axios
				.get(
					`${process.env.NEXT_PUBLIC_BASE_URL}v2/get-bill-info/?biller_code=${props.telco}`
				)
				.then((response) => {
					console.log(response);
					setLoading(false);
					setPlans(
						response.data.data.filter((plan: any) => {
							return plan.biller_code === props.telco && plan.id !== 17202;
						})
					);
				})
				.catch((error) => {
					setLoading(false);
					toast({
						title:
							error.response?.data?.error || "Error occured fetching data plan",
						status: "warning",
					});
				});
		}
	};

	const handlePlanChange = (e: any) => {
		let tempNairaAmount;
		if (userCountry === "KE") {
			tempNairaAmount = parseInt(e.target.value.split(",")[1]);
		} else {
			tempNairaAmount = parseInt(e.target.value.split(",")[2]);
			setItemCode(e.target.value.split(",")[1]);
		}
		console.log(tempNairaAmount);
		setNairaAmount(tempNairaAmount);
		setTokenAmount(tempNairaAmount / tokenToNairaRate);
	};
	const buyData = async (data: any) => {
		let dataAmount;
		if (userCountry === "KE") {
			dataAmount = data.type.split(",")[1];
		} else {
			dataAmount = data.type.split(",")[2];
		}
		if (parseInt(dataAmount) < parseFloat(tokenBalance) * tokenToNairaRate) {
			if (window.ethereum) {
				try {
					setLoading(true);
					if (userCountry === "KE") {
						data.amount = parseInt(data.type.split(",")[1]);
						data.data_package_id = parseInt(data.type.split(",")[0]);
						console.log("ke data", data.type);
					} else {
						data.amount = parseInt(data.type.split(",")[2]);
						data.biller_code = data.type.split(",")[0];
						data.item_code = data.type.split(",")[1];
					}
					data.bill_type = "MOBILEDATA";
					delete data.type;
					data.country = userCountry;
					data.chain = "cusd";
					data.wallet_address = address;
					data.crypto_amount = tokenAmount.toFixed(5);

					console.log(data);
					setLoadingText("Requesting transfer...");
					const response = await transferCUSD(
						userAddress,
						tokenAmount.toFixed(5),
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
						props.onClose();
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
		} else {
			toast({ title: "insufficient balance ", status: "warning" });
		}

		// data.token_amount = data.data.split(",")[1];
		// delete data.network;
		// delete data.data;
	};

	useEffect(() => {
		// axios
		// .get(
		//   `${process.env.NEXT_PUBLIC_BASE_URL}v2/get-biller-info/?country=${userCountry}&category=MOBILEDATA`
		// ).then((response:any)=>{
		//   console.log(response)
		// })
		if (isConnected && address) {
			setUserAddress(address);
		}
		fetchPlans();
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
						BUY {props.name} DATA
					</Text>
				</HStack>
			</HStack>

			<form style={{ width: "100%" }} onSubmit={handleSubmit(buyData)}>
				<VStack width={"full"} gap={"20px"}>
					<FormControl>
						<HStack width={"full"} justifyContent={"space-between"}>
							{" "}
							<FormLabel fontSize={"sm"} color={"#000"}>
								Data Plans (&#8358;)
							</FormLabel>
							<Text fontSize={"xs"} color={"#000"}>
								Balance({userCurrencyTicker}):{" "}
								{(
									parseFloat(tokenBalance) *
									parseFloat(tokenToNairaRate.toString())
								).toFixed(2)}
							</Text>
						</HStack>

						<Select
							fontSize={"16px"}
							border={"1px solid #506DBB"}
							{...register("type", { onChange: handlePlanChange })}
							required
						>
							<option>Select Plan</option>
							{userCountry === "KE" &&
								plans.map((plan: Plan, index) => {
									return (
										<option value={[plan.id, plan.cost]} key={index}>
											{plan.package} {plan.category} ({userCurrencyTicker}
											{plan.cost})
										</option>
									);
								})}
							{userCountry === "NG" &&
								plans
									.filter(
										(plan: Plan) =>
											plan.item_code !== "MD563" && plan.item_code !== "MD591"
									)
									.map((plan: Plan, index) => {
										return (
											<option
												value={[plan.biller_code, plan.item_code, plan.amount]}
												key={index}
											>
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
								≈ {tokenAmount.toFixed(3)} {currency}
							</Text>
							<Text color={"red"} fontSize={"xx-small"}>
								{errors.amount && errors.amount.message}
							</Text>
						</HStack>
						<FormErrorMessage></FormErrorMessage>
					</FormControl>
					<FormControl>
						<FormLabel fontSize={"sm"} color={"#000"}>
							Beneficiary Phone Number
						</FormLabel>

						<Input
							fontSize={"16px"}
							border={"1px solid #506DBB"}
							outline={"none"}
							type="number"
							required
							minLength={countrySettings.minPhoneDigits}
							maxLength={countrySettings.maxPhoneDigits}
							{...register("customer", {
								minLength: {
									value: countrySettings.minPhoneDigits,
									message: "Phone number should be 10 digits",
								},
								maxLength: {
									value: countrySettings.maxPhoneDigits,
									message: "Phone number should be 10 digits",
								},
								onBlur: validatePhone,
							})}
						/>
						<HStack width={"fulll"} justifyContent={"flex-end"}>
							<Text color={"red"} fontSize={"xs"}>
								{errors.customer && errors.customer.message}
							</Text>
						</HStack>
					</FormControl>

					<Button
						isLoading={loading || isLoading}
						loadingText={loadingText}
						isDisabled={isDisabled}
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
						Buy Data
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
