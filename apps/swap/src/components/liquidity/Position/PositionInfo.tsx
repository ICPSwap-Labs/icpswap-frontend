import { Typography } from "components/Mui";
import { MainCard } from "components/index";
import { principalToAccount, shorten } from "@icpswap/utils";
import { Flex, TextButton, Image } from "@icpswap/ui";
import { Position } from "@icpswap/swap-sdk";
import { Trans } from "@lingui/macro";
import { useSwapPositionOwner, useLiquidityLockIds } from "@icpswap/hooks";
import { PositionPriceRange, TransferPosition, PositionRangeState } from "components/liquidity/index";
import { usePositionState } from "hooks/liquidity";
import { useMemo } from "react";

interface PositionInfoProps {
  position: Position;
  positionId: string;
}

export function PositionInfo({ position, positionId }: PositionInfoProps) {
  const positionState = usePositionState(position);

  const tokenIds = useMemo(() => {
    return [position.pool.token0.address, position.pool.token1.address];
  }, [position.pool]);

  const { result: locksIds } = useLiquidityLockIds(tokenIds);
  const { result: owner } = useSwapPositionOwner(position.pool.id, BigInt(positionId));

  const sneedLedger = useMemo(() => {
    if (!locksIds) return undefined;
    return locksIds.find((e) => e.alias[0] === "Sneedlocked")?.ledger_id.toString();
  }, [locksIds]);

  const isSneed = useMemo(() => {
    if (!owner || !sneedLedger) return false;

    return principalToAccount(sneedLedger) === owner;
  }, [sneedLedger, owner]);

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
            <Typography color="text.primary">{shorten(owner)}</Typography>
            {isSneed ? <Image src="/images/sneed.svg" alt="" style={{ width: "18px", height: "18px" }} /> : null}
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

        <Flex fullWidth>
          <TransferPosition position={position} positionId={BigInt(positionId)}>
            <TextButton sx={{ fontWeight: 500 }}>
              <Trans>Transfer Position</Trans>
            </TextButton>
          </TransferPosition>
        </Flex>
      </Flex>
    </MainCard>
  );
}
