import { Box, useTheme } from "components/Mui";
import {
  BigNumber,
  nonUndefinedOrNull,
  isUndefinedOrNull,
  parseTokenAmount,
  percentToNum,
  numToPercent,
} from "@icpswap/utils";
import { Flex, Image } from "@icpswap/ui";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

let MouseDownX: number | null = null;

interface Args {
  x: number;
  width: number;
  balance: string;
  token: Token;
}

function onXChange({ x, width, balance, token }: Args) {
  const balanceWidth = numToPercent(new BigNumber(x).dividedBy(new BigNumber(width)));
  const amount = new BigNumber(percentToNum(balanceWidth))
    .multipliedBy(parseTokenAmount(balance, token.decimals))
    .toFixed(token.decimals);

  return {
    balanceWidth,
    amount,
  };
}

export interface BalanceSliderProps {
  balance: string | Null;
  token: Token | Null;
  amount: string | number | Null;
  onAmountChange: (amount: string) => void;
}

export function BalanceSlider({ amount, token, balance, onAmountChange }: BalanceSliderProps) {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const canisterRef = useRef<HTMLDivElement>(null);

  const [mouseDown, setMouseDown] = useState(false);
  const [wrapperWidth, setWrapperWidth] = useState<number | null>(null);
  const [arrowPositionByMouse, setArrowPosition] = useState<string | null>(null);

  const balanceWidth = useMemo(() => {
    if (isUndefinedOrNull(balance) || isUndefinedOrNull(token)) return undefined;

    const unformattedBalance = parseTokenAmount(balance, token.decimals).toString();

    return !amount
      ? "0%"
      : !new BigNumber(amount).isLessThan(unformattedBalance)
      ? "100%"
      : numToPercent(new BigNumber(amount).dividedBy(unformattedBalance).toString());
  }, [balance, token, amount]);

  const arrowPosition = useMemo(() => {
    if (isUndefinedOrNull(balanceWidth) || isUndefinedOrNull(wrapperWidth)) return "0%";

    return `${new BigNumber(percentToNum(balanceWidth)).multipliedBy(100)}%`;
  }, [balanceWidth, wrapperWidth]);

  useEffect(() => {
    if (ref.current) {
      setWrapperWidth(ref.current.clientWidth);
    }
  }, [ref]);

  const handleWalletBalanceClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isUndefinedOrNull(balance) || isUndefinedOrNull(token) || isUndefinedOrNull(wrapperWidth)) return;

      const nativeEvent = event.nativeEvent;
      const offsetX = nativeEvent.offsetX;

      let clickedX: null | number = null;

      if (canisterRef.current) {
        clickedX = offsetX + canisterRef.current.clientWidth;
      } else {
        clickedX = offsetX;
      }

      if (clickedX) {
        const { amount } = onXChange({
          x: clickedX,
          width: wrapperWidth,
          token,
          balance,
        });

        onAmountChange(amount);
      }
    },
    [wrapperWidth, canisterRef, token, balance, onAmountChange],
  );

  const onArrowPositionChange = (position: string) => {
    if (nonUndefinedOrNull(balance) && nonUndefinedOrNull(token)) {
      const amount = parseTokenAmount(balance, token.decimals)
        .multipliedBy(percentToNum(position))
        .toFixed(token.decimals);

      onAmountChange(amount);
    }
  };

  useEffect(() => {
    const move = (event: MouseEvent) => {
      if (mouseDown && MouseDownX && nonUndefinedOrNull(wrapperWidth)) {
        const screenX = event.screenX;
        const moveX = screenX - MouseDownX;

        const startLeft = new BigNumber(wrapperWidth).multipliedBy(percentToNum(arrowPositionByMouse ?? arrowPosition));

        const __position = numToPercent(startLeft.plus(moveX).dividedBy(wrapperWidth).toString());
        const position = new BigNumber(percentToNum(__position)).isGreaterThan(1)
          ? "100%"
          : new BigNumber(percentToNum(__position)).isLessThan(0)
          ? "0%"
          : __position;

        setArrowPosition(position);
        onArrowPositionChange(position);
        MouseDownX = screenX;
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
  }, [mouseDown, wrapperWidth, arrowPosition, arrowPositionByMouse]);

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
        height: "12px",
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
            onClick={handleWalletBalanceClick}
          >
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                width: balanceWidth ?? 0,
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
            left: arrowPositionByMouse ?? arrowPosition,
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
    </Box>
  );
}
