import { useState, useMemo } from "react";
import { Box, makeStyles, useTheme } from "components/Mui";
import { useTokenHolders, useLiquidityLockIds } from "@icpswap/hooks";
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
import { BigNumber, formatAmount, formatDollarAmount, principalToAccount } from "@icpswap/utils";
import { Null, IcpSwapAPITokenHolderDetail } from "@icpswap/types";
import { useCopySuccess } from "hooks/index";
import { useTranslation } from "react-i18next";

export interface StyleProps {
  padding?: string;
}

const useStyles = (styleProps?: StyleProps) =>
  makeStyles(() => {
    return {
      wrapper: {
        display: "grid",
        gap: "1em",
        alignItems: "center",
        gridTemplateColumns: "100px repeat(3, 1fr) 100px",
        padding: styleProps?.padding ?? "16px",
      },
    };
  });

interface HolderRowProps {
  holder: IcpSwapAPITokenHolderDetail;
  index: number;
  page: number;
  sneedLedger?: string | Null;
  styleProps?: StyleProps;
}

function HolderRow({ page, sneedLedger, holder, index, styleProps }: HolderRowProps) {
  const classes = useStyles(styleProps)();
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

      <BodyCell>{formatAmount(holder.amount)}</BodyCell>

      <BodyCell>{formatDollarAmount(holder.valueUSD)}</BodyCell>

      <BodyCell>{new BigNumber(holder.amount).dividedBy(holder.totalSupply).multipliedBy(100).toFixed(2)}%</BodyCell>
    </TableRow>
  );
}

const maxItems = 10;

export interface PoolTransactionsProps {
  tokenId: string | Null;
  styleProps?: StyleProps;
}

export function Holders({ tokenId, styleProps }: PoolTransactionsProps) {
  const { t } = useTranslation();
  const classes = useStyles(styleProps)();
  const theme = useTheme();

  const [page, setPage] = useState(1);

  const { result, loading } = useTokenHolders(tokenId, page, 10);

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
            <HeaderCell field="token0Amount">{t("common.address")}</HeaderCell>
            <HeaderCell field="token1Amount">{t("common.amount")}</HeaderCell>
            <HeaderCell field="priceRange">{t("common.value")}</HeaderCell>
            <HeaderCell field="unclaimedFees">%</HeaderCell>
          </Header>

          {!loading
            ? (result?.content ?? []).map((element, index) => (
                <HolderRow
                  key={index}
                  page={page}
                  holder={element}
                  index={index}
                  sneedLedger={sneedLedger}
                  styleProps={styleProps}
                />
              ))
            : null}

          {(result?.content ?? []).length === 0 && !loading ? <NoData /> : null}

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

      <Box sx={{ padding: "20px 0" }}>
        {!loading && !!result?.content.length ? (
          <SimplePagination
            page={page}
            maxItems={maxItems}
            length={result?.totalElements ? Number(result.totalElements) : 0}
            onPageChange={setPage}
          />
        ) : null}
      </Box>
    </Box>
  );
}
