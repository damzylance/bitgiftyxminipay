import axios from "axios";
import { ethers, Contract, BrowserProvider, parseUnits } from "ethers";

const CUSD_ADDRESS = process.env.NEXT_PUBLIC_SC as string;

// Generate and send giftcard
export const buyAirtime = async (data: any) => {
	console.log(data);
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_BASE_URL}v2/create-bill-transaction/`,
			data
		);
		console.log(response.data);
		return response;
	} catch (error) {
		console.error("Error:", error);
		return error;
	}
};

export const bet9jaTopup = async (data: any) => {
	console.log(data);
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_BASE_URL}bet/create-deposit-notification/`,
			data
		);
		console.log(response.data);
		return response;
	} catch (error) {
		console.error("Error:", error);
		return error;
	}
};
// Transfer tokens
const TOKEN_CONFIG = {
	CUSD: {
		address: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
		decimals: 18,
	},
	USDT: {
		address: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
		decimals: 6,
	},
	USDC: {
		address: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
		decimals: 6,
	},
};

export const transferCUSD = async (
	userAddress: string,
	amount: string,
	token: "CUSD" | "USDT" | "USDC"
) => {
	if (window.ethereum) {
		try {
			const provider = new BrowserProvider(window.ethereum);
			const signer = await provider.getSigner(userAddress);

			const abi = ["function transfer(address to, uint256 value)"];
			const tokenContract = new Contract(
				TOKEN_CONFIG[token].address,
				abi,
				signer
			);

			// Adjust the amount based on the token's decimals
			const decimals = TOKEN_CONFIG[token].decimals;
			const amountInWei = parseUnits(amount, decimals);

			const txn = await tokenContract.transfer(
				process.env.NEXT_PUBLIC_MW,
				amountInWei
			);

			const receipt = await txn.wait();
			return receipt;
		} catch (error) {
			console.error("Error during transfer:", error);
			throw new Error("Transfer failed");
		}
	} else {
		throw new Error("Ethereum wallet is not available");
	}
};
