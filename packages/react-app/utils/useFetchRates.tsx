import { useState, useEffect } from "react";
import axios from "axios";
import { Toast } from "@chakra-ui/react";
export const useFetchRates = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenToNairaRate, setTokenToNairaRate] = useState<number>(0);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_UTIL_BASE_URL}swap/get-dollar-price`
      );
      console.log(response);
      setTokenToNairaRate(parseFloat(response.data));
    } catch (error: any) {
      console.error(error);
      Toast({
        title: error.response?.data?.error || "An error occurred",
        status: "warning",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return { isLoading, tokenToNairaRate };
};
