import { Box, Text, VStack } from "@chakra-ui/react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";

type Props = { icon: StaticImageData; title: string; link: string };

const MenuCard = (props: Props) => {
  return (
    <Link href={props.link}>
      <VStack
        width={"148px"}
        height={"168px"}
        bg={"#103D96"}
        boxShadow={"0px 2px 2px 0px rgba(0, 0, 0, 0.10)"}
        borderRadius={"16px"}
        position={"relative"}
        justifyContent={"center"}
      >
        <Box position={"absolute"} top={"0px"} right={"0px"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="68"
            height="66"
            viewBox="0 0 68 66"
            fill="none"
          >
            <g filter="url(#filter0_b_1255_583)">
              <ellipse
                cx="44.6042"
                cy="18.5927"
                rx="55.7327"
                ry="32.9271"
                transform="rotate(49.3122 44.6042 18.5927)"
                fill="white"
                fillOpacity="0.5"
              />
            </g>
            <defs>
              <filter
                id="filter0_b_1255_583"
                x="-34.4857"
                y="-63.8175"
                width="158.18"
                height="164.82"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="17.5" />
                <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_1255_583"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_backgroundBlur_1255_583"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </Box>
        <VStack
          width={"70px"}
          height={"70px"}
          bg={"#DBF5FB"}
          borderRadius={"8px"}
          position={"relative"}
          justifyContent={"center"}
        >
          <Box position={"absolute"} top={"0px"} left={"0px"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="25"
              viewBox="0 0 28 25"
              fill="none"
            >
              <g opacity="0.5" filter="url(#filter0_b_1270_1084)">
                <path
                  d="M19.1399 1.31253C26.7218 7.00802 29.6419 15.9198 25.6622 21.2176C21.6824 26.5154 12.31 26.193 4.72813 20.4975C-2.85371 14.802 -5.77381 5.89023 -1.7941 0.592438C2.18561 -4.70535 11.5581 -4.38296 19.1399 1.31253ZM6.94478 17.5467C12.1943 21.4902 18.6837 21.7134 21.4392 18.0453C24.1946 14.3772 22.1728 8.2068 16.9233 4.26334C11.6737 0.319873 5.18438 0.096652 2.42889 3.76476C-0.326593 7.43286 1.69524 13.6033 6.94478 17.5467Z"
                  fill="#D9D9D9"
                  fillOpacity="0.1"
                />
              </g>
              <defs>
                <filter
                  id="filter0_b_1270_1084"
                  x="-38.5735"
                  y="-38.1792"
                  width="101.015"
                  height="98.1686"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feGaussianBlur in="BackgroundImageFix" stdDeviation="17.5" />
                  <feComposite
                    in2="SourceAlpha"
                    operator="in"
                    result="effect1_backgroundBlur_1270_1084"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_backgroundBlur_1270_1084"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </Box>
          <Image width={38} height={38} alt="" src={props.icon} />
          <Box position={"absolute"} right={"10%"} top={"30%"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="29"
              viewBox="0 0 32 29"
              fill="none"
            >
              <g opacity="0.5" filter="url(#filter0_b_1270_1087)">
                <path
                  d="M23.1399 5.31253C30.7218 11.008 33.6419 19.9198 29.6622 25.2176C25.6824 30.5154 16.31 30.193 8.72813 24.4975C1.14629 18.802 -1.77381 9.89023 2.2059 4.59244C6.18561 -0.705353 15.5581 -0.382955 23.1399 5.31253ZM10.9448 21.5467C16.1943 25.4902 22.6837 25.7134 25.4392 22.0453C28.1946 18.3772 26.1728 12.2068 20.9233 8.26334C15.6737 4.31987 9.18438 4.09665 6.42889 7.76476C3.67341 11.4329 5.69524 17.6033 10.9448 21.5467Z"
                  fill="#D9D9D9"
                  fillOpacity="0.1"
                />
              </g>
              <defs>
                <filter
                  id="filter0_b_1270_1087"
                  x="-34.5735"
                  y="-34.1792"
                  width="101.015"
                  height="98.1686"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feGaussianBlur in="BackgroundImageFix" stdDeviation="17.5" />
                  <feComposite
                    in2="SourceAlpha"
                    operator="in"
                    result="effect1_backgroundBlur_1270_1087"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_backgroundBlur_1270_1087"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </Box>
          <Box position={"absolute"} left={0} bottom={0}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="13"
              viewBox="0 0 27 13"
              fill="none"
            >
              <g opacity="0.5" filter="url(#filter0_b_1270_1081)">
                <ellipse
                  cx="10.5976"
                  cy="15.3936"
                  rx="11.9975"
                  ry="18"
                  transform="rotate(-53.0861 10.5976 15.3936)"
                  fill="#D9D9D9"
                  fillOpacity="0.1"
                />
              </g>
              <defs>
                <filter
                  id="filter0_b_1270_1081"
                  x="-40.5009"
                  y="-34.0597"
                  width="102.197"
                  height="98.9066"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feGaussianBlur in="BackgroundImageFix" stdDeviation="17.5" />
                  <feComposite
                    in2="SourceAlpha"
                    operator="in"
                    result="effect1_backgroundBlur_1270_1081"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_backgroundBlur_1270_1081"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </Box>
        </VStack>
        <Text
          fontSize={"16px"}
          width={"68px"}
          textAlign={"center"}
          color={"#fff"}
          fontWeight={"600"}
        >
          {props.title}
        </Text>
        <Box position={"absolute"} bottom={"0px"} left={"0px"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="86"
            viewBox="0 0 28 86"
            fill="none"
          >
            <g filter="url(#filter0_b_1255_584)">
              <ellipse
                cx="-16.6981"
                cy="47.727"
                rx="55.7327"
                ry="32.9271"
                transform="rotate(49.3122 -16.6981 47.727)"
                fill="white"
                fillOpacity="0.5"
              />
            </g>
            <defs>
              <filter
                id="filter0_b_1255_584"
                x="-95.788"
                y="-34.6832"
                width="158.18"
                height="164.82"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="17.5" />
                <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_1255_584"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_backgroundBlur_1255_584"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </Box>
      </VStack>
    </Link>
  );
};

export default MenuCard;
