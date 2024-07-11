// pages/index.tsx
import { Box } from "@chakra-ui/react";
import Slider from "./Slider";
import slider1 from "../../public/assets/slider1.jpg";
import slider2 from "/public/assets/slider1.jpg";


const slides = [
  {
    url: "https://t.me/bitgifty",
    imageUrl: "/assets/slider1.jpg",
  },
  {
    url: "https://airdrop.mento.org/",
    imageUrl: "assets/slider2.jpg",
  },
  
];

const Home = () => {
  return (
    <Box width="full" height="76px"  margin="0 auto">
      <Slider slides={slides} />
    </Box>
  );
};

export default Home;
