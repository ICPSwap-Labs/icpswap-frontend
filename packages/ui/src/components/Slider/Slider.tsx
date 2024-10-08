import { BigNumber, nonNullArgs, isNullArgs, percentToNum, numToPercent } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Flex } from "../Grid/Flex";
import { Image } from "../Image/index";
import { Box, Typography, useTheme } from "../Mui";

let MouseDownX: number | null = null;

export interface SliderProps {
  percent: string | Null;
  onChange: (percent: string) => void;
  labelLeft?: ReactNode;
  labelRight?: ReactNode;
}

export function Slider({ percent, onChange, labelLeft, labelRight }: SliderProps) {
  const theme = useTheme();

  const ref = useRef<HTMLDivElement>(null);
  const canisterRef = useRef<HTMLDivElement>(null);

  const [mouseDown, setMouseDown] = useState(false);
  const [wrapperWidth, setWrapperWidth] = useState<number | null>(null);
  const [arrowPositionByMouse, setArrowPosition] = useState<string | null>(null);

  const sliderWidth = useMemo(() => {
    if (isNullArgs(percent) || isNullArgs(wrapperWidth)) return 0;
    return new BigNumber(wrapperWidth).multipliedBy(percentToNum(percent)).toString();
  }, [wrapperWidth, percent]);

  useEffect(() => {
    if (ref.current) {
      setWrapperWidth(ref.current.clientWidth);
    }
  }, [ref]);

  const handleSliderClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isNullArgs(wrapperWidth)) return;

      const nativeEvent = event.nativeEvent;
      const offsetX = nativeEvent.offsetX;

      let clickedX: null | number = null;

      if (canisterRef.current) {
        clickedX = offsetX + canisterRef.current.clientWidth;
      } else {
        clickedX = offsetX;
      }

      if (clickedX) {
        onChange(numToPercent(new BigNumber(clickedX).dividedBy(wrapperWidth).toNumber()));
      }
    },
    [wrapperWidth, canisterRef, onChange],
  );

  useEffect(() => {
    const move = (event: MouseEvent) => {
      if (mouseDown && MouseDownX && nonNullArgs(wrapperWidth)) {
        const screenX = event.screenX;
        const moveX = screenX - MouseDownX;

        const startLeft = new BigNumber(wrapperWidth).multipliedBy(percentToNum(percent));

        const __position = numToPercent(startLeft.plus(moveX).dividedBy(wrapperWidth).toString());
        const position = new BigNumber(percentToNum(__position)).isGreaterThan(1)
          ? "100%"
          : new BigNumber(percentToNum(__position)).isLessThan(0)
          ? "0%"
          : __position;

        MouseDownX = screenX;
        onChange(position);
      }
    };

    const mouseUp = () => {
      setMouseDown(false);
      setArrowPosition(null);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", mouseUp);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", mouseUp);
    };
  }, [mouseDown, wrapperWidth, percent, arrowPositionByMouse]);

  const handleArrowMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setMouseDown(true);
      MouseDownX = event.screenX;
    },
    [setMouseDown],
  );

  return (
    <Box
      ref={ref}
      sx={{
        position: "relative",
      }}
    >
      <>
        <Flex
          fullWidth
          sx={{
            height: "4px",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "4px",
              borderRadius: "10px",
              background: theme.palette.background.level4,
              cursor: "pointer",
            }}
            onClick={handleSliderClick}
          >
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                width: sliderWidth ? `${sliderWidth}px` : 0,
                height: "4px",
                borderRadius: "10px",
                background: "#63D7B9",
                cursor: "pointer",
              }}
            />
          </Box>
        </Flex>

        <Box
          sx={{
            position: "absolute",
            left: sliderWidth ? `${sliderWidth}px` : 0,
            top: "4px",
            width: "8px",
            height: "8px",
            cursor: "pointer",
            transform: `translate(-50%, 0)`,
          }}
          onMouseDown={handleArrowMouseDown}
        >
          <Image sx={{ width: "8px", height: "8px" }} src="/images/swap-balance-arrow.png" />
        </Box>
      </>

      {labelLeft || labelRight ? (
        <Flex fullWidth justify="space-between" sx={{ margin: "16px 0 0 0" }}>
          <Typography component="div" fontSize="12px">
            {labelLeft}
          </Typography>
          <Typography component="div" fontSize="12px">
            {labelRight}
          </Typography>
        </Flex>
      ) : null}
    </Box>
  );
}
