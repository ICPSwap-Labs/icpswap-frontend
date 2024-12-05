import { useState } from "react";
import { Trans } from "@lingui/macro";
import { Box, makeStyles, useTheme } from "components/Mui";
import { usePositions } from "hooks/liquidity/usePositions";
import { pageArgsFormat } from "@icpswap/utils";
import { Header, HeaderCell, Pagination } from "@icpswap/ui";
import { LoadingRow, NoData, PaginationType } from "components/index";
import { usePoolByPoolId } from "hooks/swap/index";
import { Null } from "@icpswap/types";
import { PositionRow } from "components/liquidity/PositionRow";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      padding: "16px",
      alignItems: "center",
      gridTemplateColumns: "200px 120px 120px repeat(3, 1fr)",
    },
  };
});

export interface PositionsProps {
  poolId: string | Null;
}

export function Positions({ poolId }: PositionsProps) {
  const classes = useStyles();
  const theme = useTheme();

  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { loading, result } = usePositions(poolId, undefined, offset, pagination.pageSize);

  const positions = result?.content;
  const totalElements = result?.totalElements;

  const [, pool] = usePoolByPoolId(poolId);

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  return (
    <Box sx={{ margin: "10px 0 0 0" }}>
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ minWidth: "1200px" }}>
          <Header className={classes.wrapper} borderBottom={`1px solid ${theme.palette.border.level1}`}>
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
                <PositionRow key={index} positionInfo={ele} pool={pool} wrapperClassName={classes.wrapper} />
              ))
            : null}

          {(positions ?? []).length === 0 && !loading ? <NoData /> : null}

          {loading ? (
            <Box sx={{ margin: "20px 0 0 0" }}>
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
        <Box sx={{ padding: "20px 16px" }}>
          <Pagination total={Number(totalElements)} num={pagination.pageNum} onPageChange={handlePageChange} />
        </Box>
      ) : null}
    </Box>
  );
}
