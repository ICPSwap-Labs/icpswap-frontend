import { useEffect, useMemo } from "react";
import { BigNumber, formatDollarAmount, isNullArgs, nonNullArgs } from "@icpswap/utils";
import { ArrowUpRight } from "react-feather";
import { Position } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { INFO_URL, FREE_LIQUIDITY_NAME } from "@icpswap/constants";

import { Box, Typography, useTheme } from "../Mui";
import { Image } from "../Image";
import { Flex } from "../Grid/Flex";
import { Tooltip } from "../Tooltip";
import { Link } from "../Link";

export interface LiquidityLockProps {
  name: string;
  principalId?: string;
  poolTvlValue: string | Null;
  positions?: Position[] | Null;
  hidden?: boolean;
  setLocksValue?: (name: string, value: string) => void;
  positionsValue?: string | Null;
  poolId: string | Null;
  lockImage: string | undefined;
}

export function LiquidityLock({
  name,
  principalId,
  poolTvlValue,
  setLocksValue,
  hidden = false,
  positionsValue,
  poolId,
  lockImage,
}: LiquidityLockProps) {
  const theme = useTheme();

  const percent = useMemo(() => {
    if (!poolTvlValue || isNullArgs(positionsValue)) return undefined;

    return new BigNumber(positionsValue ?? 0).dividedBy(poolTvlValue).multipliedBy(100).toFixed(2);
  }, [poolTvlValue, positionsValue]);

  useEffect(() => {
    if (name && nonNullArgs(positionsValue)) {
      if (setLocksValue) setLocksValue(name, positionsValue ?? "0");
    }
  }, [setLocksValue, positionsValue, name]);

  const infoUrl = useMemo(() => {
    if (isNullArgs(poolId)) return null;

    if (name === FREE_LIQUIDITY_NAME) {
      return `${INFO_URL}/info-tools/positions?pair=${poolId}`;
    }
    if (name === "Black Hole") {
      return `${INFO_URL}/info-tools/positions?pair=${poolId}&principal=aaaaa-aa`;
    }

    return `${INFO_URL}/info-tools/positions?pair=${poolId}&principal=${principalId}`;
  }, [poolId, principalId, name]);

  return (
    <Box sx={{ display: hidden ? "none" : "block" }}>
      <Link link={infoUrl}>
        <Flex gap="0 6px">
          {lockImage ? (
            <Image src={lockImage} sx={{ width: "18px", height: "18px" }} />
          ) : (
            <Box
              sx={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
              }}
            />
          )}

          <Flex gap="0 4px">
            <Typography sx={{ fontSize: "12px" }}>{name}</Typography>
            <Typography sx={{ fontSize: "12px" }} color="text.success">
              {percent ? `${percent}%` : "--"}
            </Typography>
            <Typography sx={{ fontSize: "12px" }} color="text.success">
              ({nonNullArgs(positionsValue) ? formatDollarAmount(positionsValue) : "--"})
            </Typography>
          </Flex>

          <ArrowUpRight size={16} color={theme.colors.secondaryMain} />

          {name === "Sneedlocked" ? (
            <Tooltip
              iconSize="12px"
              tips={
                <Box>
                  <Typography
                    sx={{
                      color: "#111936",
                      fontSize: "12px",
                      lineHeight: "18px",
                      margin: "0 3px 0 0",
                    }}
                    component="span"
                  >
                    The position is locked in Sneed. Click to redirect to the official website for more details.
                  </Typography>
                  <Link link="https://sneeddao.com/#sneedlock" color="secondary">
                    https://sneeddao.com/#sneedlock
                  </Link>
                </Box>
              }
            />
          ) : null}
        </Flex>
      </Link>
    </Box>
  );
}
