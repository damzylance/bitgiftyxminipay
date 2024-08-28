import { shortify } from "@/utils/transaction";
import {
	ArrowBackIcon,
	ArrowLeftIcon,
	ChevronLeftIcon,
} from "@chakra-ui/icons";
import { Avatar, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdPhoneInTalk } from "react-icons/md";
import { useAccount } from "wagmi";

type Props = {};

const History = (props: Props) => {
	const transactionSetting = { NG: "" };
	const { address, isConnected } = useAccount();
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);

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
	useEffect(() => {
		if (isConnected && address) {
			axios
				.get(
					`${process.env.NEXT_PUBLIC_BASE_URL}transactions/?search=${address}&limi=500`
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
		} else {
			setLoading(false);
		}
		// fetchRates();
	}, [address, isConnected]);
	return (
		<VStack width={"full"} p={"10px"} gap={"20px"} bg={"#152654"}>
			<HStack width={"full"} justifyContent={"center"}>
				{" "}
				<Link href={"/"}>
					<ArrowBackIcon fontSize={"24px"} color={"#fff"} />
				</Link>
				<HStack width={"full"} justifyContent={"center"}>
					{" "}
					<Text fontSize={"16px"} color={"#fff"} fontWeight={"600"}>
						History
					</Text>
				</HStack>
			</HStack>

			<VStack width={"full"} height={"100vh"} overflowY={"scroll"} gap={"20px"}>
				{loading ? (
					<Spinner />
				) : transactions.length > 0 ? (
					transactions.map((transaction: any, id) => {
						let currency;
						let statusColor;
						let statusMessage;
						let sign;
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

							default:
								break;
						}

						if (transaction.status.toLowerCase() === "success") {
							statusColor = "#476621";
							statusMessage = "Success";
						} else if (transaction.status === "pending") {
							statusColor = "#fe8d59";
							statusMessage = "Pending";
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
							<HStack key={id} width={"full"} justifyContent={"space-between"}>
								<HStack gap={"10px"}>
									<Avatar bg={"#81a0dc"} size={"sm"} icon={<MdPhoneInTalk />} />
									<VStack gap={"5px"} alignItems={"flex-start"}>
										<Link
											href={`https://celoscan.io/tx/${transaction.transaction_hash}`}
										>
											{" "}
											<Text fontSize={"14px"} fontWeight={"500"} color={"#fff"}>
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
										{`${sign}${currency}${transaction.amount}`}
									</Text>
									<Text fontSize={"xs"} fontWeight={"400"} color={"#fff"}>
										{sign}
										{parseFloat(transaction.crypto_amount).toFixed(2)} cUSD
									</Text>

									<Text fontSize={"xs"} fontWeight={"400"} color={"#FFFFFF80"}>
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
		</VStack>
	);
};

export default History;
