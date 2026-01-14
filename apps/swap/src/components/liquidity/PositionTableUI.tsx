import { Box, Theme, makeStyles } from "components/Mui";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useMemo } from "react";
import { Header, HeaderCell, LoadingRow, NoData, Pagination, PaginationProps, PaginationPadding } from "@icpswap/ui";
import { usePoolByPoolId } from "hooks/swap/usePools";
import { PositionRow } from "components/liquidity/PositionRow";
import { Null } from "@icpswap/types";
import { useSneedLedger } from "hooks/index";
import { PositionDetails } from "types/index";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      padding: "16px",
      borderBottom: `1px solid ${theme.palette.background.level1}`,
      gridTemplateColumns: "120px 120px 120px 120px repeat(2, 1fr) 40px",
    },
  };
});

export interface PositionTableUIProps {
  wrapperClassName?: string;
  poolId: string | Null;
  loading: boolean;
  positions: PositionDetails[] | Null;
  totalElements: number | Null;
  onPaginationChange?: PaginationProps["onPageChange"];
  page: number;
  allLimitOrders?: bigint[] | Null;
  padding?: string;
  empty?: string;
  paginationPadding?: PaginationPadding;
}

export function PositionTableUI({
  poolId,
  loading,
  positions,
  totalElements,
  wrapperClassName,
  onPaginationChange,
  page,
  allLimitOrders,
  padding,
  empty,
  paginationPadding,
}: PositionTableUIProps) {
  const { t } = useTranslation();
  const classes = useStyles();

  const [, pool] = usePoolByPoolId(poolId);

  const tokenIds = useMemo(() => {
    if (isUndefinedOrNull(pool)) return null;

    return [pool.token0.address, pool.token1.address];
  }, [pool]);

  const sneedLedger = useSneedLedger(tokenIds);

  return (
    <>
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ minWidth: "1090px" }}>
          <Header className={wrapperClassName ?? classes.wrapper} padding={padding}>
            <HeaderCell field="Position ID">{t("common.position.id")}</HeaderCell>

            <HeaderCell field="Pair">{t("common.owner")}</HeaderCell>

            <HeaderCell field="USDValue">{t("common.value")}</HeaderCell>

            <HeaderCell field="TokenAmount">{t("common.token.amount")}</HeaderCell>

            <HeaderCell field="PriceRange">{t("common.price.range")}</HeaderCell>

            <HeaderCell field="UnclaimedFees">{t("common.uncollected.fees")}</HeaderCell>

            <HeaderCell field="None">&nbsp;</HeaderCell>
          </Header>
          {!loading
            ? positions?.map((ele, index) => (
                <PositionRow
                  key={index}
                  positionInfo={ele}
                  pool={pool}
                  wrapperClassName={wrapperClassName ?? classes.wrapper}
                  sneedLedger={sneedLedger}
                  allLimitOrders={allLimitOrders}
                  padding={padding}
                />
              ))
            : null}
          {(positions ?? []).length === 0 && !loading ? <NoData tip={empty} /> : null}
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

      {totalElements && Number(totalElements) !== 0 ? (
        <Pagination
          length={Number(totalElements)}
          page={page}
          onPageChange={onPaginationChange}
          padding={paginationPadding}
        />
      ) : null}
    </>
  );
}
