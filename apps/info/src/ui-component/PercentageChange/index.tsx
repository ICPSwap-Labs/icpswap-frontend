import { Typography, TypographyProps } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import BigNumber from "bignumber.js";
import { Override } from "@icpswap/types";

export type PercentageChangeLabelProps = Override<
  TypographyProps,
  {
    value: bigint | number | string | undefined | null;
    brackets?: boolean;
    align?: "right" | "left" | "inherit" | "center" | "justify" | undefined;
  }
>;

function isUp(value: bigint | number | string | undefined | null) {
  return !!value && new BigNumber(Number(value)).isGreaterThan(0);
}

function isDown(value: bigint | number | string | undefined | null) {
  return !!value && new BigNumber(Number(value)).isLessThan(0);
}

function isZero(value: bigint | number | string | undefined | null) {
  return (!!value || value === BigInt(0) || value === 0) && new BigNumber(Number(value)).isEqualTo(0);
}

const colors = {
  upper: {
    color: "#54C081",
    icon: <ArrowUpwardIcon sx={{ width: "12px", height: "12px" }} />,
  },
  lower: {
    color: "#D3625B",
    icon: <ArrowUpwardIcon sx={{ transform: "rotate(180deg)", width: "12px", height: "12px" }} />,
  },
  equal: {
    color: "#ffffff",
    icon: null,
  },
};

export default function PercentageChangeLabel({ value, brackets, ...props }: PercentageChangeLabelProps) {
  const item = isUp(value) ? colors.upper : isDown(value) ? colors.lower : colors.equal;
  const _v = isZero(value) ? "0.00%" : value ? `${new BigNumber(Number(value)).toFixed(2)}%` : undefined;

  const Icon = () => {
    return item.icon;
  };

  return (
    <Typography
      color={item.color}
      sx={{
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: props.align === "right" ? "flex-end" : "flex-start",
      }}
    >
      {_v ? (
        brackets ? (
          <>
            (<Icon /> {_v})
          </>
        ) : (
          <>
            <Icon /> {_v}
          </>
        )
      ) : (
        "--"
      )}
    </Typography>
  );
}
