import { useContext, useEffect, useCallback, useMemo } from "react";
import { Box, Button } from "components/Mui";
import { PositionCard } from "components/liquidity/index";
import { usePosition } from "hooks/swap/usePosition";
import { NoData, LoadingRow, Flex } from "components/index";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useUserAllPositions } from "hooks/swap/useUserAllPositions";
import { PositionFilterState, PositionSort, UserPositionByList } from "types/swap";
import { useInitialUserPositionPools } from "store/hooks";
import { PositionContext } from "components/swap/index";
import { useMultiplePositionsFee, useSortedPositions } from "hooks/swap/index";
import { useHistory } from "react-router-dom";
import { useAvailableFarmsForPool } from "hooks/staking-farm";
import { useIsLimitOrder } from "hooks/swap/limit-order";
import { useTranslation } from "react-i18next";
import { getPositionFeeKey } from "utils/swap";
import { useRefreshTrigger } from "hooks/index";
import { POSITIONS_FEES_REFRESH_KEY } from "constants/liquidity";

interface PositionItemProps {
  position: UserPositionByList;
  filterState: PositionFilterState;
  sort: PositionSort;
  fee: { fee0: bigint; fee1: bigint } | undefined;
}

function PositionItem({ position: positionDetail, filterState, sort, fee }: PositionItemProps) {
  const { position } = usePosition({
    poolId: positionDetail.poolId,
    tickLower: positionDetail.position.tickLower,
    tickUpper: positionDetail.position.tickUpper,
    liquidity: positionDetail.position.liquidity,
  });

  const availableFarmsForPool = useAvailableFarmsForPool({ poolId: position?.pool.id });

  const isLimit = useIsLimitOrder({ poolId: position?.pool.id, positionId: positionDetail.position.id });

  return (
    <PositionCard
      farmId={availableFarmsForPool ? availableFarmsForPool[0] : undefined}
      position={position}
      positionId={BigInt(positionDetail.position.id)}
      showButtons
      filterState={filterState}
      sort={sort}
      isLimit={isLimit}
      staked={false}
      fee={fee}
    />
  );
}

interface YourPositionsProps {
  filterState: PositionFilterState;
  sort: PositionSort;
  hiddenNumbers: number;
}

export function YourPositions({ filterState, sort, hiddenNumbers }: YourPositionsProps) {
  const { t } = useTranslation();
  const history = useHistory();
  const principal = useAccountPrincipalString();

  const { refreshTrigger, setAllPositions, allPositionsUSDValue, positionFees } = useContext(PositionContext);
  const positionFeesRefreshTrigger = useRefreshTrigger(POSITIONS_FEES_REFRESH_KEY);

  const { loading: initialUserPositionPoolsLoading } = useInitialUserPositionPools();
  const { result: positions, loading } = useUserAllPositions(refreshTrigger);

  const positionsFeeArgs = useMemo(() => {
    if (!positions) return undefined;

    return positions.reduce(
      (prev: Array<{ poolId: string; positionIds: bigint[] }>, curr: UserPositionByList) => {
        const existIndex = prev.findIndex(({ poolId }) => poolId === curr.poolId);

        if (existIndex === -1)
          return [...prev, { poolId: curr.poolId, positionIds: [curr.position.id] }] as Array<{
            poolId: string;
            positionIds: bigint[];
          }>;

        const existData = prev[existIndex];
        const existNewData = { poolId: existData.poolId, positionIds: [...existData.positionIds, curr.position.id] };

        prev.splice(existIndex, 1, existNewData);

        return prev;
      },
      [] as Array<{ poolId: string; positionIds: bigint[] }>,
    );
  }, [positions]);

  const multiplePositionsFee = useMultiplePositionsFee({ data: positionsFeeArgs, refresh: positionFeesRefreshTrigger });

  useEffect(() => {
    setAllPositions(positions);
  }, [positions, setAllPositions]);

  const sortedPositions = useSortedPositions<UserPositionByList>({
    positions,
    positionValue: allPositionsUSDValue,
    feesValue: positionFees,
    sort,
  });

  const handleAddLiquidity = useCallback(() => {
    return history.push(`/liquidity/add?path=${window.btoa(`/liquidity?tab=Positions`)}`);
  }, [history]);

  return (loading || initialUserPositionPoolsLoading) && !!principal ? (
    <LoadingRow>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </LoadingRow>
  ) : (
    <>
      {sortedPositions.length === 0 || hiddenNumbers === sortedPositions.length ? (
        <Box mt={2}>
          <NoData />
          <Flex fullWidth justify="center">
            <Button size="large" sx={{ width: "240px" }} variant="contained" onClick={handleAddLiquidity}>
              {t("swap.add.liquidity")}
            </Button>
          </Flex>
        </Box>
      ) : null}

      <Box>
        {sortedPositions.map((position) => (
          <PositionItem
            key={`${position.poolId}_${position.position.id.toString()}`}
            position={position}
            filterState={filterState}
            sort={sort}
            fee={
              multiplePositionsFee
                ? multiplePositionsFee[getPositionFeeKey(position.poolId, position.position.id)]
                : undefined
            }
          />
        ))}
      </Box>
    </>
  );
}
