import { useMemo, ReactNode } from "react";
import { Box, Typography, useTheme, BoxProps } from "components/Mui";
import { Trans } from "@lingui/macro";
import { Flex } from "@icpswap/ui";
import { BigNumber, isNullArgs, nonNullArgs, numToPercent } from "@icpswap/utils";
import { X } from "react-feather";
import { Null } from "@icpswap/types";

const VALUES = [0.01, 0.05, 0.1, 0.5];
const MIN_STEP = 0.01;

interface MutatorProps {
  children: ReactNode;
  active?: boolean;
  onClick?: BoxProps["onClick"];
  showClose?: boolean;
  onClose?: () => void;
}

function Mutator({ children, active, onClick, showClose, onClose }: MutatorProps) {
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
      <Typography sx={{ fontWeight: 500, fontSize: "16px", color: active ? "text.primary" : "text.secondary" }}>
        {children}
      </Typography>
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
}

export function PriceMutator({ inputValue, inverted, onChange, onMinMax, minUseablePrice }: PriceMutatorProps) {
  const percent = useMemo(() => {
    if (isNullArgs(minUseablePrice) || isNullArgs(inputValue) || inputValue === "") return null;
    const invertedCurrentPrice = inverted ? new BigNumber(1).dividedBy(minUseablePrice).toString() : minUseablePrice;

    return new BigNumber(inputValue).minus(invertedCurrentPrice).dividedBy(invertedCurrentPrice);
  }, [minUseablePrice, inputValue, inverted]);

  const activePercent = useMemo(() => {
    if (isNullArgs(percent)) return null;
    if (new BigNumber(percent.abs()).isLessThan(MIN_STEP)) return null;

    const activePercent = inverted
      ? VALUES.find(
          (val) =>
            new BigNumber(percent).isLessThan(new BigNumber(`-${val}`).plus(MIN_STEP)) &&
            new BigNumber(percent).isGreaterThan(new BigNumber(`-${val}`).minus(MIN_STEP)),
        )
      : new BigNumber(percent).isLessThan(MIN_STEP)
      ? null
      : VALUES.find(
          (val) =>
            new BigNumber(percent).isLessThan(val + MIN_STEP) && new BigNumber(percent).isGreaterThan(val - MIN_STEP),
        );

    return activePercent;
  }, [percent, inverted]);

  return (
    <Flex gap="0 8px" fullWidth>
      <Mutator
        key="Min"
        onClick={onMinMax}
        active={isNullArgs(activePercent)}
        showClose={
          isNullArgs(activePercent) && nonNullArgs(percent) && !new BigNumber(percent.abs()).isLessThan(MIN_STEP)
        }
        onClose={onMinMax}
      >
        {isNullArgs(activePercent) && nonNullArgs(percent) && !new BigNumber(percent.abs()).isLessThan(MIN_STEP) ? (
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
