import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, TableContainer, Table, TableBody, TableHead, TableCell, TableRow, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  Pagination,
  ListLoading,
  NoData,
  Copy,
  PaginationType,
  MainCard,
  Breadcrumbs,
  MainContainer,
} from "ui-component/index";
import { parseTokenAmount, pageArgsFormat, shorten } from "@icpswap/utils";
import { useTokenHolders, useTokenSupply } from "@icpswap/hooks";
import { Trans } from "@lingui/macro";
import { useTokenInfo } from "hooks/token/index";
import BigNumber from "bignumber.js";

const useStyles = makeStyles(() => ({
  address: {
    width: "160px",
  },
}));

export default function Holders() {
  const classes = useStyles();

  const [pagination, setPagination] = useState({ pageSize: 10, pageNum: 1 });
  const [searchValue] = useState<null | string>(null);

  const { canisterId } = useParams<{ canisterId: string }>();

  const { result: tokenInfo } = useTokenInfo(canisterId);

  const [pageStart] = pageArgsFormat(pagination.pageNum, pagination.pageSize);
  const { result: supply } = useTokenSupply(canisterId);
  const { loading, result } = useTokenHolders(canisterId, pageStart, pagination.pageSize);
  const { totalElements, content: originList } = result ?? {
    totalElements: 0,
    content: [],
  };

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  const getRank = (index: number) => {
    return index + 1 + (pagination.pageNum - 1) * pagination.pageSize;
  };

  const getAmountPercent = (amount: bigint) => {
    if (!amount || !supply) return "0.00%";
    const percent = new BigNumber(String(amount)).div(String(supply)).multipliedBy(100).toFixed(4);

    return `${percent}%`;
  };

  const list = useMemo(() => {
    if (searchValue && originList.length) {
      const list = originList.filter((item) => item.account.toLowerCase().includes(searchValue.toLowerCase()));
      return list;
    }
    return originList;
  }, [originList, searchValue]);

  return (
    <MainContainer>
      <Breadcrumbs
        prevLink={`/token/details/${canisterId}`}
        prevLabel={<Trans>Token Details</Trans>}
        currentLabel={<Trans>Holders</Trans>}
      />

      <Box sx={{ height: "20px" }} />

      <MainCard>
        <Box mb="20px">
          <Typography variant="h3">
            <Trans>Holders</Trans>
          </Typography>
        </Box>

        <TableContainer className={loading ? "with-loading" : ""}>
          <Table>
            <colgroup>
              <col width="10%" />
              <col width="40%" />
              <col width="30%" />
              <col width="20%" />
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Trans>Rank</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Address</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Amount</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Percent</Trans>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography>{getRank(index)}</Typography>
                  </TableCell>
                  <TableCell className={classes.address}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="h6">
                          <Copy content={row.account}>{shorten(row.account, 20)}</Copy>
                        </Typography>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="h6">
                          {parseTokenAmount(row.balance, tokenInfo?.decimals).toFormat()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <Typography>{getAmountPercent(row.balance)}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {list.length === 0 && !loading ? <NoData /> : null}
          <ListLoading loading={loading} />
          {list.length ? (
            <Pagination total={Number(totalElements)} num={pagination.pageNum} onPageChange={handlePageChange} />
          ) : null}
        </TableContainer>
      </MainCard>
    </MainContainer>
  );
}
