import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Avatar, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdPhoneInTalk } from "react-icons/md";
import { useAccount } from "wagmi";

type Props = {};

const History = (props: Props) => {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  function shortify(hash: String) {
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(hash.length - 3, hash.length);
    return `${prefix}...${suffix}`;
  }

  function formatDate (date:string){
    const toDate =new Date(date)
    const day = toDate.toLocaleDateString("en-NG")
    .toString()
    .replaceAll("/", "-");
    const time = toDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const formatedDate = `${day} ${time}`
    return formatedDate
  }
  useEffect(() => {
    if (isConnected && address) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}transactions/?wallet_address=${address}`
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
    <VStack width={"full"} px={"10px"} gap={"20px"}>
      <HStack width={"full"} justifyContent={"center"}>
        {" "}
        <Link href={"/"}>
          <ChevronLeftIcon fontSize={"30px"} color={"#464646"} />
        </Link>
        <HStack width={"full"} justifyContent={"center"}>
          {" "}
          <Text fontSize={"lg"} fontWeight={"600"}>
            Transaction History
          </Text>
        </HStack>
      </HStack>

      <VStack width={"full"} gap={"20px"}>
        {loading ? (
          <Spinner />
        ) : transactions.length > 0 ? (
          transactions.map((transaction: any, id) => {
            let statusColor;
            let statusMessage
            if (transaction.status === "success") {
              statusColor = "#476621";
              statusMessage ="Success"
            } else if (transaction.status === "pending") {
              statusColor = "#fe8d59";
              statusMessage ="Processing"

            } else if(transaction.status ==="handled") {
              statusColor = "#476621";
              statusMessage ="Success"

            }else{
              statusColor = "#f44336";
              statusMessage = transaction.status
            }
            return (
              <HStack key={id} width={"full"} justifyContent={"space-between"}>
                <HStack gap={"10px"}>
                  <Avatar bg={"#81a0dc"} icon={<MdPhoneInTalk />} />
                  <VStack gap={"5px"} alignItems={"flex-start"}>
                    <Link
                      href={`https://celoscan.io/tx/${transaction.transaction_hash}`}
                    >
                      {" "}
                      <Text
                        fontSize={"14px"}
                        fontWeight={"500"}
                        color={"#464646"}
                      >
                        {shortify(transaction.transaction_hash)}
                      </Text>
                    </Link>

                    <Text fontSize={"xs"} fontWeight={"400"}>
                      {transaction.transaction_type} <br />
                      <span
                        style={{
                          color: statusColor,
                          textTransform: "capitalize",
                        }}
                      >
                        {statusMessage}
                      </span>
                    </Text>
                  </VStack>
                </HStack>
                <VStack gap={"5px"} alignItems={"flex-end"}>
                  <Text fontSize={"14px"} fontWeight={"500"} color={"#464646"}>
                    -&#8358;{transaction.amount}
                  </Text>
                  <Text fontSize={"xs"} fontWeight={"400"} color={"#464646"}>
                    -{parseFloat(transaction.crypto_amount).toFixed(2)} cUSD
                  </Text>
                  
                  <Text fontSize={"xs"} fontWeight={"400"} color={"#464646"}>{formatDate(transaction.time)}</Text>
                </VStack>
              </HStack>
            );
          })
        ) : (
          <Text>No transactions to display</Text>
        )}
        {}
      </VStack>
    </VStack>
  );
};

export default History;
