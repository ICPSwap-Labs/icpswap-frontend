import { useMemo, useContext, useEffect, useCallback } from "react";
import { Box, Button } from "components/Mui";
import { PositionCard } from "components/liquidity/index";
import { usePosition } from "hooks/swap/usePosition";
import { NoData, LoadingRow, Flex } from "components/index";
import { useAccountPrincipal, useAccountPrincipalString } from "store/auth/hooks";
import { useUserAllPositions } from "hooks/swap/useUserAllPositions";
import { PositionFilterState, PositionSort, UserPosition } from "types/swap";
import { useInitialUserPositionPools } from "store/hooks";
import PositionContext from "components/swap/PositionContext";
import { useFarmsByFilter, useUserLimitOrders } from "@icpswap/hooks";
import { useSortedPositions } from "hooks/swap/index";
import { Trans } from "@lingui/macro";
import { useHistory } from "react-router-dom";

interface PositionItemProps {
  position: UserPosition;
  filterState: PositionFilterState;
  sort: PositionSort;
}

function PositionItem({ position: positionDetail, filterState, sort }: PositionItemProps) {
  const principal = useAccountPrincipal();

  const { position } = usePosition({
    poolId: positionDetail.id,
    tickLower: positionDetail.tickLower,
    tickUpper: positionDetail.tickUpper,
    liquidity: positionDetail.liquidity,
  });

  const { result: farms } = useFarmsByFilter({
    pair: position?.pool.id,
    state: "LIVE",
    token: undefined,
    user: undefined,
  });

  const { result: userLimitOrdersResult } = useUserLimitOrders(position?.pool.id, principal?.toString());

  const userLimitOrders = useMemo(() => {
    if (!userLimitOrdersResult) return undefined;
    return userLimitOrdersResult.lowerLimitOrderIds.concat(userLimitOrdersResult.upperLimitOrdersIds);
  }, [userLimitOrdersResult]);

  const availableStakedFarm = useMemo(() => {
    if (!farms) return undefined;
    return farms[0]?.toString();
  }, [farms]);

  const isLimit = useMemo(() => {
    return userLimitOrders ? !!userLimitOrders.find((e) => e.userPositionId === BigInt(positionDetail.index)) : false;
  }, [userLimitOrders, positionDetail]);

  return !isLimit ? (
    <PositionCard
      farmId={availableStakedFarm}
      position={position}
      positionId={BigInt(positionDetail.index)}
      showButtons
      filterState={filterState}
      sort={sort}
      isLimit={
        userLimitOrders ? !!userLimitOrders.find((e) => e.userPositionId === BigInt(positionDetail.index)) : false
      }
    />
  ) : null;
}

interface YourPositionsProps {
  filterState: PositionFilterState;
  sort: PositionSort;
  hiddenNumbers: number;
}

export function YourPositions({ filterState, sort, hiddenNumbers }: YourPositionsProps) {
  const history = useHistory();
  const principal = useAccountPrincipalString();

  const { refreshTrigger, setAllPositions, allPositionsUSDValue, positionFees } = useContext(PositionContext);

  const { loading: initialUserPositionPoolsLoading } = useInitialUserPositionPools();
  const { result: positions, loading } = useUserAllPositions(refreshTrigger);

  useEffect(() => {
    if (positions) {
      setAllPositions(positions);
    }
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
              <Trans>Add Liquidity</Trans>
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
