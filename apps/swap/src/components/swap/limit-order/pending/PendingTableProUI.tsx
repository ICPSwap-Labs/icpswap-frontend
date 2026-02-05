import { useCallback } from "react";
import { Box, Theme, makeStyles } from "components/Mui";
import { Header, HeaderCell, LoadingRow } from "@icpswap/ui";
import { usePoolByPoolId } from "hooks/swap/usePools";
import { LimitOrder, Null } from "@icpswap/types";
import { useRefreshTriggerManager } from "hooks/index";
import { SWAP_LIMIT_REFRESH_KEY } from "constants/limit";
import { useTranslation } from "react-i18next";
import { useScrollToTop } from "hooks/useScrollToTop";
import { useNavigate } from "react-router-dom";
import { Tab } from "constants/index";

import { PendingRowPro } from "./PendingRowPro";
import { LimitTransactionsEmpty } from "../Empty";

const useStyles = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      padding: "16px",
      borderBottom: `1px solid ${theme.palette.background.level1}`,
      gridTemplateColumns: "180px repeat(2, 1fr) 1.5fr 140px 80px",
    },
  };
});

export interface PendingTableProUIProps {
  wrapperClassName?: string;
  poolId: string | Null;
  loading: boolean;
  limitOrders: LimitOrder[] | Null;
  setLimitOrdersRefreshTrigger: () => void;
}

export function PendingTableProUI({
  poolId,
  loading,
  limitOrders,
  wrapperClassName,
  setLimitOrdersRefreshTrigger,
}: PendingTableProUIProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();

  const [, pool] = usePoolByPoolId(poolId);
  const [, setRefreshTrigger] = useRefreshTriggerManager(SWAP_LIMIT_REFRESH_KEY);

  const handleCancelSuccess = useCallback(() => {
    setLimitOrdersRefreshTrigger();
    setRefreshTrigger();
  }, [setLimitOrdersRefreshTrigger]);

  const scrollToTop = useScrollToTop();

  const handleToLimit = useCallback(() => {
    scrollToTop();
    navigate(`/swap/pro?tab=${Tab.Limit}`);
  }, [scrollToTop, navigate]);

  return (
    <>
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ minWidth: "1096px" }}>
          <Header className={wrapperClassName ?? classes.wrapper}>
            <HeaderCell>{t("common.time")}</HeaderCell>
            <HeaderCell>{t("common.you.pay")}</HeaderCell>
            <HeaderCell>{t("common.you.receive")}</HeaderCell>
            <HeaderCell align="right">Limit/Current price</HeaderCell>
            <HeaderCell align="right">{t("common.filled")}</HeaderCell>
            <HeaderCell align="right">&nbsp;</HeaderCell>
          </Header>

          {!loading
            ? limitOrders?.map((ele, index) => (
                <PendingRowPro
                  key={index}
                  limitOrder={ele}
                  pool={pool}
                  wrapperClassName={wrapperClassName ?? classes.wrapper}
                  noBorder={index === limitOrders.length - 1}
                  onCancelSuccess={handleCancelSuccess}
                />
              ))
            : null}

          {(limitOrders ?? []).length === 0 && !loading ? <LimitTransactionsEmpty onClick={handleToLimit} /> : null}

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
