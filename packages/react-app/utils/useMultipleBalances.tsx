import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";

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

const formatBalance = (balance: any, decimals: any) => {
	return (balance / Math.pow(10, decimals)).toFixed(2);
};

export const useMultipleBalance = (
	address: string | undefined,
	isConnected: boolean,
	token: "CUSD" | "USDT" | "USDC"
) => {
	const [tokenBalance, setTokenBalance] = useState<string>("0");
	const [selectedToken, setSelectedToken] = useState(token);
	const { address: tokenAddress, decimals } = TOKEN_CONFIG[token];

	useEffect(() => {
		const fetchBalance = async () => {
			if (isConnected && address) {
				try {
					const provider = new BrowserProvider(window.ethereum);
					const abi = [
						"function balanceOf(address account) view returns (uint256)",
					];

					const contract = new ethers.Contract(tokenAddress, abi, provider);
					const balanceInWei = await contract.balanceOf(address);
					const formattedBalance = formatBalance(
						balanceInWei.toString(),
						decimals
					);
					setTokenBalance(formattedBalance);
				} catch (error) {
					console.error("Error fetching balance:", error);
					setTokenBalance("0");
				}
			}
		};

		fetchBalance();
	}, [address, isConnected, tokenAddress, decimals]);

	return { tokenBalance, selectedToken, setSelectedToken };
};
