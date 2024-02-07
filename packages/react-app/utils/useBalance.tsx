import { useState, useEffect } from "react";
import { ethers, BrowserProvider, formatEther } from "ethers";

export const useBalance = (
  address: string | undefined,
  isConnected: boolean
) => {
  const [balance, setBalance] = useState<string>("0");
  const CUSD_ADDRESS = process.env.NEXT_PUBLIC_SC as string;

  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && address) {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const abi = [
            "function balanceOf(address account) view returns (uint256)",
          ];

          const contract = new ethers.Contract(CUSD_ADDRESS, abi, provider);
          const cusdBalanceInWei = await contract.balanceOf(address);
          const cusdBalance = formatEther(cusdBalanceInWei.toString());
          setBalance(cusdBalance);
        } catch (error) {
          console.error("Error fetching balance:", error);
          setBalance("0");
        }
      }
    };

    fetchBalance();
  }, [address, isConnected, CUSD_ADDRESS,balance]);

  return balance;
};
