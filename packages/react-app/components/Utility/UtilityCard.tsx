import { Box, HStack, Text, VStack } from "@chakra-ui/react";

type Props = {
  action: any;
  icon: any;
  text: any;
};
export const UtilityCard = (props: Props) => {
  return (
    <VStack
      boxShadow={
        "-9.1159px -18.2318px 24.3091px #fff, 9.1159px 18.2318px 24.3091px #eceef1"
      }
      border={"1px solid #c2dafa"}
      width={"90%"}
      cursor={"pointer"}
      backgroundColor={"#f9f9f9"}
      alignSelf={"center"}
      alignItems={"center"}
      borderRadius={"12px"}
      justifyContent={"center"}
      gap={"10px"}
      minH={"200px"}
      position={"relative"}
      onClick={props.action}
    >
      <Box position={"absolute"} top={0} left={0}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="160"
          height="67"
          viewBox="0 0 160 67"
          fill="none"
        >
          <g filter="url(#filter0_b_1255_577)">
            <ellipse
              cx="75.983"
              cy="12.5923"
              rx="86.2339"
              ry="49.7206"
              transform="rotate(-17.6537 75.983 12.5923)"
              fill="white"
              fillOpacity="0.5"
            />
          </g>
          <defs>
            <filter
              id="filter0_b_1255_577"
              x="-42.5765"
              y="-76.5351"
              width="237.119"
              height="178.255"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="17.5" />
              <feComposite
                in2="SourceAlpha"
                operator="in"
                result="effect1_backgroundBlur_1255_577"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_backgroundBlur_1255_577"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </Box>
      <HStack
        width={"100px"}
        height={"100px"}
        justifyContent={"center"}
        background={"#f9f9f9"}
        boxShadow={
          "0px 3px 9.8px rgba(220, 230, 249, 0.80)"
        }
        borderRadius={"50%"}
        fontSize={"28px"}
        alignItems={"center"}
        color={"#0f3d97"}
        fontWeight={"extrabold"}
      >
        {props.icon}
      </HStack>

      <Text fontWeight={"600"}>{props.text}</Text>
    </VStack>
  );
};
