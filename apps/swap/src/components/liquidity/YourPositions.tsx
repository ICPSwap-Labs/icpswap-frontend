import { useContext, useEffect, useCallback } from "react";
import { Box, Button } from "components/Mui";
import { PositionCard } from "components/liquidity/index";
import { usePosition } from "hooks/swap/usePosition";
import { NoData, LoadingRow, Flex } from "components/index";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useUserAllPositions } from "hooks/swap/useUserAllPositions";
import { PositionFilterState, PositionSort, UserPosition } from "types/swap";
import { useInitialUserPositionPools } from "store/hooks";
import { PositionContext } from "components/swap/index";
import { useSortedPositions } from "hooks/swap/index";
import { useHistory } from "react-router-dom";
import { useAvailableFarmsForPool } from "hooks/staking-farm";
import { useIsLimitOrder } from "hooks/swap/limit-order";
import { useTranslation } from "react-i18next";
import { useRefreshTrigger } from "hooks/index";
import { LIQUIDITY_OWNER_REFRESH_KEY } from "constants/index";

interface PositionItemProps {
  position: UserPosition;
  filterState: PositionFilterState;
  sort: PositionSort;
}

function PositionItem({ position: positionDetail, filterState, sort }: PositionItemProps) {
  const { position } = usePosition({
    poolId: positionDetail.id,
    tickLower: positionDetail.tickLower,
    tickUpper: positionDetail.tickUpper,
    liquidity: positionDetail.liquidity,
  });

  const availableFarmsForPool = useAvailableFarmsForPool({ poolId: position?.pool.id });

  const isLimit = useIsLimitOrder({ poolId: position?.pool.id, positionId: positionDetail.index });

  return (
    <PositionCard
      farmId={availableFarmsForPool ? availableFarmsForPool[0] : undefined}
      position={position}
      positionId={BigInt(positionDetail.index)}
      showButtons
      filterState={filterState}
      sort={sort}
      isLimit={isLimit}
      staked={false}
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

  const { setAllPositions, allPositionsUSDValue, positionFees } = useContext(PositionContext);

  const refreshTrigger = useRefreshTrigger(LIQUIDITY_OWNER_REFRESH_KEY);

  const { loading: initialUserPositionPoolsLoading } = useInitialUserPositionPools();
  const { result: positions, loading } = useUserAllPositions(refreshTrigger);

  useEffect(() => {
    setAllPositions(positions);
  }, [positions, setAllPositions]);

  const sortedPositions = useSortedPositions<UserPosition>({
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
            key={`${position.id}_${position.index}`}
            position={position}
            filterState={filterState}
            sort={sort}
          />
        ))}
      </Box>
    </>
  );
}
