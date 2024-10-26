import { useCallback, useEffect, useMemo } from "react";
import { BigNumber, formatDollarAmount, isNullArgs, nonNullArgs, mockALinkAndOpen } from "@icpswap/utils";
import { ArrowUpRight } from "react-feather";
import { Position } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { INFO_URL, FREE_LIQUIDITY_NAME } from "@icpswap/constants";

import { Box, Typography, useTheme } from "../Mui";
import { Image } from "../Image";
import { Flex } from "../Grid/Flex";

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

  const handleLoadToInfo = useCallback(() => {
    if (!poolId) return;

    if (name === FREE_LIQUIDITY_NAME) {
      mockALinkAndOpen(`${INFO_URL}/swap-scan/positions?pair=${poolId}`, "liquidity-locks");
      return;
    }

    if (name === "Black Hole") {
      mockALinkAndOpen(`${INFO_URL}/swap-scan/positions?pair=${poolId}&principal=aaaaa-aa`, "liquidity-locks");
      return;
    }

    mockALinkAndOpen(`${INFO_URL}/swap-scan/positions?pair=${poolId}&principal=${principalId}`, "liquidity-locks");
  }, [name, principalId, poolId]);

  return (
    <Flex gap="0 6px" sx={{ cursor: "pointer", display: hidden ? "none" : "flex" }} onClick={handleLoadToInfo}>
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
    </Flex>
  );
}
