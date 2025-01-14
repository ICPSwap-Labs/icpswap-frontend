import { Trans } from "@lingui/macro";
import { Box, Theme, makeStyles } from "components/Mui";
import { isNullArgs } from "@icpswap/utils";
import { useMemo } from "react";
import { Header, HeaderCell, LoadingRow, NoData, Pagination, PaginationType, PaginationProps } from "@icpswap/ui";
import { usePoolByPoolId } from "hooks/swap/usePools";
import { PositionRow } from "components/liquidity/PositionRow";
import { Null } from "@icpswap/types";
import { useSneedLedger } from "hooks/index";
import { PositionDetails } from "types/index";

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
  pagination: PaginationType;
  allLimitOrders?: bigint[] | Null;
}

export function PositionTableUI({
  poolId,
  loading,
  positions,
  totalElements,
  wrapperClassName,
  onPaginationChange,
  pagination,
  allLimitOrders,
}: PositionTableUIProps) {
  const classes = useStyles();

  const [, pool] = usePoolByPoolId(poolId);

  const tokenIds = useMemo(() => {
    if (isNullArgs(pool)) return null;

    return [pool.token0.address, pool.token1.address];
  }, [pool]);

  const sneedLedger = useSneedLedger(tokenIds);

  return (
    <>
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ minWidth: "1090px" }}>
          <Header className={wrapperClassName ?? classes.wrapper}>
            <HeaderCell field="Position ID">
              <Trans>Position ID</Trans>
            </HeaderCell>

            <HeaderCell field="Pair">
              <Trans>Owner</Trans>
            </HeaderCell>

            <HeaderCell field="USDValue">
              <Trans>Value</Trans>
            </HeaderCell>

            <HeaderCell field="TokenAmount">
              <Trans>Token Amount</Trans>
            </HeaderCell>

            <HeaderCell field="PriceRange">
              <Trans>Price Range</Trans>
            </HeaderCell>

            <HeaderCell field="UnclaimedFees">
              <Trans>Uncollected fees</Trans>
            </HeaderCell>

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
                />
              ))
            : null}

          {(positions ?? []).length === 0 && !loading ? <NoData /> : null}

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

      <Box sx={{ padding: "24px" }}>
        {totalElements && Number(totalElements) !== 0 ? (
          <Pagination
            total={Number(totalElements)}
            num={pagination.pageNum}
            onPageChange={onPaginationChange}
            mt="0px"
          />
        ) : null}
      </Box>
    </>
  );
}
