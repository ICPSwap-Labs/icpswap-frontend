import { Box, Theme, makeStyles } from "components/Mui";
import { Header, HeaderCell, LoadingRow } from "@icpswap/ui";
import { usePoolByPoolId } from "hooks/swap/usePools";
import { LimitTransaction, Null } from "@icpswap/types";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useScrollToTop } from "hooks/useScrollToTop";
import { useCallback } from "react";
import { Tab } from "constants/index";

import { HistoryRowPro } from "./HistoryRowPro";
import { LimitTransactionsEmpty } from "../Empty";

const useStyles = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      padding: "16px",
      borderBottom: `1px solid ${theme.palette.background.level1}`,
      gridTemplateColumns: "180px repeat(3, 1fr)",
    },
  };
});

export interface HistoryTableProUIProps {
  wrapperClassName?: string;
  poolId: string | Null;
  loading: boolean;
  limitTransactions: LimitTransaction[] | Null;
  unusedBalance: { balance0: bigint; balance1: bigint } | Null;
}

export function HistoryTableProUI({
  poolId,
  loading,
  limitTransactions,
  unusedBalance,
  wrapperClassName,
}: HistoryTableProUIProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();

  const [, pool] = usePoolByPoolId(poolId);

  const scrollToTop = useScrollToTop();

  const handleToLimit = useCallback(() => {
    scrollToTop();
    history.push(`/swap/pro?tab=${Tab.Limit}`);
  }, [scrollToTop, history]);

  return (
    <>
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ minWidth: "1096px" }}>
          <Header className={wrapperClassName ?? classes.wrapper}>
            <HeaderCell>{t("common.time")}</HeaderCell>
            <HeaderCell>{t("common.you.paid")}</HeaderCell>
            <HeaderCell>{t("common.you.received")}</HeaderCell>
            <HeaderCell align="right">{t("common.limit.price")}</HeaderCell>
            {/* <HeaderCell align="right">&nbsp;</HeaderCell> */}
          </Header>

          {!loading
            ? limitTransactions?.map((ele, index) => (
                <HistoryRowPro
                  key={index}
                  limitTransaction={ele}
                  pool={pool}
                  wrapperClassName={wrapperClassName ?? classes.wrapper}
                  noBorder={index === limitTransactions.length - 1}
                  unusedBalance={unusedBalance}
                />
              ))
            : null}

          {(limitTransactions ?? []).length === 0 && !loading ? (
            <LimitTransactionsEmpty onClick={handleToLimit} />
          ) : null}

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
