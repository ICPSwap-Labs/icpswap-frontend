import React, { useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Box, Typography } from "@mui/material";
import { NoData, MainCard, StaticLoading, TextButton } from "components/index";
import GlobalData from "./components/GlobalData";
import Pool from "./components/Pool";
import Switch from "components/switch";
import { Trans, t } from "@lingui/macro";
import { useStakingTokenPools, useStakingPoolInfoFromController } from "@icpswap/hooks";
import UnusedTokens from "./components/UnusedTokens";
import { STATE } from "types/staking-token";
import { getStakingTokenPoolState } from "utils/staking";
import useParsedQueryString from "hooks/useParsedQueryString";

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

  const state = getStakingTokenPoolState(poolInfo);

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
            <Pool stakedOnly={false} pool={poolInfo} state={state} />
          </Box>
        </Box>
      </MainCard>
    </>
  );
}

function Pools() {
  const history = useHistory();

  const { filter: _filter } = useParsedQueryString() as { filter: string; poolId: string };

  const filter = useMemo(() => {
    return (_filter ?? STATE.LIVE) as STATE;
  }, [_filter]);

  const state = useMemo(() => getStateValue((filter ?? STATE.LIVE) as STATE), [filter]);

  const { result, loading } = useStakingTokenPools(state, 0, 100);

  // when filter is FINISHED, sort pools by stakingToken symbol
  const pools = useMemo(() => {
    if (result?.content) {
      if (!!filter && filter === STATE.FINISHED) {
        return result?.content.sort((a, b) => {
          if (a.stakingTokenSymbol < b.stakingTokenSymbol) return -1;
          if (a.stakingTokenSymbol > b.stakingTokenSymbol) return 1;
          return 0;
        });
      }

      return result?.content;
    }

    return undefined;
  }, [result, filter]);

  const [stakedOnly, setStakedOnly] = React.useState(false);
  const [showNoData, setShowNoData] = React.useState(false);
  const [unused, setUnused] = useState(false);

  const handleStakedOnly = (checked: boolean) => {
    setStakedOnly(checked);

    if (checked) {
      let poolItems = document.querySelectorAll(".staking-token-pool-item");
      var showNoData = true;

      setTimeout(() => {
        poolItems.forEach((item) => {
          if (item.classList.toString().indexOf("block") !== -1) {
            showNoData = false;
          }
        });
        setShowNoData(showNoData);
      }, 50);
    } else {
      if (!!pools?.length) {
        setShowNoData(false);
      } else {
        setShowNoData(true);
      }
    }
  };

  const handleLoad = (value: Page) => {
    history.push(`/staking-token?filter=${value.key}`);
  };

  const handleWithdrawUnusedTokens = () => {
    setUnused(true);
  };

  return (
    <>
      <MainCard>
        <Grid container direction="row">
          <Grid item>
            <Box sx={{ display: "flex", gap: "0 20px" }}>
              {Pages.map((ele) => (
                <Typography
                  key={ele.key}
                  variant="h3"
                  color={filter === ele.key ? "textPrimary" : "textTertiary"}
                  sx={{
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
          <Grid item alignItems={"center"} style={{ marginLeft: "auto" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextButton onClick={handleWithdrawUnusedTokens}>
                <Trans>Unused tokens</Trans>
              </TextButton>
              <Typography component="span" sx={{ margin: "0 0 0 10px" }}>
                <Trans>Staked only</Trans>
              </Typography>
              <Switch checked={stakedOnly} onChange={(event: any) => handleStakedOnly(event.target.checked)} />
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            position: "relative",
            minHeight: "440px",
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
                <Pool key={`${ele.canisterId}-${index}`} stakedOnly={stakedOnly} pool={ele} state={filter} />
              ))}
            </Box>
          ) : null}
          {(showNoData || !pools?.length) && !loading && <NoData />}
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
      <Box mt="16px">{!!poolId ? <SinglePool /> : <Pools />}</Box>
    </>
  );
}
