import { useState, useMemo } from "react";
import { Box, makeStyles, useTheme } from "components/Mui";
import { useExplorerTokenHolders, useLiquidityLockIds } from "@icpswap/hooks";
import {
  Header,
  HeaderCell,
  TableRow,
  BodyCell,
  LoadingRow,
  NoData,
  SimplePagination,
  TextualAddress,
  Image,
} from "@icpswap/ui";
import { BigNumber, formatDollarAmount, principalToAccount } from "@icpswap/utils";
import { Null, IcExplorerTokenHolderDetail } from "@icpswap/types";
import { useCopySuccess } from "hooks/index";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      gridTemplateColumns: "100px repeat(3, 1fr) 100px",
      padding: "16px",
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

const maxItems = 10;

export interface PoolTransactionsProps {
  tokenId: string | Null;
}

export function Holders({ tokenId }: PoolTransactionsProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  const [page, setPage] = useState(1);

  const { result, loading } = useExplorerTokenHolders(tokenId, page, 10);

  const tokenIds = useMemo(() => {
    return tokenId ? [tokenId] : undefined;
  }, [tokenId]);

  const { result: locksIds } = useLiquidityLockIds(tokenIds);

  const sneedLedger = useMemo(() => {
    if (!locksIds) return undefined;
    return locksIds.find((e) => e.alias[0] === "Sneedlocked")?.ledger_id.toString();
  }, [locksIds]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ minWidth: "1026px" }}>
          <Header className={classes.wrapper} borderBottom={`1px solid ${theme.palette.border.level1}`}>
            <HeaderCell field="PositionId">{t("common.rank")}</HeaderCell>

            <HeaderCell field="token0Amount">{t("common.address.colon")}</HeaderCell>

            <HeaderCell field="token1Amount">{t("common.amount")}</HeaderCell>

            <HeaderCell field="priceRange">{t("common.value")}</HeaderCell>

            <HeaderCell field="unclaimedFees">%</HeaderCell>
          </Header>

          {!loading
            ? (result?.list ?? []).map((element, index) => (
                <HolderRow key={index} page={page} holder={element} index={index} sneedLedger={sneedLedger} />
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

      <Box mt="20px">
        {!loading && !!result?.list.length ? (
          <SimplePagination
            page={page}
            maxItems={maxItems}
            length={result?.total ? Number(result.total) : 0}
            onPageChange={setPage}
          />
        ) : null}
      </Box>
    </Box>
  );
}
