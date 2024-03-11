import { useEffect, useMemo, useState } from "react";
import { Typography, Box, Grid } from "@mui/material";
import PositionItemComponent from "components/swap/PositionItem";
import { usePosition } from "hooks/swap/usePosition";
import { Trans } from "@lingui/macro";
import { NoData, MainCard, LoadingRow, TextButton, FindPositionsModal } from "components/index";
import BigNumber from "bignumber.js";
import { useAccountPrincipalString } from "store/auth/hooks";
import PositionContext from "components/swap/PositionContext";
import { useUserAllPositions } from "hooks/swap/useUserAllPositions";
import { UserPosition } from "types/swap";
import { useInitialUserPositionPools } from "store/hooks";
import { formatDollarAmount } from "@icpswap/utils";

function hasLiquidity(position: UserPosition | undefined) {
  return position?.liquidity?.toString() !== "0";
}

interface PositionItemProps {
  position: UserPosition;
}

function PositionItem({ position: positionDetail }: PositionItemProps) {
  const { position } = usePosition({
    poolId: positionDetail.id,
    tickLower: positionDetail.tickLower,
    tickUpper: positionDetail.tickUpper,
    liquidity: positionDetail.liquidity,
  });

  const noLiquidity = !hasLiquidity(positionDetail);

  return noLiquidity ? null : (
    <PositionItemComponent
      closed={noLiquidity}
      position={position}
      positionId={BigInt(positionDetail.index)}
      showButtons
    />
  );
}

export default function Positions() {
  const principal = useAccountPrincipalString();

  const [findPositionsOpen, setFindPositionsOpen] = useState(false);
  const [allPositionsUSDKeyValue, setAllPositionsUSDValue] = useState<
    { [id: string]: BigNumber | undefined } | undefined
  >({});
  const [counter, setCounter] = useState<number>(0);

  const { result: positions, loading } = useUserAllPositions(counter);

  const { loading: initialUserPositionPoolsLoading } = useInitialUserPositionPools();

  const hasLiquidityPositions = useMemo(() => {
    return positions.filter((position) => hasLiquidity(position)).length !== 0;
  }, [positions]);

  const handleAllPositionsUSDValue = (id: string, usdValue: BigNumber) => {
    setAllPositionsUSDValue((prevState) => ({
      ...prevState,
      [id]: usdValue,
    }));
  };

  // reset all positions usd value when account change
  useEffect(() => {
    setAllPositionsUSDValue(undefined);
  }, [principal]);

  const updateCounter = () => {
    setCounter(counter + 1);
  };

  const allPositionsUSDValue = useMemo(() => {
    if (!allPositionsUSDKeyValue) return undefined;

    return Object.values(allPositionsUSDKeyValue).reduce((prev, curr) => {
      return prev?.plus(curr ?? 0);
    }, new BigNumber(0));
  }, [allPositionsUSDKeyValue]);

  return (
    <PositionContext.Provider
      value={{ allPositionsUSDValue, setAllPositionsUSDValue: handleAllPositionsUSDValue, counter, updateCounter }}
    >
      <MainCard level={1} className="lightGray200">
        <Typography variant="h3" color="textPrimary">
          <Trans>Your Positions</Trans>
        </Typography>

        <Box mt="5px" mb="10px">
          <Typography component="span">
            <Trans>Total Value:</Trans>&nbsp;
          </Typography>
          <Typography component="span" color="text.primary">
            {allPositionsUSDValue ? formatDollarAmount(allPositionsUSDValue.toString()) : "--"}
          </Typography>
        </Box>

        <Box mt="5px" mb="10px">
          <Typography component="span">
            <Trans>Don't see a pair you joined?</Trans>&nbsp;
          </Typography>
          <TextButton onClick={() => setFindPositionsOpen(true)}>
            <Trans>Find other positions</Trans>
          </TextButton>
        </Box>

        {(loading || initialUserPositionPoolsLoading) && !!principal ? (
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
            {!hasLiquidityPositions || positions?.length === 0 ? (
              <Box mt={2}>
                <NoData />
              </Box>
            ) : null}
            <Box>
              {positions.map((position) => (
                <PositionItem key={`${position.id}_${position.index}`} position={position} />
              ))}
            </Box>
          </>
        )}
      </MainCard>

      <FindPositionsModal open={findPositionsOpen} onClose={() => setFindPositionsOpen(false)} />
    </PositionContext.Provider>
  );
}
