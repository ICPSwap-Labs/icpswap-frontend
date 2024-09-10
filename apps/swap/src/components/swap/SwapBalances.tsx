import { Box, useTheme } from "components/Mui";
import {
  BigNumber,
  nonNullArgs,
  isNullArgs,
  formatTokenAmount,
  parseTokenAmount,
  percentToNum,
  numToPercent,
} from "@icpswap/utils";
import { Flex, Image } from "@icpswap/ui";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const GAP = 4;

interface getBalancePercentProps {
  unusedBalance: bigint;
  subAccountBalance: BigNumber;
  balance: string;
  token: Token;
}

function getBalancePercent({ unusedBalance, balance, subAccountBalance, token }: getBalancePercentProps) {
  const balancePercent = `${formatTokenAmount(balance, token.decimals)
    .dividedBy(formatTokenAmount(balance, token.decimals).plus(subAccountBalance).plus(unusedBalance.toString()))
    .multipliedBy(100)}%`;
  const canisterPercent = new BigNumber(subAccountBalance).plus(unusedBalance.toString()).isEqualTo(0)
    ? "0%"
    : `${new BigNumber(1).minus(percentToNum(balancePercent)).multipliedBy(100)}%`;

  return {
    balancePercent,
    canisterPercent,
  };
}

interface Args {
  x: number;
  width: number;
  unusedBalance: bigint;
  subAccountBalance: BigNumber;
  balance: string;
  token: Token;
  maxSpentAmount: string;
}

function onXChange({ x, width, unusedBalance, balance, subAccountBalance, token, maxSpentAmount }: Args) {
  const { balancePercent, canisterPercent } = getBalancePercent({ unusedBalance, balance, token, subAccountBalance });

  const onlyCanisterBalance = new BigNumber(x).isLessThan(
    new BigNumber(width).minus(GAP).multipliedBy(percentToNum(canisterPercent)),
  );

  const canisterWidth = onlyCanisterBalance
    ? numToPercent(
        new BigNumber(x).dividedBy(new BigNumber(width).minus(GAP).multipliedBy(percentToNum(canisterPercent))),
      )
    : "100%";
  const balanceWidth = onlyCanisterBalance
    ? "0%"
    : numToPercent(
        new BigNumber(x)
          .minus(new BigNumber(width).minus(GAP).multipliedBy(percentToNum(canisterPercent)).plus(GAP))
          .dividedBy(new BigNumber(width).minus(GAP).multipliedBy(percentToNum(balancePercent))),
      );

  const amount = new BigNumber(percentToNum(canisterWidth))
    .multipliedBy(percentToNum(canisterPercent))
    .plus(new BigNumber(percentToNum(balanceWidth)).multipliedBy(percentToNum(balancePercent)))
    .multipliedBy(maxSpentAmount)
    .toFixed(token.decimals);

  return {
    canisterWidth,
    balanceWidth,
    amount,
  };
}

export interface SwapBalancesProps {
  balance: string | Null;
  subAccountBalance: BigNumber | Null;
  unusedBalance: bigint | Null;
  token: Token | Null;
  amount: string | Null;
  maxSpentAmount: string | Null;
  onAmountChange: (amount: string) => void;
}

export function SwapBalances({
  amount,
  token,
  balance,
  subAccountBalance,
  unusedBalance,
  maxSpentAmount,
  onAmountChange,
}: SwapBalancesProps) {
  const theme = useTheme();

  const [wrapperWidth, setWrapperWidth] = useState<number | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const canisterRef = useRef<HTMLDivElement>(null);

  const { balancePercent, canisterPercent, canisterWidth, balanceWidth } = useMemo(() => {
    if (
      isNullArgs(balance) ||
      isNullArgs(unusedBalance) ||
      isNullArgs(subAccountBalance) ||
      isNullArgs(token) ||
      isNullArgs(maxSpentAmount) ||
      isNullArgs(wrapperWidth)
    )
      return {};

    const { balancePercent, canisterPercent } = getBalancePercent({ unusedBalance, balance, token, subAccountBalance });

    const totalCanisterAmount = parseTokenAmount(subAccountBalance, token.decimals).plus(
      parseTokenAmount(unusedBalance.toString(), token.decimals),
    );
    const totalAmount = new BigNumber(balance).plus(totalCanisterAmount);

    const canisterWidth = !amount
      ? "0%"
      : !new BigNumber(amount).isLessThan(totalCanisterAmount)
      ? "100%"
      : `${new BigNumber(amount).dividedBy(totalCanisterAmount).multipliedBy(100)}%`;

    const balanceWidth = !amount
      ? "0%"
      : !new BigNumber(amount).isLessThan(totalAmount)
      ? "100%"
      : new BigNumber(maxSpentAmount).isEqualTo(amount)
      ? "100%"
      : new BigNumber(amount).isGreaterThan(totalCanisterAmount)
      ? `${new BigNumber(amount).minus(totalCanisterAmount).dividedBy(balance).multipliedBy(100)}%`
      : "0%";

    return {
      balancePercent,
      canisterPercent,
      canisterWidth,
      balanceWidth,
    };
  }, [balance, unusedBalance, subAccountBalance, token, amount, maxSpentAmount]);

  const arrowPosition = useMemo(() => {
    if (
      isNullArgs(balanceWidth) ||
      isNullArgs(canisterWidth) ||
      isNullArgs(canisterPercent) ||
      isNullArgs(balancePercent) ||
      isNullArgs(wrapperWidth)
    )
      return "0%";

    // If only canister balances used
    if (new BigNumber(percentToNum(balanceWidth)).isEqualTo(0))
      return `${new BigNumber(percentToNum(canisterWidth))
        .multipliedBy(percentToNum(canisterPercent))
        .multipliedBy(100)}%`;

    // If canister balances and wallet balances both used
    if (new BigNumber(percentToNum(balanceWidth)).isGreaterThan(0)) {
      // If all balances used
      if (new BigNumber(percentToNum(balanceWidth)).isEqualTo(1)) {
        return "100%";
      }

      const percentWithoutGap = `${new BigNumber(percentToNum(canisterWidth))
        .multipliedBy(percentToNum(canisterPercent))
        .multipliedBy(100)
        .plus(
          new BigNumber(percentToNum(balanceWidth)).multipliedBy(percentToNum(balancePercent)).multipliedBy(100),
        )}%`;

      const actualWidth = new BigNumber(percentToNum(percentWithoutGap))
        .multipliedBy(new BigNumber(wrapperWidth).minus(GAP))
        .plus(GAP);

      return numToPercent(new BigNumber(actualWidth).dividedBy(wrapperWidth));
    }

    return "0%";
  }, [balanceWidth, canisterWidth, canisterPercent, balancePercent, wrapperWidth]);

  // console.log("canisterPercent: ", canisterPercent);
  // console.log("canisterWidth: ", canisterWidth);
  // console.log("balancePercent: ", balancePercent);
  // console.log("balanceWidth: ", balanceWidth);
  // console.log("arrowPosition", arrowPosition);

  useEffect(() => {
    if (ref.current) {
      setWrapperWidth(ref.current.clientWidth);
    }
  }, [ref]);

  const handleCanisterBalanceClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (
        isNullArgs(balance) ||
        isNullArgs(unusedBalance) ||
        isNullArgs(subAccountBalance) ||
        isNullArgs(token) ||
        isNullArgs(wrapperWidth) ||
        isNullArgs(maxSpentAmount)
      )
        return;

      const nativeEvent = event.nativeEvent;
      const offsetX = nativeEvent.offsetX;

      const { amount } = onXChange({
        x: offsetX,
        width: wrapperWidth,
        unusedBalance,
        subAccountBalance,
        token,
        balance,
        maxSpentAmount,
      });

      onAmountChange(amount);
    },
    [wrapperWidth, unusedBalance, subAccountBalance, token, balance, maxSpentAmount, onAmountChange],
  );

  const handleWalletBalanceClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (
        isNullArgs(balance) ||
        isNullArgs(unusedBalance) ||
        isNullArgs(subAccountBalance) ||
        isNullArgs(token) ||
        isNullArgs(wrapperWidth) ||
        isNullArgs(maxSpentAmount)
      )
        return;

      const nativeEvent = event.nativeEvent;
      const offsetX = nativeEvent.offsetX;

      let clickedX: null | number = null;

      if (canisterRef.current) {
        clickedX = offsetX + canisterRef.current.clientWidth + GAP;
      } else {
        clickedX = offsetX;
      }

      if (clickedX) {
        const { amount } = onXChange({
          x: clickedX,
          width: wrapperWidth,
          unusedBalance,
          subAccountBalance,
          token,
          balance,
          maxSpentAmount,
        });

        onAmountChange(amount);
      }
    },
    [wrapperWidth, canisterRef, maxSpentAmount, unusedBalance, subAccountBalance, token, balance, onAmountChange],
  );

  return (
    <Box
      ref={ref}
      sx={{
        position: "relative",
        height: "12px",
      }}
    >
      {nonNullArgs(balancePercent) && nonNullArgs(canisterPercent) ? (
        <>
          <Flex
            fullWidth
            gap={`0 ${GAP}px`}
            sx={{
              height: "4px",
              borderRadius: "10px",
              background: theme.palette.background.level1,
            }}
          >
            {nonNullArgs(canisterPercent) && new BigNumber(percentToNum(canisterPercent)).isGreaterThan(0) ? (
              <Box
                ref={canisterRef}
                sx={{
                  position: "relative",
                  width: canisterPercent,
                  height: "4px",
                  borderRadius: "10px",
                  background: theme.palette.background.level1,
                  cursor: "pointer",
                }}
                onClick={handleCanisterBalanceClick}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: canisterWidth ?? 0,
                    height: "4px",
                    borderRadius: "10px",
                    background: "#C7C698",
                    cursor: "pointer",
                  }}
                />
              </Box>
            ) : null}

            {nonNullArgs(balancePercent) && new BigNumber(percentToNum(balancePercent)).isGreaterThan(0) ? (
              <Box
                sx={{
                  position: "relative",
                  width: balancePercent,
                  height: "4px",
                  borderRadius: "10px",
                  background: theme.palette.background.level1,
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
            ) : null}
          </Flex>
          <Box
            sx={{
              position: "absolute",
              left: arrowPosition,
              top: "4px",
              width: "8px",
              height: "8px",
              cursor: "pointer",
              transform: `translate(-50%, 0)`,
            }}
          >
            <Image sx={{ width: "8px", height: "8px" }} src="/images/swap-balance-arrow.png" />
          </Box>{" "}
        </>
      ) : null}
    </Box>
  );
}
