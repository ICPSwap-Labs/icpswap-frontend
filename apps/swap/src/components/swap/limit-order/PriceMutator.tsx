import { useMemo, ReactNode } from "react";
import { Box, Typography, useTheme, BoxProps, TypographyProps } from "components/Mui";
import { Trans } from "@lingui/macro";
import { Flex, Tooltip } from "@icpswap/ui";
import { BigNumber, isNullArgs, nonNullArgs, numToPercent } from "@icpswap/utils";
import { X } from "react-feather";
import { Null } from "@icpswap/types";
import { inputValueFormat } from "utils/swap/limit-order";

const VALUES = [0.1, 0.3, 0.5];
const MIN_STEP = 0.01;

interface MutatorProps {
  children: ReactNode;
  active?: boolean;
  onClick?: BoxProps["onClick"];
  showClose?: boolean;
  onClose?: () => void;
  textSx?: TypographyProps["sx"];
  tips?: ReactNode;
}

function Mutator({ children, active, onClick, showClose, onClose, textSx, tips }: MutatorProps) {
  const theme = useTheme();

  return (
    <Flex
      sx={{
        position: "relative",
        padding: "8px",
        borderRadius: "12px",
        border: active ? `1px solid ${theme.palette.text.default}` : `1px solid ${theme.palette.background.level4}`,
        background: active ? theme.palette.background.level4 : theme.palette.background.level3,
        cursor: "pointer",
        gap: showClose ? "0 16px" : "0",
        userSelect: "none",
        "&:hover": {
          background: active ? theme.palette.background.level4 : theme.palette.background.level2,
        },
      }}
      onClick={onClick}
    >
      {tips ? (
        <Tooltip tips={tips}>
          <Typography
            sx={{ fontWeight: 500, fontSize: "16px", color: active ? "text.primary" : "text.secondary", ...textSx }}
          >
            {children}
          </Typography>
        </Tooltip>
      ) : (
        <Typography
          sx={{ fontWeight: 500, fontSize: "16px", color: active ? "text.primary" : "text.secondary", ...textSx }}
        >
          {children}
        </Typography>
      )}

      {showClose ? (
        <Box
          sx={{
            width: "1px",
            position: "absolute",
            right: "32px",
            top: "-1px",
            height: "34px",
            background: theme.palette.background.level3,
          }}
        />
      ) : null}
      {showClose ? (
        <X
          size={16}
          onClick={(event: React.MouseEvent<SVGElement>) => {
            event.preventDefault();
            event.stopPropagation();
            if (onClose) onClose();
          }}
        />
      ) : null}
    </Flex>
  );
}

export interface PriceMutatorProps {
  inverted?: boolean;
  onMinMax: () => void;
  onChange: (val: number) => void;
  inputValue: string | Null;
  currentPrice: string | Null;
  minUseablePrice: string | Null;
  isInputTokenSorted: boolean | Null;
  minPrice: string | Null;
}

export function PriceMutator({
  inputValue,
  currentPrice,
  inverted,
  isInputTokenSorted,
  onChange,
  onMinMax,
  minPrice,
}: PriceMutatorProps) {
  const theme = useTheme();

  const percent = useMemo(() => {
    if (isNullArgs(currentPrice) || isNullArgs(inputValue) || inputValue === "") return null;
    const invertedCurrentPrice = inverted ? new BigNumber(1).dividedBy(currentPrice).toString() : currentPrice;
    return new BigNumber(inputValue).minus(invertedCurrentPrice).dividedBy(invertedCurrentPrice);
  }, [inputValue, inverted]);

  const activePercent = useMemo(() => {
    if (isNullArgs(percent)) return null;
    if (new BigNumber(percent.abs()).isLessThan(MIN_STEP)) return null;

    const activePercent = inverted
      ? VALUES.find(
          (val) =>
            percent.isLessThan(new BigNumber(`-${val}`).plus(MIN_STEP)) &&
            percent.isGreaterThan(new BigNumber(`-${val}`).minus(MIN_STEP)),
        )
      : percent.isLessThan(MIN_STEP)
      ? null
      : VALUES.find((val) => percent.isLessThan(val + MIN_STEP) && percent.isGreaterThan(val - MIN_STEP));

    return activePercent;
  }, [percent, inverted]);

  const isMinMaxPrice = useMemo(() => {
    if (isNullArgs(inputValue) || isNullArgs(isInputTokenSorted) || isNullArgs(minPrice)) return null;

    const invertedMaxPrice = new BigNumber(1).dividedBy(minPrice).toString();

    return inverted ? inputValueFormat(invertedMaxPrice) === inputValue : inputValueFormat(minPrice) === inputValue;
  }, [minPrice, isInputTokenSorted, inverted, inputValue]);

  const showPercent = useMemo(() => {
    return (
      isNullArgs(activePercent) &&
      nonNullArgs(percent) &&
      !new BigNumber(percent.abs()).isLessThan(MIN_STEP) &&
      nonNullArgs(isMinMaxPrice) &&
      !isMinMaxPrice
    );
  }, [activePercent, isMinMaxPrice, percent]);

  return (
    <Flex gap="0 8px" fullWidth>
      <Mutator
        key="Min"
        onClick={onMinMax}
        onClose={onMinMax}
        active={isNullArgs(activePercent) || (nonNullArgs(isMinMaxPrice) && isMinMaxPrice)}
        showClose={showPercent}
        tips={
          <Trans>
            ICPSwap’s limit orders require a specified minimum or maximum price to ensure the order can be executed as
            intended.
          </Trans>
        }
        textSx={{
          textDecoration: showPercent ? "none" : "underline",
          textDecorationStyle: "dashed",
          textDecorationColor: theme.colors.darkTextSecondary,
          color: "text.primary",
        }}
      >
        {isNullArgs(activePercent) &&
        nonNullArgs(percent) &&
        !new BigNumber(percent.abs()).isLessThan(MIN_STEP) &&
        nonNullArgs(isMinMaxPrice) &&
        !isMinMaxPrice ? (
          `${percent.isGreaterThan(0) ? "+" : ""}${numToPercent(percent.toFixed(2))}`
        ) : inverted ? (
          <Trans>Max</Trans>
        ) : (
          <Trans>Min</Trans>
        )}
      </Mutator>

      {VALUES.map((val) => (
        <Mutator
          key={val}
          onClick={() => onChange(val)}
          active={nonNullArgs(activePercent) && new BigNumber(activePercent).isEqualTo(val)}
        >
          {inverted ? "-" : "+"}
          {numToPercent(val)}
        </Mutator>
      ))}
    </Flex>
  );
}
