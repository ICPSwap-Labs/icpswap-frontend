import { Box, Theme, makeStyles } from "components/Mui";
import { Header, HeaderCell, LoadingRow, NoData, Pagination, PaginationProps } from "@icpswap/ui";
import { Null, PositionTransaction } from "@icpswap/types";
import { useTranslation } from "react-i18next";

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
  page: number;
  empty?: string;
}

export function PositionTransactionsTableUI({
  loading,
  transactions,
  totalElements,
  wrapperClassName,
  onPaginationChange,
  page,
  empty,
}: PositionTransactionsTableUIProps) {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <>
      <Box sx={{ width: "100%", overflow: "auto", margin: "10px 0 0 0" }}>
        <Box sx={{ minWidth: "1136px" }}>
          <Header className={wrapperClassName ?? classes.wrapper}>
            <HeaderCell>{t("common.time")}</HeaderCell>
            <HeaderCell>{t("common.pair")}</HeaderCell>
            <HeaderCell align="right">{t("common.position.id")}</HeaderCell>
            <HeaderCell align="right">{t("common.from")}</HeaderCell>
            <HeaderCell align="right">{t("common.to")}</HeaderCell>
            <HeaderCell align="right">{t("common.operation")}</HeaderCell>
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

          {(transactions ?? []).length === 0 && !loading ? <NoData tip={empty} /> : null}

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
          padding={{ lg: "24px 0", sm: "16px 0" }}
        />
      ) : null}
    </>
  );
}
