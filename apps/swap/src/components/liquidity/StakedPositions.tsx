import { useContext, useEffect, useCallback, useMemo } from "react";
import { Box, Button } from "components/Mui";
import { PositionCardForFarm } from "components/liquidity/index";
import { usePosition } from "hooks/swap/usePosition";
import { NoData, LoadingRow, Flex } from "components/index";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useSwapPositionsMultipleFarm, useSortedPositions, useMultiplePositionsFee } from "hooks/swap/index";
import { PositionContext } from "components/swap/index";
import { useUserAllFarmsInfo } from "hooks/staking-farm/index";
import { PositionFilterState, PositionSort, type UserPositionForFarm } from "types/swap";
import { useHistory } from "react-router-dom";
import { TopLiveFarms } from "components/farm/TopLiveFarms";
import { useTranslation } from "react-i18next";
import { getPositionFeeKey } from "utils/swap";

interface PositionItemProps {
  position: UserPositionForFarm;
  filterState: PositionFilterState;
  sort: PositionSort;
  fee: { fee0: bigint; fee1: bigint } | undefined;
}

function PositionItem({
  position: { poolId, position: __position, farm, positionId },
  filterState,
  sort,
  fee,
}: PositionItemProps) {
  const { position } = usePosition({
    poolId,
    tickLower: __position.tickLower,
    tickUpper: __position.tickUpper,
    liquidity: __position.liquidity,
  });

  return (
    <PositionCardForFarm
      farmInfo={farm}
      position={position}
      positionId={positionId}
      showButtons
      staked
      filterState={filterState}
      sort={sort}
      fee={fee}
    />
  );
}

interface StakedPositionsProps {
  filterState: PositionFilterState;
  sort: PositionSort;
  hiddenNumbers: number;
}

export function StakedPositions({ filterState, sort, hiddenNumbers }: StakedPositionsProps) {
  const { t } = useTranslation();
  const history = useHistory();
  const principal = useAccountPrincipalString();

  const { refreshTrigger, setAllStakedPositions, positionFees, allPositionsUSDValue } = useContext(PositionContext);

  const { result: allFarms, loading: farmsLoading } = useUserAllFarmsInfo();
  const { result: positions, loading } = useSwapPositionsMultipleFarm(allFarms, refreshTrigger);

  const positionsFeeArgs = useMemo(() => {
    if (!positions) return undefined;

    return positions.reduce(
      (prev: Array<{ poolId: string; positionIds: bigint[] }>, curr: UserPositionForFarm) => {
        const existIndex = prev.findIndex(({ poolId }) => poolId === curr.poolId);

        if (existIndex === -1)
          return [...prev, { poolId: curr.poolId, positionIds: [curr.positionId] }] as Array<{
            poolId: string;
            positionIds: bigint[];
          }>;

        const existData = prev[existIndex];
        const existNewData = { poolId: existData.poolId, positionIds: [...existData.positionIds, curr.positionId] };

        prev.splice(existIndex, 1, existNewData);

        return prev;
      },
      [] as Array<{ poolId: string; positionIds: bigint[] }>,
    );
  }, [positions]);

  const multiplePositionsFee = useMultiplePositionsFee({ data: positionsFeeArgs });

  useEffect(() => {
    setAllStakedPositions(positions);
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
              {t("farm.your.liquidity")}
            </Button>
          </Flex>

          <Box sx={{ margin: "32px 0 0 0" }}>
            <TopLiveFarms noWrapper />
          </Box>
        </Box>
      ) : null}
      <Box>
        {sortedPositions.map((element) => (
          <PositionItem
            key={`${element.poolId}_${element.positionId}`}
            position={element}
            filterState={filterState}
            sort={sort}
            fee={
              multiplePositionsFee
                ? multiplePositionsFee[getPositionFeeKey(element.poolId, element.positionId)]
                : undefined
            }
          />
        ))}
      </Box>
    </>
  );
}
