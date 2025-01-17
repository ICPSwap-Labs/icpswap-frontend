import { useParams } from "react-router-dom";
import { LoadingRow, Flex, FeeTierPercentLabel } from "@icpswap/ui";
import { principalToAccount } from "@icpswap/utils";
import { useSwapPositionOwner } from "@icpswap/hooks";
import { PoolTokensPrice } from "components/swap/PoolTokensPrice";
import { Typography, Box } from "components/Mui";
import { Wrapper, Breadcrumbs, TokenImage, AuthButton } from "components/index";
import { usePosition } from "hooks/swap/usePosition";
import { Trans, t } from "@lingui/macro";
import { usePositionDetailsFromId } from "hooks/swap/v3Calls";
import { useLoadAddLiquidityCallback } from "hooks/liquidity/index";
import { InfoPool } from "components/liquidity/index";
import { PositionInfo, UncollectedFees, PositionValue, ChartsWrapper } from "components/liquidity/Position/index";
import { BuyTokenButton } from "components/swap/index";
import { useMemo } from "react";
import { useAccountPrincipal } from "store/auth/hooks";
import { LIQUIDITY_OWNER_REFRESH_KEY } from "constants/index";
import { useRefreshTriggerManager } from "hooks/index";

export default function PositionDetails() {
  const principal = useAccountPrincipal();
  const { positionId, pool: poolId } = useParams<{ positionId: string; pool: string }>();
  const [refreshTrigger] = useRefreshTriggerManager(LIQUIDITY_OWNER_REFRESH_KEY);

  const { result: positionDetails } = usePositionDetailsFromId(poolId, positionId);
  const { position } = usePosition({
    poolId,
    tickLower: positionDetails?.tickLower,
    tickUpper: positionDetails?.tickUpper,
    liquidity: positionDetails?.liquidity,
  });

  const pool = position?.pool;
  const token0 = position?.pool.token0;
  const token1 = position?.pool.token1;

  const loadAddLiquidity = useLoadAddLiquidityCallback({ token0, token1 });

  const { result: owner } = useSwapPositionOwner(position?.pool.id, BigInt(positionId), refreshTrigger);

  const isOwner = useMemo(() => {
    if (!owner || !principal) return false;
    return principalToAccount(principal.toString()) === owner;
  }, [owner, principal]);

  return (
    <Wrapper sx={{ padding: "7px 0 20px 0" }}>
      <Breadcrumbs prevLabel={t`Liquidity`} currentLabel={t`Position Details`} prevLink="/liquidity?tab=Positions" />

      <Box sx={{ margin: "26px 0 0 0" }}>
        <Flex
          fullWidth
          justify="space-between"
          align="flex-end"
          sx={{
            "@media(max-width: 640px)": {
              flexDirection: "column",
              gap: "10px 0 ",
              alignItems: "flex-start",
            },
          }}
        >
          <Box>
            <Flex
              gap="0 8px"
              sx={{
                "@media(max-width: 640px)": {
                  flexDirection: "column",
                  gap: "10px 0 ",
                  alignItems: "flex-start",
                },
              }}
            >
              <Flex gap="0 8px">
                <Flex>
                  <TokenImage logo={token0?.logo} tokenId={token0?.address} size="32px" />
                  <TokenImage logo={token1?.logo} tokenId={token1?.address} size="32px" />
                </Flex>

                <Typography color="text.primary" fontSize="18px">
                  {token0?.symbol} / {token1?.symbol}
                </Typography>

                <FeeTierPercentLabel feeTier={pool?.fee} />
              </Flex>

              <PoolTokensPrice pool={pool} />
            </Flex>

            <Flex
              fullWidth
              sx={{
                margin: "20px 0 0 0",
                "@media(max-width: 640px)": {
                  flexDirection: "column",
                  gap: "20px 0 ",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                },
              }}
              justify="space-between"
              align="flex-end"
            >
              {pool ? (
                <InfoPool pool={pool} noPoolDetails wrapperSx={{ padding: "0", border: "none" }} />
              ) : (
                <Box>&nbsp;</Box>
              )}
            </Flex>
          </Box>

          <AuthButton className="secondary" variant="contained" onClick={loadAddLiquidity}>
            <Trans>Create New Position</Trans>
          </AuthButton>
        </Flex>

        {!position ? (
          <Box sx={{ width: "100%", height: "100%", padding: "20px 0" }}>
            <LoadingRow>
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </LoadingRow>
          </Box>
        ) : (
          <Flex
            fullWidth
            justify="center"
            align="flex-start"
            gap="0 16px"
            sx={{
              margin: "20px 0 0 0",
              "@media(max-width: 640px)": {
                flexDirection: "column",
                gap: "16px 0",
              },
            }}
          >
            <Box
              sx={{
                flex: "50%",
                "@media(max-width: 640px)": {
                  width: "100%",
                },
              }}
            >
              <ChartsWrapper position={position} positionId={positionId} />

              <Flex gap="0 12px" sx={{ margin: "16px 0 0 0" }}>
                <Box sx={{ flex: "50%" }}>
                  <BuyTokenButton token={token0} />
                </Box>

                <Box sx={{ flex: "50%" }}>
                  <BuyTokenButton token={token1} />
                </Box>
              </Flex>
            </Box>

            <Box
              sx={{
                flex: "50%",
                "@media(max-width: 640px)": {
                  width: "100%",
                },
              }}
            >
              <Flex vertical gap="16px 0" fullWidth align="flex-start">
                {position && positionId ? (
                  <>
                    <PositionInfo position={position} positionId={positionId} owner={owner} isOwner={isOwner} />
                    <UncollectedFees position={position} positionId={positionId} isOwner={isOwner} />
                    <PositionValue position={position} positionId={positionId} isOwner={isOwner} />
                  </>
                ) : null}
              </Flex>
            </Box>
          </Flex>
        )}
      </Box>
    </Wrapper>
  );
}
