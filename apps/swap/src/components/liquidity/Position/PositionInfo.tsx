import { Typography } from "components/Mui";
import { IsSneedOwner, MainCard } from "components/index";
import { shorten } from "@icpswap/utils";
import { Flex, TextButton } from "@icpswap/ui";
import { Position } from "@icpswap/swap-sdk";
import { Trans } from "@lingui/macro";
import { PositionPriceRange, TransferPosition, PositionRangeState } from "components/liquidity/index";
import { usePositionState } from "hooks/liquidity";
import { useIsSneedOwner, useRefreshTriggerManager, useSneedLedger } from "hooks/index";
import { useCallback, useMemo } from "react";
import { Null } from "@icpswap/types";
import { LIQUIDITY_OWNER_REFRESH_KEY } from "constants/index";

interface PositionInfoProps {
  position: Position;
  positionId: string;
  owner: string | Null;
  isOwner: boolean;
}

export function PositionInfo({ position, positionId, isOwner, owner }: PositionInfoProps) {
  const positionState = usePositionState(position);

  const [, setRefreshTrigger] = useRefreshTriggerManager(LIQUIDITY_OWNER_REFRESH_KEY);

  const tokenIds = useMemo(() => {
    return [position.pool.token0.address, position.pool.token1.address];
  }, [position.pool]);

  const sneedLedger = useSneedLedger(tokenIds);
  const isSneed = useIsSneedOwner({ owner, sneedLedger });

  const handleTransferSuccess = useCallback(() => {
    setRefreshTrigger();
  }, [setRefreshTrigger]);

  return (
    <MainCard level={3}>
      <Flex vertical gap="20px 0" align="flex-start">
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
          <Trans>Position Info</Trans>
        </Typography>

        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>Position ID</Trans>
          </Typography>

          <Typography color="text.primary">{positionId}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>Owner</Trans>
          </Typography>

          <Flex gap="0 4px">
            <Typography color="text.primary">{owner ? shorten(owner) : "--"}</Typography>

            <IsSneedOwner isSneed={isSneed} />
          </Flex>
        </Flex>

        {/* <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>APR</Trans>
          </Typography>

          <Typography color="text.primary">145</Typography>
        </Flex> */}

        <Flex fullWidth justify="space-between" align="flex-start">
          <Typography>
            <Trans>Price Range</Trans>
          </Typography>

          <Flex vertical gap="7px 0" align="flex-end">
            <PositionPriceRange position={position} />
            <PositionRangeState state={positionState} />
          </Flex>
        </Flex>

        {isOwner ? (
          <Flex fullWidth>
            <TransferPosition
              position={position}
              positionId={BigInt(positionId)}
              onTransferSuccess={handleTransferSuccess}
            >
              <TextButton sx={{ fontWeight: 500 }}>
                <Trans>Transfer Position</Trans>
              </TextButton>
            </TransferPosition>
          </Flex>
        ) : null}
      </Flex>
    </MainCard>
  );
}
