import { useMemo, useState, useCallback, useContext } from "react";
import { Box, makeStyles } from "components/Mui";
import { useAccount } from "store/auth/hooks";
import { NoData, Pagination, ImageLoading } from "components/index";
import { useUserExchangeRecord } from "hooks/useWICPCalls";
import { enumToString, pageArgsFormat, parseTokenAmount, timestampFormat } from "@icpswap/utils";
import { Header, HeaderCell, TableRow, BodyCell } from "@icpswap/ui";
import { ICP } from "@icpswap/tokens";
import WrapContext from "components/Wrap/context";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
    },
  };
});

const pageSize = 5;

const ExchangeType: { [key: string]: string } = {
  unwrap: "Unwrap",
  wrap: "Wrap",
};

export default function WICPRecord() {
  const classes = useStyles();
  const { t } = useTranslation();
  const account = useAccount();
  const [pageNum, setPageNum] = useState(1);
  const [pageStart] = useMemo(() => pageArgsFormat(pageNum, pageSize), [pageNum, pageSize]);

  const { retryTrigger } = useContext(WrapContext);

  const { result, loading } = useUserExchangeRecord(account, pageStart, pageSize, retryTrigger);
  const { totalElements, content: list = [] } = result || {};

  const onPageChange = useCallback(({ pageNum }) => {
    setPageNum(pageNum);
  }, []);

  return (
    <>
      <>
        <Header className={classes.wrapper}>
          <HeaderCell>{t("common.time")}</HeaderCell>
          <HeaderCell>{t("common.type")}</HeaderCell>
          <HeaderCell>{t("common.amount")}</HeaderCell>
          <HeaderCell>{t("common.block")}</HeaderCell>
        </Header>

        <Box>
          {list.map((row, index) => (
            <TableRow key={index} className={classes.wrapper}>
              <BodyCell>{timestampFormat(row.date)}</BodyCell>
              <BodyCell>{ExchangeType[enumToString(row.wrapType)] ?? enumToString(row.wrapType)}</BodyCell>
              <BodyCell>{parseTokenAmount(row.amount, ICP.decimals).toFormat()}</BodyCell>
              <BodyCell>{String(row.blockHeight)}</BodyCell>
            </TableRow>
          ))}
        </Box>
      </>
      {list.length === 0 && !loading ? <NoData /> : null}
      {loading ? <ImageLoading loading={loading} mask={false} /> : null}

      {Number(totalElements ?? 0) > 0 ? (
        <Pagination count={Number(totalElements || 0)} onPageChange={onPageChange} defaultPageSize={pageSize} flexEnd />
      ) : null}
    </>
  );
}
