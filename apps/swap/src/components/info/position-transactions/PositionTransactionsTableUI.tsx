import { Trans } from "@lingui/macro";
import { Box, Theme, makeStyles } from "components/Mui";
import { Header, HeaderCell, LoadingRow, NoData, Pagination, PaginationType, PaginationProps } from "@icpswap/ui";
import { Null, PositionTransaction } from "@icpswap/types";

import { PositionTransactionsRow } from "./PositionTransactionsRow";

const useStyles = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      padding: "24px",
      borderBottom: `1px solid ${theme.palette.background.level1}`,
      gridTemplateColumns: "repeat(2, 1fr) repeat(4, 174px)",
      "@media screen and (max-width: 780px)": {
        padding: "16px",
      },
    },
  };
});

export interface PositionTransactionsTableUIProps {
  wrapperClassName?: string;
  loading: boolean;
  transactions: PositionTransaction[] | Null;
  totalElements: number | Null;
  onPaginationChange?: PaginationProps["onPageChange"];
  pagination: PaginationType;
}

export function PositionTransactionsTableUI({
  loading,
  transactions,
  totalElements,
  wrapperClassName,
  onPaginationChange,
  pagination,
}: PositionTransactionsTableUIProps) {
  const classes = useStyles();

  return (
    <>
      <Box sx={{ width: "100%", overflow: "auto", margin: "10px 0 0 0" }}>
        <Box sx={{ minWidth: "1136px" }}>
          <Header className={wrapperClassName ?? classes.wrapper}>
            <HeaderCell>
              <Trans>Time</Trans>
            </HeaderCell>

            <HeaderCell>
              <Trans>Pair</Trans>
            </HeaderCell>

            <HeaderCell align="right">
              <Trans>Position ID</Trans>
            </HeaderCell>

            <HeaderCell align="right">
              <Trans>From</Trans>
            </HeaderCell>

            <HeaderCell align="right">
              <Trans>To</Trans>
            </HeaderCell>

            <HeaderCell align="right">
              <Trans>Operation</Trans>
            </HeaderCell>
          </Header>

          {!loading
            ? transactions?.map((ele, index) => (
                <PositionTransactionsRow
                  key={index}
                  transaction={ele}
                  wrapperClassName={wrapperClassName ?? classes.wrapper}
                />
              ))
            : null}

          {(transactions ?? []).length === 0 && !loading ? <NoData /> : null}

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
