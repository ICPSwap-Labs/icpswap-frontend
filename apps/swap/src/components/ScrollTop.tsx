import { useCallback, useEffect, useState } from "react";
import { Box, useTheme, useMediaQuery } from "components/Mui";
import { Image } from "@icpswap/ui";

interface ScrollTopProps {
  left?: string;
  target: string;
  heightShowScrollTop: number;
  scrollTopTarget?: string;
}

export function ScrollTop({ target, heightShowScrollTop, scrollTopTarget }: ScrollTopProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollTopPositionLeft, setScrollTopPositionLeft] = useState<number | null>(null);

  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const handleScrollTop = useCallback(() => {
    let top = 0;

    if (scrollTopTarget) {
      const target = document.querySelector(`#${scrollTopTarget}`) as HTMLElement;

      if (target !== null) {
        top = target.offsetTop;
      }
    }

    window.scrollTo({
      top,
      left: 0,
      behavior: "smooth",
    });
  }, [scrollTopTarget]);

  useEffect(() => {
    const onScroll = () => {
      if (document.documentElement.scrollTop > heightShowScrollTop) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [heightShowScrollTop]);

  useEffect(() => {
    const wrapper = document.querySelector(`#${target}`);
    if (wrapper) {
      const boundingClientRect = wrapper.getBoundingClientRect();

      if (matchDownSM) {
        setScrollTopPositionLeft(boundingClientRect.right - 12 - 48);
      } else {
        setScrollTopPositionLeft(boundingClientRect.right + 20);
      }
    }
  }, [matchDownSM, target]);

  return showScrollTop ? (
    <Box
      id="scroll-top"
      sx={{ bottom: "20px", position: "fixed", left: `${scrollTopPositionLeft}px`, cursor: "pointer" }}
      onClick={handleScrollTop}
    >
      <Image src="/images/scroll-top.svg" sx={{ width: "48px", height: "48px" }} />
    </Box>
  ) : null;
}
