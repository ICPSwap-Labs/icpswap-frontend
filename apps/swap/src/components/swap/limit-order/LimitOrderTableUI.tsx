import { useCallback } from "react";
import { Trans } from "@lingui/macro";
import { Box, Theme, makeStyles } from "components/Mui";
import { Header, HeaderCell, LoadingRow, NoData } from "@icpswap/ui";
import { usePoolByPoolId } from "hooks/swap/usePools";
import { LimitOrder, Null } from "@icpswap/types";
import { useRefreshTriggerManager } from "hooks/index";
import { SWAP_LIMIT_REFRESH_KEY } from "constants/limit";

import { LimitOrderRow } from "./LimitOrderRow";

const useStyles = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      padding: "16px",
      borderBottom: `1px solid ${theme.palette.background.level1}`,
      gridTemplateColumns: "180px repeat(3, 1fr) 160px",
    },
  };
});

export interface PositionTableUIProps {
  wrapperClassName?: string;
  poolId: string | Null;
  loading: boolean;
  limitOrders: LimitOrder[] | Null;
  setLimitOrdersRefreshTrigger: () => void;
}

export function LimitOrdersTableUI({
  poolId,
  loading,
  limitOrders,
  wrapperClassName,
  setLimitOrdersRefreshTrigger,
}: PositionTableUIProps) {
  const classes = useStyles();

  const [, pool] = usePoolByPoolId(poolId);
  const [, setRefreshTrigger] = useRefreshTriggerManager(SWAP_LIMIT_REFRESH_KEY);

  const handleCancelSuccess = useCallback(() => {
    setLimitOrdersRefreshTrigger();
    setRefreshTrigger();
  }, [setLimitOrdersRefreshTrigger]);

  return (
    <>
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ minWidth: "1096px" }}>
          <Header className={wrapperClassName ?? classes.wrapper}>
            <HeaderCell>
              <Trans>Time</Trans>
            </HeaderCell>

            <HeaderCell>
              <Trans>You pay</Trans>
            </HeaderCell>

            <HeaderCell>
              <Trans>You receive</Trans>
            </HeaderCell>

            <HeaderCell align="right">
              <Trans>Limit Price</Trans>
            </HeaderCell>

            <HeaderCell align="right">&nbsp;</HeaderCell>
          </Header>

          {!loading
            ? limitOrders?.map((ele, index) => (
                <LimitOrderRow
                  key={index}
                  limitOrder={ele}
                  pool={pool}
                  wrapperClassName={wrapperClassName ?? classes.wrapper}
                  noBorder={index === limitOrders.length - 1}
                  onCancelSuccess={handleCancelSuccess}
                />
              ))
            : null}

          {(limitOrders ?? []).length === 0 && !loading ? <NoData /> : null}

          {loading ? (
            <Box sx={{ padding: "24px" }}>
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
              </LoadingRow>
            </Box>
          ) : null}
        </Box>
      </Box>
    </>
  );
}
