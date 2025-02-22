import { Link as ReactLink } from "react-router-dom";
import { parseTokenAmount, nanosecond2Millisecond, shorten } from "@icpswap/utils";
import { WRAPPED_ICP_TOKEN_INFO } from "constants/index";
import Pagination from "components/pagination";
import { TxRecord, ResultStatus } from "types/index";
import dayjs from "dayjs";
import Copy from "components/Copy";
import { checkPayment } from "hooks/nft/trade";
import { useFullscreenLoading, useErrorTip, useSuccessTip } from "hooks/useTips";
import upperFirst from "lodash/upperFirst";
import { NoData, TextButton } from "components/index";
import { useTranslation } from "react-i18next";
import { Header, HeaderCell, BodyCell, Flex, ImageLoading, TableRow } from "@icpswap/ui";
import { makeStyles, Box, Typography } from "components/Mui";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "2fr 1.5fr 1fr 1.5fr 1.5fr 1.5fr 1fr 80px",
      "&.user": {
        gridTemplateColumns: "2fr 1.5fr 1fr 1.5fr 1.5fr 1.5fr 1fr 80px 80px",
      },
    },
  };
});

export const NFTSaleRecord = ({ saleRecord, type }: { saleRecord: TxRecord; type?: string }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [openFullscreenLoading, closeFullscreenLoading, loading] = useFullscreenLoading();

  const handleCheckPayment = async () => {
    openFullscreenLoading();

    const { message, status } = await checkPayment(saleRecord.hash);

    if (status === ResultStatus.OK) {
      openSuccessTip(t("nft.payment.check.tips"));
    } else {
      openErrorTip(message);
    }

    closeFullscreenLoading();
  };

  const isCheckPayment = saleRecord.txStatus !== "complete" && saleRecord.txStatus !== "cancel";

  return (
    <TableRow className={`${classes.wrapper}${type === "User" ? " user" : ""}`}>
      <BodyCell>{dayjs(nanosecond2Millisecond(saleRecord.time)).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
      <BodyCell>{saleRecord.name}</BodyCell>
      <Flex gap="0 5px">
        {saleRecord.fileType === "image" ? (
          <img style={{ maxWidth: "24px", maxHeight: "24px" }} src={saleRecord.filePath} alt="" />
        ) : null}
        <ReactLink to={`/marketplace/NFT/view/${saleRecord.nftCid}/${String(saleRecord.tokenIndex)}`}>
          <Typography color="secondary">#{String(saleRecord.tokenIndex)}</Typography>
        </ReactLink>
      </Flex>
      <Copy content={saleRecord.hash}>
        <BodyCell>{shorten(saleRecord.hash, 6)}</BodyCell>
      </Copy>
      <Copy content={saleRecord.seller}>
        <BodyCell>{shorten(saleRecord.seller, 6)}</BodyCell>
      </Copy>
      <Copy content={saleRecord.buyer}>
        <BodyCell>{shorten(saleRecord.buyer, 6)}</BodyCell>
      </Copy>
      <BodyCell>
        {parseTokenAmount(saleRecord.price, WRAPPED_ICP_TOKEN_INFO.decimals).toFormat()} {WRAPPED_ICP_TOKEN_INFO.symbol}
      </BodyCell>
      <BodyCell>{upperFirst(saleRecord.txStatus === "complete" ? "done" : saleRecord.txStatus)}</BodyCell>
      {type === "User" ? (
        <BodyCell>
          {isCheckPayment ? (
            <TextButton onClick={handleCheckPayment} disabled={loading}>
              CheckPayment
            </TextButton>
          ) : null}
        </BodyCell>
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
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ width: "100%", minWidth: "960px" }}>
          <Header className={`${classes.wrapper}${type === "User" ? " user" : ""}`}>
            <HeaderCell>{t("common.time")}</HeaderCell>
            <HeaderCell>{t("nft.name")}</HeaderCell>
            <HeaderCell>{t("nft.id")}</HeaderCell>
            <HeaderCell>{t("common.tx")}</HeaderCell>
            <HeaderCell>{t("common.seller")}</HeaderCell>
            <HeaderCell>{t("common.buyer")}</HeaderCell>
            <HeaderCell>{t("common.price")}</HeaderCell>
            <HeaderCell>{t("common.state")}</HeaderCell>
            {type === "User" ? <HeaderCell>{t("common.action")}</HeaderCell> : null}
          </Header>

          <>
            {content.map((saleRecord) => (
              <NFTSaleRecord key={saleRecord.hash} saleRecord={saleRecord} type={type} />
            ))}
          </>
        </Box>

        {content.length === 0 && !loading ? <NoData /> : null}
        <ImageLoading loading={loading} />
      </Box>

      {Number(totalElements) > 0 ? (
        <Pagination
          count={Number(totalElements)}
          onPageChange={handlePageChange}
          defaultPageSize={pagination.pageSize}
        />
      ) : null}
    </>
  );
}
