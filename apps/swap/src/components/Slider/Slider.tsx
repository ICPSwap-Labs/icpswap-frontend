import { Box, useTheme } from "components/Mui";
import { BigNumber, nonUndefinedOrNull, isUndefinedOrNull, percentToNum, numToPercent } from "@icpswap/utils";
import { Flex } from "@icpswap/ui";
import { Null } from "@icpswap/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { onPercentageChange, onXChange } from "components/Slider/utils";
import { SliderPopper } from "components/Slider/SliderPopper";

const SLICE_PERCENT_THRESHOLD = 25;

let MouseDownX: number | null = null;

// The start amount when dragging the slider
// It is equal to the value prop because the value prop may not be updated immediately when dragging
let AMOUNT = "0";
let POPPER_TIMEOUT: number | null = null;

export interface SliderProps {
  totalAmount: string | Null;
  onAmountChange: (amount: string) => void;
  width?: string | number;
  trackColor?: string;
  value: string | Null;
}

export const Slider = ({ totalAmount, onAmountChange, width, trackColor, value }: SliderProps) => {
  const theme = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const popperAnchorRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [mouseDown, setMouseDown] = useState(false);
  const [wrapperWidth, setWrapperWidth] = useState<number | null>(null);
  const [popperOpen, setPopperOpen] = useState(false);

  const handleAmountChange = useCallback(
    (amount: string) => {
      AMOUNT = amount;
      onAmountChange(amount);
    },
    [onAmountChange],
  );

  useEffect(() => {
    if (nonUndefinedOrNull(value)) {
      setAmount(value);
    }
  }, [value]);

  const { percentage } = useMemo(() => {
    if (isUndefinedOrNull(totalAmount) || isUndefinedOrNull(amount)) return { percentage: undefined };

    const percentage =
      isUndefinedOrNull(amount) || new BigNumber(amount).isEqualTo(0) || new BigNumber(totalAmount).isEqualTo(0)
        ? "0%"
        : new BigNumber(amount).isGreaterThanOrEqualTo(totalAmount)
        ? "100%"
        : `${new BigNumber(amount).dividedBy(totalAmount).multipliedBy(100)}%`;

    return {
      percentage,
    };
  }, [totalAmount, amount]);

  const stackPosition = useMemo(() => {
    if (isUndefinedOrNull(percentage) || isUndefinedOrNull(wrapperWidth)) return "0%";
    return `${new BigNumber(percentToNum(percentage)).multipliedBy(100)}%`;
  }, [percentage, wrapperWidth]);

  useEffect(() => {
    if (wrapperRef.current) {
      setWrapperWidth(wrapperRef.current.clientWidth);
    }
  }, [wrapperRef]);

  const timeoutClosePopper = useCallback(() => {
    POPPER_TIMEOUT = setTimeout(() => {
      setPopperOpen(false);
      POPPER_TIMEOUT = null;
    }, 1000);
  }, [setPopperOpen]);

  const handleOpenPopper = useCallback(() => {
    setPopperOpen(true);

    if (nonUndefinedOrNull(POPPER_TIMEOUT)) {
      clearTimeout(POPPER_TIMEOUT);
      POPPER_TIMEOUT = null;
    }

    if (mouseDown) return;

    timeoutClosePopper();
  }, [setPopperOpen, mouseDown, timeoutClosePopper]);

  const handleSliderClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isUndefinedOrNull(totalAmount) || isUndefinedOrNull(wrapperWidth)) return;

      const nativeEvent = event.nativeEvent;
      const offsetX = nativeEvent.offsetX;

      const { amount } = onXChange({
        x: offsetX,
        width: wrapperWidth,
        totalAmount,
      });

      handleAmountChange(amount);
      handleOpenPopper();
    },
    [wrapperWidth, totalAmount, handleOpenPopper],
  );

  const handleMove = useCallback(
    (moveX: number, screenX: number) => {
      if (isUndefinedOrNull(totalAmount) || new BigNumber(totalAmount).isEqualTo(0)) return;

      if (mouseDown && nonUndefinedOrNull(wrapperWidth)) {
        // Show the popper when moving
        handleOpenPopper();

        const startLeft = new BigNumber(wrapperWidth).multipliedBy(new BigNumber(AMOUNT).dividedBy(totalAmount));
        const __percentage = numToPercent(startLeft.plus(moveX).dividedBy(wrapperWidth).toString());
        const percentage = new BigNumber(percentToNum(__percentage)).isGreaterThan(1)
          ? "100%"
          : new BigNumber(percentToNum(__percentage)).isLessThan(0)
          ? "0%"
          : __percentage;

        const { amount } = onPercentageChange({ percentage, totalAmount });

        handleAmountChange(amount);

        MouseDownX = screenX;
      }
    },
    [mouseDown, wrapperWidth, totalAmount, handleAmountChange, handleOpenPopper],
  );

  const handleResetAmountBeforeMove = useCallback(() => {
    if (isUndefinedOrNull(amount)) {
      AMOUNT = "0";
    } else {
      AMOUNT = amount;
    }
  }, [amount]);

  const handleStartMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      handleResetAmountBeforeMove();
      MouseDownX = event.screenX;

      setMouseDown(true);
      handleOpenPopper();
    },
    [setMouseDown, handleResetAmountBeforeMove, handleOpenPopper],
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      event.preventDefault();
      handleResetAmountBeforeMove();
      setMouseDown(true);
      handleOpenPopper();
      MouseDownX = event.touches[0].screenX;
    },
    [setMouseDown, handleResetAmountBeforeMove, handleOpenPopper],
  );

  const handleEndMove = useCallback(() => {
    setMouseDown(false);
    timeoutClosePopper();
  }, [setMouseDown, timeoutClosePopper]);

  useEffect(() => {
    const move = (event: MouseEvent) => {
      if (MouseDownX) {
        const screenX = event.screenX;
        const moveX = screenX - MouseDownX;

        handleMove(moveX, screenX);
      }
    };

    const touchMove = (event: TouchEvent) => {
      if (MouseDownX) {
        const screenX = event.touches[0].screenX;
        const moveX = screenX - MouseDownX;

        handleMove(moveX, screenX);
      }
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", handleEndMove);

    document.addEventListener("touchmove", touchMove);
    document.addEventListener("touchend", handleEndMove);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", handleEndMove);

      document.removeEventListener("touchmove", touchMove);
      document.removeEventListener("touchend", handleEndMove);
    };
  }, [handleMove, handleEndMove]);

  const handlePercentageClick = useCallback(
    (index: number, event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (isUndefinedOrNull(totalAmount)) return;

      const { amount } = onPercentageChange({
        percentage: `${index * SLICE_PERCENT_THRESHOLD}%`,
        totalAmount,
      });

      onAmountChange(amount);
      handleOpenPopper();
    },
    [onPercentageChange, totalAmount, onAmountChange, handleOpenPopper],
  );

  return (
    <Box
      ref={wrapperRef}
      sx={{
        height: "12px",
        maxWidth: width ?? "160px",
        width: width ?? "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box sx={{ height: "4px", width: "100%", position: "relative" }}>
        <Flex
          fullWidth
          sx={{
            position: "relative",
            height: "4px",
            background: trackColor ?? theme.palette.background.level4,
            cursor: "pointer",
          }}
          onClick={handleSliderClick}
        >
          {[...Array.from({ length: 5 }).keys()].map((index) => {
            const active = isUndefinedOrNull(percentage)
              ? false
              : percentToNum(percentage) >= (index * SLICE_PERCENT_THRESHOLD) / 100;

            return (
              <Box
                key={index}
                sx={{
                  position: "absolute",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  background: active ? theme.colors.success : trackColor ?? "#38405D",
                  left: `${index * SLICE_PERCENT_THRESHOLD}%`,
                  transform: "translate(-50%, -50%)",
                  top: "50%",
                }}
                onClick={(event: React.MouseEvent<HTMLDivElement>) => handlePercentageClick(index, event)}
              />
            );
          })}

          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              width: percentage ?? 0,
              height: "4px",
              borderRadius: "10px",
              background: "#63D7B9",
              cursor: "pointer",
            }}
          />
        </Flex>

        <SliderPopper open={popperOpen} popperAnchor={popperAnchorRef.current} value={percentage} />

        <Box
          ref={popperAnchorRef}
          sx={{
            width: "12px",
            height: "12px",
            position: "absolute",
            left: stackPosition,
            top: "50%",
            transform: "translate(-50%, -50%)",
            cursor: "pointer",
          }}
          onMouseDown={handleStartMove}
          onTouchStart={handleTouchStart}
        >
          <Box
            sx={{
              width: "12px",
              height: "12px",
              background: theme.palette.background.level3,
              border: `2px solid ${theme.colors.success}`,
              borderRadius: "50%",
              cursor: "pointer",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
