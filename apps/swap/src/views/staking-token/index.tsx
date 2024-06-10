import React, { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Box, Typography } from "@mui/material";
import { NoData, MainCard, StaticLoading, TextButton } from "components/index";
import Switch from "components/switch";
import { Trans, t } from "@lingui/macro";
import { useStakingPools, useStakingPoolInfoFromController, useParsedQueryString } from "@icpswap/hooks";
import { STATE } from "types/staking-token";

import UnusedTokens from "./components/UnusedTokens";
import Pool from "./components/Pool";
import GlobalData from "./components/GlobalData";

export type Page = {
  name: string;
  key: STATE;
};

export const Pages: Page[] = [
  {
    key: STATE.LIVE,
    name: t`Live`,
  },
  {
    key: STATE.UPCOMING,
    name: t`Unstarted`,
  },
  {
    key: STATE.FINISHED,
    name: t`Finished`,
  },
];

export const getStateValue = (state: STATE) => {
  switch (state) {
    case STATE.LIVE:
      return BigInt(2);
    case STATE.UPCOMING:
      return BigInt(1);
    case STATE.FINISHED:
      return BigInt(3);
    default:
      return undefined;
  }
};

function SinglePool() {
  const { poolId } = useParsedQueryString() as { poolId: string };

  const { result: poolInfo } = useStakingPoolInfoFromController(poolId);

  return (
    <>
      <MainCard>
        <Box
          sx={{
            position: "relative",
            minHeight: "440px",
          }}
        >
          <Box sx={{ display: "grid", justifyContent: "center" }}>
            <Pool stakedOnly={false} pool={poolInfo} filterState={STATE.UPCOMING} />
          </Box>
        </Box>
      </MainCard>
    </>
  );
}

function Pools() {
  const history = useHistory();
  const [unused, setUnused] = useState(false);
  const [stakedPools, setStakedPools] = useState<string[]>([]);
  const { state, stakeOnly } = useParsedQueryString() as { state: string; stakeOnly: "true" | undefined };

  const __state = useMemo(() => {
    return (state ?? STATE.LIVE) as STATE;
  }, [state]);

  const stateValue = useMemo(() => getStateValue(__state), [__state]);

  const { result, loading } = useStakingPools(stateValue, 0, 100);

  // when __state is FINISHED, sort pools by stakingToken symbol
  const pools = useMemo(() => {
    if (result?.content) {
      if (!!__state && __state === STATE.FINISHED) {
        return result?.content.sort((a, b) => {
          if (a.stakingTokenSymbol < b.stakingTokenSymbol) return -1;
          if (a.stakingTokenSymbol > b.stakingTokenSymbol) return 1;
          return 0;
        });
      }

      return result?.content;
    }

    return undefined;
  }, [result, __state]);

  const handleStakedOnly = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (checked) {
        history.push(`/staking-token?state=${__state}&stakeOnly=true`);
      } else {
        history.push(`/staking-token?state=${__state}`);
      }
    },
    [__state],
  );

  const handleLoad = (value: Page) => {
    history.push(`/staking-token?state=${value.key}${stakeOnly === "true" ? "&stakeOnly=true" : ""}`);
  };

  const handleWithdrawUnusedTokens = () => {
    setUnused(true);
  };

  const handleUpdatePoolStaked = (poolId: string, staked: boolean) => {
    if (stakedPools.includes(poolId) && staked === false) {
      const __stakedPools = [...stakedPools];
      __stakedPools.splice(__stakedPools.indexOf(poolId), 1);
      setStakedPools([...new Set(__stakedPools)]);
    }

    if (!stakedPools.includes(poolId) && staked === true) {
      const __stakedPools = [...stakedPools, poolId];
      setStakedPools([...new Set(__stakedPools)]);
    }
  };

  const noData = useMemo(() => {
    if (!pools) return true;
    if (__state === STATE.LIVE && stakeOnly === "true" && stakedPools.length === 0) return true;
    return pools.length === 0;
  }, [__state, stakedPools, pools, stakeOnly]);

  return (
    <>
      <MainCard padding="24px">
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{
            "@media (max-width:640px)": {
              gap: "24px 0",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            },
          }}
        >
          <Grid item>
            <Box
              sx={{
                display: "flex",
                gap: "0 20px",
              }}
            >
              {Pages.map((ele) => (
                <Typography
                  key={ele.key}
                  color={__state === ele.key ? "text.primary" : "text.secondary"}
                  sx={{
                    fontSize: "20px",
                    fontWeight: 500,
                    cursor: "pointer",
                    textTransform: "capitalize",
                    "@media (max-width:640px)": {
                      fontSize: "16px",
                    },
                  }}
                  onClick={() => handleLoad(ele)}
                >
                  {ele.name}
                </Typography>
              ))}
            </Box>
          </Grid>

          <Grid item alignItems="center">
            <Box sx={{ display: "flex", alignItems: "center", gap: "0 10px" }}>
              <TextButton onClick={handleWithdrawUnusedTokens}>
                <Trans>Reclaim</Trans>
              </TextButton>
              <Typography component="span">
                <Trans>Staked only</Trans>
              </Typography>
              <Switch checked={stakeOnly === "true"} onChange={handleStakedOnly} />
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            position: "relative",
            minHeight: "440px",
            margin: "50px 0 0 0",
          }}
        >
          {!loading ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "24px 24px",
                justifyContent: "center",
              }}
            >
              {pools?.map((ele, index) => (
                <Pool
                  key={`${ele.canisterId}-${index}`}
                  stakedOnly={stakeOnly === "true"}
                  pool={ele}
                  updatePoolStaked={handleUpdatePoolStaked}
                  filterState={__state}
                />
              ))}
            </Box>
          ) : null}
          {noData && !loading && <NoData />}
          {loading ? <StaticLoading loading /> : null}
        </Box>
      </MainCard>

      {unused ? <UnusedTokens open={unused} onClose={() => setUnused(false)} /> : null}
    </>
  );
}

export default function StakingTokens() {
  const { poolId } = useParsedQueryString() as { poolId: string };

  return (
    <>
      <GlobalData />
      <Box mt="16px">{poolId ? <SinglePool /> : <Pools />}</Box>
    </>
  );
}
