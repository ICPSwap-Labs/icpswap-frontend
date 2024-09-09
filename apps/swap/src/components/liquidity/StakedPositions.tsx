import { useContext, useEffect, useCallback } from "react";
import { Box, Button } from "components/Mui";
import { PositionCardForFarm } from "components/liquidity/index";
import { usePosition } from "hooks/swap/usePosition";
import { NoData, LoadingRow, Flex } from "components/index";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useSwapPositionsMultipleFarm, useSortedPositions } from "hooks/swap/index";
import PositionContext from "components/swap/PositionContext";
import { useUserAllFarmsInfo } from "hooks/staking-farm/index";
import { PositionFilterState, PositionSort, type UserPositionForFarm } from "types/swap";
import { Trans } from "@lingui/macro";
import { useHistory } from "react-router-dom";
import { TopLiveFarms } from "components/farm/TopLiveFarms";

interface PositionItemProps {
  position: UserPositionForFarm;
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

  return (
    <PositionCardForFarm
      farmInfo={positionDetail.farm}
      position={position}
      positionId={BigInt(positionDetail.index)}
      showButtons
      staked
      filterState={filterState}
      sort={sort}
    />
  );
}

interface StakedPositionsProps {
  filterState: PositionFilterState;
  sort: PositionSort;
  hiddenNumbers: number;
}

export function StakedPositions({ filterState, sort, hiddenNumbers }: StakedPositionsProps) {
  const history = useHistory();
  const principal = useAccountPrincipalString();

  const { refreshTrigger, setAllStakedPositions, positionFees, allPositionsUSDValue } = useContext(PositionContext);

  const { result: allFarms, loading: farmsLoading } = useUserAllFarmsInfo();
  const { result: positions, loading } = useSwapPositionsMultipleFarm(allFarms, refreshTrigger);

  useEffect(() => {
    if (positions) {
      setAllStakedPositions(positions);
    }
  }, [positions, setAllStakedPositions]);

  const sortedPositions = useSortedPositions<UserPositionForFarm>({
    positions,
    positionValue: allPositionsUSDValue,
    feesValue: positionFees,
    sort,
  });

  const handleAddLiquidity = useCallback(() => {
    return history.push("/farm");
  }, [history]);

  return (loading || farmsLoading) && !!principal ? (
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
              <Trans>Farm Your Liquidity</Trans>
            </Button>
          </Flex>

          <Box sx={{ margin: "32px 0 0 0" }}>
            <TopLiveFarms noWrapper />
          </Box>
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
