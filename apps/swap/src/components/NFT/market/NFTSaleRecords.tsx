import { Link as ReactLink } from "react-router-dom";
import { Table, TableContainer, TableCell, TableRow, TableHead, TableBody, Typography, Grid } from "@mui/material";
import { parseTokenAmount, nanosecond2Millisecond, shorten } from "@icpswap/utils";
import { WRAPPED_ICP_TOKEN_INFO } from "constants/index";
import Pagination from "components/pagination";
import { Trans, t } from "@lingui/macro";
import { TxRecord, ResultStatus } from "types/index";
import dayjs from "dayjs";
import Copy from "components/Copy";
import { checkPayment } from "hooks/nft/trade";
import { useFullscreenLoading, useErrorTip, useSuccessTip } from "hooks/useTips";
import upperFirst from "lodash/upperFirst";
import { NoData, ListLoading, TextButton } from "components/index";

export const NFTSaleRecord = ({ saleRecord, type }: { saleRecord: TxRecord; type?: string }) => {
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [openFullscreenLoading, closeFullscreenLoading, loading] = useFullscreenLoading();

  const handleCheckPayment = async () => {
    openFullscreenLoading();

    const { message, status } = await checkPayment(saleRecord.hash);

    if (status === ResultStatus.OK) {
      openSuccessTip(t`Checked payment successfully`);
    } else {
      openErrorTip(message);
    }

    closeFullscreenLoading();
  };

  const isCheckPayment = saleRecord.txStatus !== "complete" && saleRecord.txStatus !== "cancel";

  return (
    <TableRow>
      <TableCell>
        <Typography>{dayjs(nanosecond2Millisecond(saleRecord.time)).format("YYYY-MM-DD HH:mm:ss")}</Typography>
      </TableCell>
      <TableCell>
        <Grid container>
          <Typography>{saleRecord.name}</Typography>
        </Grid>
      </TableCell>
      <TableCell>
        <Grid container alignItems="center">
          {saleRecord.fileType === "image" ? (
            <img style={{ maxWidth: "24px", maxHeight: "24px", marginRight: "5px" }} src={saleRecord.filePath} alt="" />
          ) : null}
          <ReactLink to={`/marketplace/NFT/view/${saleRecord.nftCid}/${String(saleRecord.tokenIndex)}`}>
            <Typography color="secondary">#{String(saleRecord.tokenIndex)}</Typography>
          </ReactLink>
        </Grid>
      </TableCell>
      <TableCell>
        <Copy content={saleRecord.hash}>
          <Typography>{shorten(saleRecord.hash, 6)}</Typography>
        </Copy>
      </TableCell>
      <TableCell>
        <Copy content={saleRecord.seller}>
          <Typography>{shorten(saleRecord.seller, 6)}</Typography>
        </Copy>
      </TableCell>
      <TableCell>
        <Copy content={saleRecord.buyer}>
          <Typography>{shorten(saleRecord.buyer, 6)}</Typography>
        </Copy>
      </TableCell>
      <TableCell>
        <Typography>
          {parseTokenAmount(saleRecord.price, WRAPPED_ICP_TOKEN_INFO.decimals).toFormat()}{" "}
          {WRAPPED_ICP_TOKEN_INFO.symbol}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography>{upperFirst(saleRecord.txStatus === "complete" ? "done" : saleRecord.txStatus)}</Typography>
      </TableCell>
      {type === "User" ? (
        <TableCell>
          {isCheckPayment ? (
            <TextButton onClick={handleCheckPayment} disabled={loading}>
              CheckPayment
            </TextButton>
          ) : null}
        </TableCell>
      ) : null}
    </TableRow>
  );
};

export default function NFTSaleRecords({
  handlePageChange,
  loading,
  totalElements,
  content,
  pagination,
  type,
}: {
  handlePageChange: (pagination: any) => void;
  loading: boolean;
  totalElements: number | bigint;
  content: TxRecord[];
  pagination: { pageNum: number; pageSize: number };
  type?: string;
}) {
  return (
    <>
      <TableContainer className={loading ? "with-loading" : ""}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Trans>Time</Trans>
              </TableCell>
              <TableCell>
                <Trans>NFT Name</Trans>
              </TableCell>
              <TableCell>
                <Trans>NFT ID</Trans>
              </TableCell>
              <TableCell>
                <Trans>Tx</Trans>
              </TableCell>
              <TableCell>
                <Trans>Seller</Trans>
              </TableCell>
              <TableCell>
                <Trans>Buyer</Trans>
              </TableCell>
              <TableCell>
                <Trans>Price</Trans>
              </TableCell>
              <TableCell>
                <Trans>Status</Trans>
              </TableCell>
              {type === "User" ? (
                <TableCell>
                  <Trans>Action</Trans>
                </TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {content.map((saleRecord) => (
              <NFTSaleRecord key={saleRecord.hash} saleRecord={saleRecord} type={type} />
            ))}
          </TableBody>
        </Table>

        {content.length === 0 && !loading ? <NoData /> : null}
        <ListLoading loading={loading} />

        {Number(totalElements) > 0 ? (
          <Pagination
            count={Number(totalElements)}
            onPageChange={handlePageChange}
            defaultPageSize={pagination.pageSize}
          />
        ) : null}
      </TableContainer>
    </>
  );
}
