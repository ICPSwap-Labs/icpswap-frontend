import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, makeStyles, Typography, useTheme } from "components/Mui";
import { InfoWrapper } from "components/index";
import { BigNumber, formatDollarAmount, principalToAccount } from "@icpswap/utils";
import { Trans } from "@lingui/macro";
import { useExplorerTokenHolders, useLiquidityLockIds } from "@icpswap/hooks";
import {
  Header,
  HeaderCell,
  TableRow,
  BodyCell,
  LoadingRow,
  NoData,
  TextualAddress,
  Image,
  BreadcrumbsV1,
  Pagination,
  PaginationType,
} from "@icpswap/ui";
import { Null, IcExplorerTokenHolderDetail } from "@icpswap/types";
import { useCopySuccess } from "hooks/index";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      gridTemplateColumns: "100px repeat(3, 1fr) 100px",
      padding: "20px 24px",
    },
  };
});

interface HolderRowProps {
  holder: IcExplorerTokenHolderDetail;
  index: number;
  page: number;
  sneedLedger?: string | Null;
}

function HolderRow({ page, sneedLedger, holder, index }: HolderRowProps) {
  const classes = useStyles();
  const theme = useTheme();

  const isSneed = useMemo(() => {
    if (!holder || !sneedLedger) return false;

    return principalToAccount(sneedLedger) === holder.owner;
  }, [sneedLedger, holder]);

  const copySuccess = useCopySuccess();

  return (
    <TableRow className={classes.wrapper} borderBottom={`1px solid ${theme.palette.border.level1}`}>
      <BodyCell>{index + 1 + (page - 1) * 10}</BodyCell>

      <BodyCell sx={{ gap: "0 4px" }}>
        <TextualAddress
          alias={holder.alias}
          owner={holder.owner}
          subaccount={holder.subaccount}
          account={holder.accountId}
          sx={{
            fontSize: "inherit",
            color: "inherit",
          }}
          onCopy={copySuccess}
        />
        {isSneed ? <Image src="/images/sneed.svg" alt="" style={{ width: "18px", height: "18px" }} /> : null}
      </BodyCell>

      <BodyCell>{new BigNumber(holder.amount).toFormat(holder.tokenDecimal > 8 ? 8 : holder.tokenDecimal)}</BodyCell>

      <BodyCell>{formatDollarAmount(holder.valueUSD)}</BodyCell>

      <BodyCell>{new BigNumber(holder.amount).dividedBy(holder.totalSupply).multipliedBy(100).toFixed(2)}%</BodyCell>
    </TableRow>
  );
}

export default function Holders() {
  const classes = useStyles();
  const theme = useTheme();

  const { id: tokenId } = useParams<{ id: string }>();

  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });

  const { result, loading } = useExplorerTokenHolders(tokenId, pagination.pageNum, 10);

  const tokenIds = useMemo(() => {
    return tokenId ? [tokenId] : undefined;
  }, [tokenId]);

  const { result: locksIds } = useLiquidityLockIds(tokenIds);

  const sneedLedger = useMemo(() => {
    if (!locksIds) return undefined;
    return locksIds.find((e) => e.alias[0] === "Sneedlocked")?.ledger_id.toString();
  }, [locksIds]);

  const handlePageChange = useCallback(
    (pagination: PaginationType) => {
      setPagination(pagination);
    },
    [setPagination],
  );

  return (
    <InfoWrapper>
      <BreadcrumbsV1
        links={[
          { link: "/info-tokens", label: <Trans>Tokens</Trans> },
          {
            link: `/info-tokens/details/${tokenId}`,
            label: <Trans>Token Details</Trans>,
          },
          {
            label: <Trans>Holders</Trans>,
          },
        ]}
      />

      <Box sx={{ background: theme.palette.background.level3, borderRadius: "16px", margin: "16px 0 0 0" }}>
        <Typography
          sx={{
            fontSize: "20px",
            padding: "24px 24px",
            fontWeight: 600,
            borderBottom: `1px solid ${theme.palette.border.level1}`,
          }}
        >
          <Trans>Holders</Trans>
        </Typography>

        <Box sx={{ width: "100%" }}>
          <Box sx={{ width: "100%", overflow: "auto" }}>
            <Box sx={{ minWidth: "1026px" }}>
              <Header className={classes.wrapper} borderBottom={`1px solid ${theme.palette.border.level1}`}>
                <HeaderCell field="PositionId">
                  <Trans>Rank</Trans>
                </HeaderCell>

                <HeaderCell field="token0Amount">
                  <Trans>Address</Trans>
                </HeaderCell>

                <HeaderCell field="token1Amount">
                  <Trans>Amount</Trans>
                </HeaderCell>

                <HeaderCell field="priceRange">
                  <Trans>Value</Trans>
                </HeaderCell>

                <HeaderCell field="unclaimedFees">
                  <Trans>%</Trans>
                </HeaderCell>
              </Header>

              {!loading
                ? (result?.list ?? []).map((element, index) => (
                    <HolderRow
                      key={index}
                      page={pagination.pageNum}
                      holder={element}
                      index={index}
                      sneedLedger={sneedLedger}
                    />
                  ))
                : null}

              {(result?.list ?? []).length === 0 && !loading ? <NoData /> : null}

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
                  </LoadingRow>
                </Box>
              ) : null}
            </Box>
          </Box>

          <Box sx={{ padding: "24px 24px" }}>
            {!loading && !!result?.list.length ? (
              <Pagination
                num={pagination.pageNum}
                defaultPageSize={pagination.pageSize}
                total={result?.total ? Number(result.total) : 0}
                onPageChange={handlePageChange}
                mt="0"
              />
            ) : null}
          </Box>
        </Box>
      </Box>
    </InfoWrapper>
  );
}
