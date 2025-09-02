import { Typography, Box, useTheme } from "components/Mui";
import { useAccountPrincipalString } from "store/auth/hooks";
import { enumToString, BigNumber } from "@icpswap/utils";
import { LoadingRow, TokenImage } from "components/index";
import type { InfoTransactionResponse } from "@icpswap/types";
import dayjs from "dayjs";
import { DAYJS_FORMAT } from "constants/index";
import { useToken } from "hooks/index";
import { ArrowUpRight } from "react-feather";
import { Link, Modal, SwapTransactionPriceTip } from "@icpswap/ui";
import { useTranslation } from "react-i18next";
import i18n from "i18n";
import { UserTransactionsEmpty } from "components/swap/UserTransactionsEmpty";
import { useUserSwapTransactions } from "@icpswap/hooks";
import { useMemo } from "react";

export const RECORD_TYPE: { [key: string]: string } = {
  swap: i18n.t("common.swap"),
  increaseLiquidity: i18n.t("swap.add.liquidity"),
  decreaseLiquidity: i18n.t("swap.remove.liquidity"),
  mint: i18n.t("swap.add.liquidity"),
  addLiquidity: i18n.t("swap.add.liquidity"),
  claim: i18n.t("common.collect"),
};

interface SwapTransactionItemProps {
  transaction: InfoTransactionResponse;
}

function SwapTransactionItem({ transaction }: SwapTransactionItemProps) {
  const theme = useTheme();

  const token0Amount = useMemo(() => {
    return new BigNumber(transaction.token0AmountIn).isEqualTo(0)
      ? transaction.token0AmountOut
      : transaction.token0AmountIn;
  }, [transaction]);

  const token1Amount = useMemo(() => {
    return new BigNumber(transaction.token1AmountIn).isEqualTo(0)
      ? transaction.token1AmountOut
      : transaction.token1AmountIn;
  }, [transaction]);

  const symbol0 = transaction.token0Symbol;
  const symbol1 = transaction.token1Symbol;

  const [, token0] = useToken(transaction.token0LedgerId);
  const [, token1] = useToken(transaction.token1LedgerId);

  return (
    <Box
      sx={{
        padding: "12px 0",
        display: "flex",
        gap: "0 12px",
        alignItems: "center",
        cursor: "pointer",
        "&:hover": {
          background: theme.palette.background.level2,
        },
        "@media(max-width: 640px)": {
          padding: "10px 12px",
        },
      }}
    >
      <Box sx={{ display: "flex" }}>
        <TokenImage logo={token0?.logo} size="24px" tokenId={token0?.address} />
        <TokenImage logo={token1?.logo} size="24px" sx={{ margin: "0 0 0 -6px" }} />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>{RECORD_TYPE[transaction.actionType.toLowerCase()]}</Typography>
          <Typography sx={{ fontSize: "12px" }}>{dayjs(Number(transaction.txTime)).format(DAYJS_FORMAT)}</Typography>
        </Box>
        <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, margin: "8px 0 0 0" }}>
          {enumToString(transaction.actionType) === "swap" ? (
            <>
              {token0Amount} <SwapTransactionPriceTip symbol={symbol0} price={transaction.token0Price} /> to{" "}
              {token1Amount} <SwapTransactionPriceTip symbol={symbol1} price={transaction.token1Price} />
            </>
          ) : (
            <>
              {token0Amount} <SwapTransactionPriceTip symbol={symbol0} price={transaction.token0Price} /> and{" "}
              {token1Amount} <SwapTransactionPriceTip symbol={symbol1} price={transaction.token1Price} />
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
}

export interface SwapTransactionsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SwapTransactionsModal({ open, onClose }: SwapTransactionsModalProps) {
  const { t } = useTranslation();
  const principal = useAccountPrincipalString();
  const theme = useTheme();

  const { startTime, endTime } = useMemo(() => {
    const now = new Date().getTime();
    const startTime = new BigNumber(now).minus(180 * 24 * 3600 * 1000).toNumber();
    const endTime = now;

    return { startTime, endTime };
  }, []);

  const { result, loading } = useUserSwapTransactions({
    principal,
    poolId: undefined,
    page: 1,
    limit: 100,
    startTime,
    endTime,
  });

  const transactions = result?.content;

  return (
    <Modal open={open} onClose={onClose} title={t("swap.history")}>
      <Box sx={{ overflow: "hidden auto", height: "340px" }}>
        {transactions?.map((transaction, index) => <SwapTransactionItem key={index} transaction={transaction} />)}
        {(transactions?.length === 0 || !transactions) && !loading ? <UserTransactionsEmpty onClick={onClose} /> : null}

        {loading ? (
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
            <div />
          </LoadingRow>
        ) : null}
      </Box>

      {!loading && !!transactions ? (
        <Link to={`/info-tools/swap-transactions?principal=${principal}`}>
          <Typography
            sx={{
              display: "flex",
              gap: "0 3px",
              alignItems: "center",
              justifyContent: "center",
              height: "32px",
              cursor: "pointer",
              borderTop: `1px solid ${theme.palette.background.level2}`,
            }}
          >
            <Typography sx={{ fontSize: "12px" }} component="span" color="secondary">
              {t("common.view.more")}
            </Typography>
            <ArrowUpRight color={theme.colors.secondaryMain} size="16px" />
          </Typography>
        </Link>
      ) : null}
    </Modal>
  );
}
