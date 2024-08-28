import React, { useEffect, useState } from "react";

import bitgiftyLogo from "../../public/assets/bitgifty-logo.png";
import bet9jaLogo from "../../public/assets/bet9ja-logo.webp";

import {
	HStack,
	Text,
	VStack,
	useDisclosure,
	Button,
	Box,
	Select,
	Avatar,
	Spinner,
} from "@chakra-ui/react";
import {
	MdConnectedTv,
	MdElectricBolt,
	MdPayment,
	MdPhoneInTalk,
	MdWifiTethering,
} from "react-icons/md";
import { UtilityCard } from "./UtilityCard";
import { UtilityDrawer } from "./UtilityModal";
import { useAccount } from "wagmi";
import { useBalance } from "@/utils/useBalance";
import { useFetchRates } from "@/utils/useFetchRates";
import Link from "next/link";
import { BrowserProvider, ethers, formatEther } from "ethers";
import { useUserCountry } from "@/utils/UserCountryContext";
import Image from "next/image";
import axios from "axios";
import Slider from "../Slider";
import { useMultipleBalance } from "@/utils/useMultipleBalances";
import { supportedTokens } from "@/utils/supportedTokens";
import { shortify } from "@/utils/transaction";
const Utility = () => {
	const {
		userCountry,
		setUserCountry,
		supportedCountries,
		userCurrencyTicker,
		setUserCurrencyTicker,
		setUserCountryCode,
		cashback,
		setCashback,
	} = useUserCountry();
	supportedCountries.map(() => {});
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [type, setType] = useState("");
	const { address, isConnected } = useAccount();
	const balance = useBalance(address, isConnected);
	const CUSD_ADDRESS = process.env.NEXT_PUBLIC_SC as string;
	const [dollarBalance, setDollarBalance] = useState(balance);
	const [loading, setLoading] = useState(true);
	const [transactions, setTransactions] = useState([]);
	const { tokenToNairaRate } = useFetchRates();
	const [dollarToken, setDollarToken] = useState<"CUSD" | "USDT" | "USDC">(
		"CUSD"
	);

	useEffect(() => {
		const storedToken =
			typeof window !== "undefined"
				? (localStorage.getItem("bgtPreferredToken") as
						| "CUSD"
						| "USDT"
						| "USDC"
						| null)
				: null;
		const defaultToken: "CUSD" | "USDT" | "USDC" = storedToken ?? "CUSD";
		console.log("default token is", defaultToken);
		setDollarToken(defaultToken);
	}, [isConnected]);

	const { tokenBalance, selectedToken, setSelectedToken } = useMultipleBalance(
		address,
		isConnected,
		dollarToken
	);

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("bgtPreferredToken", dollarToken);
		}
	}, [dollarToken]);

	const handleCountryChange = (e: any) => {
		let country = e.target.value;
		country = country.split(",");
		console.log(country[0]);
		setUserCountry(country[0]);
		setUserCountryCode(country[1]);
		setUserCurrencyTicker(country[2]);
		setCashback(country[3]);
		localStorage.setItem("userCountry", country);
	};

	// const fetchBalance = async () => {
	// 	if (isConnected && address) {
	// 		try {
	// 			const provider = new BrowserProvider(window.ethereum);
	// 			const abi = [
	// 				"function balanceOf(address account) view returns (uint256)",
	// 			];

	// 			const contract = new ethers.Contract(CUSD_ADDRESS, abi, provider);
	// 			const cusdBalanceInWei = await contract.balanceOf(address);
	// 			const cusdBalance = formatEther(cusdBalanceInWei.toString());
	// 			const netCusdBalance = (parseFloat(cusdBalance) - 0.002).toString();
	// 			setDollarBalance(netCusdBalance);
	// 		} catch (error) {
	// 			console.error("Error fetching balance:", error);
	// 		}
	// 	}
	// };

	function formatDate(date: string) {
		const toDate = new Date(date);
		const day = toDate
			.toLocaleDateString("en-NG")
			.toString()
			.replaceAll("/", "-");
		const time = toDate.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});

		const formatedDate = `${day} ${time}`;
		return formatedDate;
	}
	const fetchTransactions = async () => {
		await axios
			.get(
				`${process.env.NEXT_PUBLIC_BASE_URL}transactions/?search=${address}&limit=5`
			)
			.then((response) => {
				setLoading(false);
				setTransactions(response.data.results);
				console.log(response);
				// rate = parseFloat(response.data);
			})
			.catch((error) => {
				setLoading(false);
				console.log(error);
			});
	};
	useEffect(() => {
		if (isConnected && address) {
			fetchTransactions();
		} else {
			setLoading(false);
		}
		// fetchRates();
	}, [address, isConnected, tokenBalance]);

	// useEffect(() => {
	// 	fetchBalance();
	// }, [isConnected, address]);
	return (
		<VStack width={"full"} position={"relative"} gap={"2px"}>
			<Slider />
			<VStack
				background={"#53bfb9"}
				p={"10px"}
				width={"full"}
				borderRadius={"md"}
			>
				<Text fontSize={"xs"} textAlign={"center"}>
					🔥Spend over {userCurrencyTicker}
					{cashback} and get 10% back
				</Text>
			</VStack>
			<VStack width={"full"} pb={"10px"} gap={"40px"} bg={"#152654"}>
				<VStack
					p={"10px 24px"}
					color={"#fff"}
					width={"full"}
					gap={"10px"}
					alignItems={"flex-start"}
					position={"relative"}
				>
					<HStack position={"relative"} width={"full"}>
						{" "}
						<VStack alignItems={"center"} width={"full"} gap={0}>
							<Image
								src={bitgiftyLogo}
								width={85}
								height={46}
								alt={"Bitgifty Logo"}
							/>
							<Text fontSize={"14px"} fontWeight={"500"} mt={"20px"}>
								Pay your bills easily with MiniPay
							</Text>
						</VStack>
						<VStack position={"absolute"} right={"-20px"} top={"2"}>
							<Select zIndex={1} size={"xs"} onChange={handleCountryChange}>
								{supportedCountries
									.filter((country) => {
										return country.country == userCountry;
									})
									.map((country) => {
										return (
											<option
												value={[
													country.country,
													country.countryCode,
													country.ticker,
													country.cashback,
												]}
												key={country.currency}
											>
												{country.country} {country.flag}
											</option>
										);
									})}{" "}
								{supportedCountries
									.filter((country) => {
										return country.country != userCountry;
									})
									.map((country) => {
										return (
											<option
												value={[
													country.country,
													country.countryCode,
													country.ticker,
													country.cashback,
												]}
												key={country.currency}
											>
												{country.country} {country.flag}
											</option>
										);
									})}
							</Select>
						</VStack>
					</HStack>

					<HStack
						width={"full"}
						fontWeight={"700"}
						justifyContent={"center"}
						alignItems={"center"}
						gap={"4px"}
						fontSize={"32px"}
					>
						<Text>{userCurrencyTicker}</Text>
						<Text>
							{(
								parseFloat(tokenBalance) *
								parseFloat(tokenToNairaRate.toString())
							).toFixed(2)}
						</Text>
					</HStack>
					<HStack
						width={"full"}
						fontWeight={"500"}
						justifyContent={"center"}
						alignItems={"center"}
						gap={"4px"}
						fontSize={"16px"}
					>
						<Text fontStyle={"italic"}>{tokenBalance}</Text>
						<Select
							size={"sm"}
							fontSize={"12px"}
							width={"80px"}
							borderRadius={"full"}
							borderColor={"#7686af"}
							value={dollarToken} // Set the current value of the select
							onChange={(e: any) => {
								setDollarToken(e.target.value);
								localStorage.setItem("bgtPreferredToken", e.target.value);
								console.log(e.target.value);
							}}
						>
							{supportedTokens.map((token: string, id) => (
								<option key={id} value={token}>
									{token}
								</option>
							))}
						</Select>
					</HStack>
				</VStack>

				<VStack
					width={"full"}
					padding={"0 24px"}
					background={"#152654"}
					alignItems={"flex-start"}
					gap={"24px"}
				>
					<VStack width={"full"} borderRadius={"12px"} gap={"20px"}>
						<UtilityCard
							bg={
								"linear-gradient(87.57deg, rgba(63, 255, 163, 0.35) 0%, rgba(0, 143, 204, 0.35) 100%)"
							}
							icon={<MdPhoneInTalk />}
							text={"Buy Airtime"}
							action={() => {
								setType("airtime");
								onOpen();
							}}
						/>
						{userCountry === "NG" && (
							<UtilityCard
								bg={
									"linear-gradient(272.43deg, rgba(255, 74, 128, 0.35) 0%, rgba(0, 87, 255, 0.35) 100%)"
								}
								icon={
									<Image
										src={bet9jaLogo}
										style={{ borderRadius: "6px" }}
										width={50}
										height={50}
										alt=""
									/>
								}
								text={"Bet9ja Topup"}
								action={() => {
									setType("bet9ja");
									onOpen();
								}}
							/>
						)}

						<UtilityCard
							bg={
								"linear-gradient(272.43deg, rgba(255, 74, 128, 0.35) 0%, rgba(0, 87, 255, 0.35) 100%)"
							}
							icon={<MdWifiTethering />}
							text={"Buy Data"}
							action={() => {
								setType("data");
								onOpen();
							}}
						/>

						{userCountry !== "KE" && (
							<>
								<UtilityCard
									bg={
										"linear-gradient(272.43deg, rgba(255, 184, 0, 0.35) 0%, rgba(255, 74, 128, 0.35) 100%)"
									}
									icon={<MdElectricBolt />}
									text={"Pay Electricity"}
									action={() => {
										setType("electricity");
										onOpen();
									}}
								/>
								<UtilityCard
									bg={
										"linear-gradient(87.3deg, rgba(186, 102, 255, 0.35) -0.49%, rgba(0, 206, 206, 0.35) 100%)"
									}
									icon={<MdConnectedTv />}
									text={"Pay Cable"}
									action={() => {
										setType("cable");
										onOpen();
									}}
								/>
							</>
						)}

						{userCountry === "KE" && (
							<>
								{/* <UtilityCard
          bg={"linear-gradient(272.43deg, rgba(255, 184, 0, 0.35) 0%, rgba(255, 74, 128, 0.35) 100%)"}
          icon={<MdSportsFootball />}
          text={"Bet Top up"}
          action={() => {
            setType("bettopup");
            onOpen();
          }}
        /> */}

								<UtilityCard
									bg={
										"linear-gradient(87.4deg, rgba(255, 123, 123, 0.35) 0%, rgba(123, 0, 255, 0.35) 100%)"
									}
									icon={<MdPayment />}
									text={"Pay Bills"}
									action={() => {
										setType("paybill");
										onOpen();
									}}
								/>
								<UtilityCard
									bg={
										"linear-gradient(87.4deg, rgba(0, 255, 204, 0.35) 0%, rgba(0, 51, 204, 0.35) 100%)"
									}
									icon={<MdPayment />}
									text={"Buy Goods"}
									action={() => {
										setType("buygoods");
										onOpen();
									}}
								/>
							</>
						)}
					</VStack>
				</VStack>

				<VStack
					width={"90%"}
					box-shadow={"0px 2px 8px 0px #0000000F"}
					borderRadius={"16px"}
					background={"#FFFFFF0D"}
					padding={"10px"}
					alignItems={"center"}
					gap={"24px"}
				>
					<Text fontSize={"16px"} color={"#fff"} fontWeight={"600"}>
						History
					</Text>
					<VStack width={"full"} gap={"20px"}>
						{loading ? (
							<Spinner />
						) : transactions.length > 0 ? (
							transactions.map((transaction: any, id) => {
								let statusColor;
								let statusMessage;
								let sign;
								let currency;
								switch (transaction.country) {
									case "NG":
										currency = "₦";
										break;
									case "nigeria":
										currency = "₦";
										break;
									case "GH":
										currency = "₵";
										break;
									case "KE":
										currency = "KSh";
										break;
									case "ZA":
										currency = "R";
										break;
									case "UG":
										currency = "UGX";
										break;
									default:
										break;
								}

								if (transaction.status === "success") {
									statusColor = "#29C087";
									statusMessage = "Success";
								} else if (transaction.status === "pending") {
									statusColor = "#fe8d59";
									statusMessage = "Processing";
								} else if (transaction.status === "handled") {
									statusColor = "#476621";
									statusMessage = "Success";
								} else {
									statusColor = "#f44336";
									statusMessage = "Failed";
								}

								if (
									transaction.transaction_type === "refund" ||
									transaction.transaction_type === "cashback"
								) {
									sign = "+";
								} else {
									sign = "-";
								}
								return (
									<HStack
										key={id}
										width={"full"}
										justifyContent={"space-between"}
									>
										<HStack gap={"10px"}>
											<Avatar
												bg={"#81a0dc"}
												size={"sm"}
												icon={<MdPhoneInTalk />}
											/>
											<VStack gap={"5px"} alignItems={"flex-start"}>
												<Link
													href={`https://celoscan.io/tx/${transaction.transaction_hash}`}
												>
													{" "}
													<Text
														fontSize={"14px"}
														fontWeight={"500"}
														color={"#fff"}
													>
														{shortify(transaction.transaction_hash)}
													</Text>
												</Link>

												<Text fontSize={"xs"} color={"#fff"} fontWeight={"400"}>
													{transaction.transaction_type} <br />
													<span
														style={{
															color: statusColor,
															textTransform: "capitalize",
														}}
													>
														{statusMessage}
													</span>
													<br />
													<span>{transaction.customer}</span>
												</Text>
											</VStack>
										</HStack>
										<VStack gap={"5px"} alignItems={"flex-end"}>
											<Text fontSize={"14px"} fontWeight={"500"} color={"#fff"}>
												{transaction.type === "refund"
													? "+"
													: transaction.type === "cashback"
													? "+"
													: "-"}
												{`${currency}${transaction.amount}`}
											</Text>
											<Text fontSize={"xs"} fontWeight={"400"} color={"#fff"}>
												{sign}
												{parseFloat(transaction.crypto_amount).toFixed(2)} cUSD
											</Text>

											<Text
												fontSize={"xs"}
												fontWeight={"400"}
												color={"#FFFFFF80"}
											>
												{formatDate(transaction.time)}
											</Text>
										</VStack>
									</HStack>
								);
							})
						) : (
							<Text color={"#fff"}>No transactions to display</Text>
						)}
					</VStack>
					<Link href={"/transaction-history"} style={{ width: "100%" }}>
						<HStack
							width={"full"}
							borderRadius={"full"}
							justifyContent={"center"}
							bg={"#FFFFFF1A"}
							padding={"10px"}
						>
							<Text color={"#fff"} fontWeight={"500"} fontSize={"14px"}>
								See All
							</Text>
						</HStack>
					</Link>
				</VStack>
			</VStack>

			<UtilityDrawer
				type={type}
				isOpen={isOpen}
				onClose={() => {
					// fetchBalance();
					onClose();
					fetchTransactions();
				}}
			/>
		</VStack>
	);
};

export default Utility;
