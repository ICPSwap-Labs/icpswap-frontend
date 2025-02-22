import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import BigNumber from "bignumber.js";

import { Typography } from "./Mui";

export interface ProportionProps {
  value: bigint | number | string | undefined | null;
  align?: "right" | "left" | "inherit" | "center" | "justify" | undefined;
  fontSize?: string;
  fontWeight?: number;
  showArrow?: boolean;
}

function isUp(value: bigint | number | string | undefined | null) {
  return !!value && new BigNumber(Number(value)).isGreaterThan(0);
}

function isDown(value: bigint | number | string | undefined | null) {
  return !!value && new BigNumber(Number(value)).isLessThan(0);
}

function isZero(value: bigint | number | string | undefined | null) {
  return (!!value || value === BigInt(0) || value === 0) && new BigNumber(Number(value)).isEqualTo(0);
}

enum ProportionType {
  UP = "up",
  DOWN = "down",
  EQUAL = "equal",
}

const Colors = {
  [ProportionType.UP]: "#54C081",
  [ProportionType.DOWN]: "#D3625B",
  [ProportionType.EQUAL]: "#ffffff",
};

interface ProportionIconProps {
  type: ProportionType;
}

function ProportionIcon({ type }: ProportionIconProps) {
  return type === ProportionType.DOWN ? (
    <ArrowUpwardIcon sx={{ transform: "rotate(180deg)", width: "12px", height: "12px" }} />
  ) : type === ProportionType.UP ? (
    <ArrowUpwardIcon sx={{ width: "12px", height: "12px" }} />
  ) : null;
}

export function Proportion({ value, fontSize, showArrow = true, ...props }: ProportionProps) {
  const type = isUp(value) ? ProportionType.UP : isDown(value) ? ProportionType.DOWN : ProportionType.EQUAL;
  const proportion = isZero(value) ? "0.00%" : value ? `${new BigNumber(Number(value)).toFixed(2)}%` : undefined;

  return (
    <Typography
      color={Colors[type]}
      sx={{
        fontWeight: props.fontWeight ?? 500,
        display: "flex",
        alignItems: "center",
        justifyContent: props.align === "right" ? "flex-end" : "flex-start",
        fontSize: fontSize ?? "inherit",
      }}
    >
      {proportion ? (
        <>
          {showArrow ? <ProportionIcon type={type} /> : null} {proportion}
        </>
      ) : (
        "--"
      )}
    </Typography>
  );
}
