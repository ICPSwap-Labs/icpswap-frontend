import { Trans } from "@lingui/macro";
import { Box, Theme, makeStyles } from "components/Mui";
import { usePositions } from "hooks/liquidity/usePositions";
import { isNullArgs, pageArgsFormat } from "@icpswap/utils";
import { useMemo, useState } from "react";
import { Header, HeaderCell, LoadingRow, NoData, Pagination, PaginationType } from "@icpswap/ui";
import { usePoolByPoolId } from "hooks/swap/usePools";
import { PositionRow } from "components/liquidity/PositionRow";
import { Null } from "@icpswap/types";
import { useSneedLedger } from "hooks/index";

const useStyles = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      padding: "24px",
      borderBottom: `1px solid ${theme.palette.background.level1}`,
      gridTemplateColumns: "200px 120px 120px repeat(3, 1fr)",
    },
  };
});

export interface PositionTableProps {
  wrapperClassName?: string;
  principal?: string;
  poolId: string | Null;
}

export function PositionTable({ poolId, principal, wrapperClassName }: PositionTableProps) {
  const classes = useStyles();

  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { loading, result } = usePositions(poolId, principal, offset, pagination.pageSize);

  const positions = result?.content;
  const totalElements = result?.totalElements;

  const [, pool] = usePoolByPoolId(poolId);

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  const tokenIds = useMemo(() => {
    if (isNullArgs(pool)) return null;

    return [pool.token0.address, pool.token1.address];
  }, [pool]);

  const sneedLedger = useSneedLedger(tokenIds);

  return (
    <>
      <Box sx={{ width: "100%", overflow: "auto", margin: "10px 0 0 0" }}>
        <Box sx={{ minWidth: "1136px" }}>
          <Header className={wrapperClassName ?? classes.wrapper}>
            <HeaderCell field="Pair">
              <Trans>Owner</Trans>
            </HeaderCell>

            <HeaderCell field="Position ID">
              <Trans>Position ID</Trans>
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
          </Header>

          {!loading
            ? positions?.map((ele, index) => (
                <PositionRow
                  key={index}
                  positionInfo={ele}
                  pool={pool}
                  wrapperClassName={classes.wrapper}
                  sneedLedger={sneedLedger}
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
          <Pagination total={Number(totalElements)} num={pagination.pageNum} onPageChange={handlePageChange} mt="0px" />
        ) : null}
      </Box>
    </>
  );
}
