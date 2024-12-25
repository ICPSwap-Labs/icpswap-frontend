import { Trans } from "@lingui/macro";
import { Box, Theme, makeStyles } from "components/Mui";
import { Header, HeaderCell, LoadingRow, NoData } from "@icpswap/ui";
import { usePoolByPoolId } from "hooks/swap/usePools";
import { LimitTransaction, Null } from "@icpswap/types";

import { LimitHistoryRow } from "./LimitHistoryRow";

const useStyles = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      padding: "24px",
      borderBottom: `1px solid ${theme.palette.background.level1}`,
      gridTemplateColumns: "180px repeat(3, 1fr) 160px",
      "@media screen and (max-width: 780px)": {
        padding: "16px",
      },
    },
  };
});

export interface PositionTableUIProps {
  wrapperClassName?: string;
  poolId: string | Null;
  loading: boolean;
  limitTransactions: LimitTransaction[] | Null;
  unusedBalance: { balance0: bigint; balance1: bigint } | Null;
}

export function LimitOrdersTableUI({
  poolId,
  loading,
  limitTransactions,
  unusedBalance,
  wrapperClassName,
}: PositionTableUIProps) {
  const classes = useStyles();

  const [, pool] = usePoolByPoolId(poolId);

  return (
    <>
      <Box sx={{ width: "100%", overflow: "auto", margin: "10px 0 0 0" }}>
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
            ? limitTransactions?.map((ele, index) => (
                <LimitHistoryRow
                  key={index}
                  limitTransaction={ele}
                  pool={pool}
                  wrapperClassName={wrapperClassName ?? classes.wrapper}
                  noBorder={index === limitTransactions.length - 1}
                  unusedBalance={unusedBalance}
                />
              ))
            : null}

          {(limitTransactions ?? []).length === 0 && !loading ? <NoData /> : null}

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
