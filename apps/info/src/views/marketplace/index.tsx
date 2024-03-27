import { useState } from "react";
import MainContainer from "ui-component/MainContainer";
import TradeData from "ui-component/NFT/market/TradeData";
import { ListLoading, NoData, Pagination, PaginationType } from "ui-component/index";
import { MainCard } from "@icpswap/ui";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Avatar,
  Grid,
} from "@mui/material";
import { useNFTCanisterMetadata, useNFTOtherStat } from "hooks/nft/calls";
import { formatAmount, parseTokenAmount, pageArgsFormat } from "@icpswap/utils";
import { WRAPPED_ICP } from "@icpswap/tokens";
import { TradeStateResult } from "@icpswap/types";
import { Trans } from "@lingui/macro";
import { useNFTsStat } from "@icpswap/hooks";

export function NFTTradeStat({ data }: { data: TradeStateResult }) {
  const { result: metadata } = useNFTCanisterMetadata(data.cid);
  const { result: stat } = useNFTOtherStat(data.cid);
  const [, holders] = stat ?? [0, "--"];

  return (
    <TableRow>
      <>
        <TableCell>
          <Grid container alignItems="center">
            <Avatar src={metadata?.image}>&nbsp;</Avatar>
            <Typography fontSize="14px" color="text.primary" sx={{ margin: "0px 0px 0px 5px" }}>
              {metadata?.name ?? "--"}
            </Typography>
          </Grid>
        </TableCell>
        <TableCell>
          <Typography sx={{ fontSize: "16px", color: "#ffffff" }}>
            {metadata?.mintSupply ? Number(metadata?.mintSupply) : "--"}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography sx={{ fontSize: "16px", color: "#ffffff" }}>{String(holders)}</Typography>
        </TableCell>
        <TableCell>
          <Typography sx={{ fontSize: "16px", color: "#ffffff" }}>
            {formatAmount(parseTokenAmount(data.floorPrice, WRAPPED_ICP.decimals).toNumber(), 4)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography sx={{ fontSize: "16px", color: "#ffffff" }}>
            {formatAmount(parseTokenAmount(data.avgPrice, WRAPPED_ICP.decimals).toNumber(), 4)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography sx={{ fontSize: "16px", color: "#ffffff" }}>
            {formatAmount(parseTokenAmount(data.totalTurnover, WRAPPED_ICP.decimals).toNumber(), 2)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography sx={{ fontSize: "16px", color: "#ffffff" }}>{Number(data.listSize)}</Typography>
        </TableCell>
      </>
    </TableRow>
  );
}

export default function MarketPlace() {
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useNFTsStat(offset, pagination.pageSize);
  const { content, totalElements } = result ?? { totalElements: 0, content: [] as TradeStateResult[] };

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  return (
    <MainContainer>
      <TradeData />

      <Box mt="24px">
        <MainCard>
          <TableContainer className={loading ? "with-loading" : ""}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontSize="16px">
                      <Trans>Name</Trans>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="16px">
                      <Trans>Items</Trans>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="16px">
                      <Trans>Holders</Trans>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="16px">
                      <Trans>Floor Price</Trans>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="16px">
                      <Trans>Average Price</Trans>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="16px">
                      <Trans>Total Volume</Trans>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="16px">
                      <Trans>Transactions Listings</Trans>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {content.map((stat) => (
                  <NFTTradeStat key={stat.cid} data={stat} />
                ))}
              </TableBody>
            </Table>
            {content.length === 0 && !loading ? <NoData /> : null}
            <ListLoading loading={loading} />
          </TableContainer>

          {totalElements && Number(totalElements) !== 0 ? (
            <Pagination total={Number(totalElements)} num={pagination.pageNum} onPageChange={handlePageChange} />
          ) : null}
        </MainCard>
      </Box>
    </MainContainer>
  );
}
