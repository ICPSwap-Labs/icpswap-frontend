import { Typography, BoxProps, useTheme } from "components/Mui";
import { Flex, Tooltip, BodyCell } from "@icpswap/ui";
import { useMemo } from "react";
import { usePositionsTotalValue } from "hooks/swap/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { formatDollarAmount } from "@icpswap/utils";
import { useSwapUserPositions, useSwapPoolMetadata } from "@icpswap/hooks";
import type { FarmInfo, Null, FarmState, InitFarmArgs } from "@icpswap/types";
import dayjs from "dayjs";
import { FilterState } from "types/staking-farm";
import { useTranslation } from "react-i18next";

const DAYJS_FORMAT0 = "MMMM D, YYYY";
const DAYJS_FORMAT1 = "h:mm A";

interface AvailableCellProps {
  farmId: string;
  wrapperSx?: BoxProps["sx"];
  showState: boolean;
  your?: boolean;
  filterState: FilterState;
  farmInfo: FarmInfo | Null;
  state: FarmState;
  initArgs: InitFarmArgs | Null;
}

export function AvailableCell({ initArgs, state, farmInfo }: AvailableCellProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const principal = useAccountPrincipal();

  const poolId = farmInfo?.pool.toString();

  const { result: userAllPositions } = useSwapUserPositions(poolId, principal?.toString());
  const { result: poolMetadata } = useSwapPoolMetadata(poolId);

  const userAvailablePositions = useMemo(() => {
    if (!userAllPositions || !initArgs || !poolMetadata) return undefined;

    if (initArgs.priceInsideLimit === false) {
      return userAllPositions.filter((position) => position.liquidity !== BigInt(0));
    }

    return userAllPositions
      .filter((position) => position.liquidity !== BigInt(0))
      .filter((position) => {
        const outOfRange = poolMetadata.tick < position.tickLower || poolMetadata.tick >= position.tickUpper;
        return !outOfRange;
      });
  }, [userAllPositions, initArgs, poolMetadata, state]);

  const allAvailablePositionValue = usePositionsTotalValue({
    metadata: poolMetadata,
    positionInfos: userAvailablePositions,
  });

  return (
    <Flex gap="0 4px" justify="flex-end" className="row-item">
      <>
        <BodyCell>{allAvailablePositionValue ? formatDollarAmount(allAvailablePositionValue) : "--"}</BodyCell>
        {userAvailablePositions ? (
          <Typography
            fontSize={12}
            fontWeight={500}
            color="text.primary"
            sx={{
              width: "fit-content",
              background: theme.palette.background.level4,
              padding: "2px 8px",
              borderRadius: "44px",
            }}
          >
            {userAvailablePositions.length}
          </Typography>
        ) : null}

        {state === "NOT_STARTED" && farmInfo ? (
          <Tooltip
            tips={t("farm.not_start.descriptions", {
              liveTime0: dayjs(Number(farmInfo.startTime) * 1000).format(DAYJS_FORMAT0),
              liveTime1: dayjs(Number(farmInfo.startTime) * 1000).format(DAYJS_FORMAT1),
            })}
            iconSize="14px"
          />
        ) : null}
      </>
    </Flex>
  );
}
