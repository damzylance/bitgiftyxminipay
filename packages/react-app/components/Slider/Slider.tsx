import { useState, useEffect } from "react";
import { Box, Image, Link } from "@chakra-ui/react";

interface Slide {
  url: string;
  imageUrl: string;
}

interface SliderProps {
  slides: Slide[];
  interval?: number;
}

const Slider: React.FC<SliderProps> = ({ slides, interval = 10000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === slides.length - 1 ? 0 : prevSlide + 1
      );
    }, interval);

    return () => clearInterval(slideInterval);
  }, [slides.length, interval]);

  return (
    <Box position="relative" width="full" height="full" overflow="hidden">
      {slides.map((slide, index) => (
        <Box
          key={index}
          display={currentSlide === index ? "block" : "none"}
          position="absolute"
          top="0"
          left="0"
          width="full"
          height="full"
        >
          <Link href={slide.url} isExternal>
            <Image src={slide.imageUrl} alt={`Slide ${index}`} width="full" height="full" objectFit="cover" />
          </Link>
        </Box>
      ))}
    </Box>
  );
};

export default Slider;
