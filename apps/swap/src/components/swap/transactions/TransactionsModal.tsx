import { Typography, Box, useTheme } from "components/Mui";
import { useUserSwapTransactions } from "hooks/swap/v3Calls";
import { useAccountPrincipalString } from "store/auth/hooks";
import { enumToString, BigNumber } from "@icpswap/utils";
import { LoadingRow, TokenImage } from "components/index";
import type { UserStorageTransaction } from "@icpswap/types";
import dayjs from "dayjs";
import { DAYJS_FORMAT } from "constants/index";
import { useToken } from "hooks/index";
import { ArrowUpRight } from "react-feather";
import { Link, Modal, SwapTransactionPriceTip } from "@icpswap/ui";
import { useTranslation } from "react-i18next";
import i18n from "i18n";
import { UserTransactionsEmpty } from "components/swap/UserTransactionsEmpty";

export const RECORD_TYPE: { [key: string]: string } = {
  swap: i18n.t("common.swap"),
  increaseLiquidity: i18n.t("swap.add.liquidity"),
  decreaseLiquidity: i18n.t("swap.remove.liquidity"),
  mint: i18n.t("swap.add.liquidity"),
  addLiquidity: i18n.t("swap.add.liquidity"),
  claim: i18n.t("common.collect"),
};

interface SwapTransactionItemProps {
  transaction: UserStorageTransaction;
}

function SwapTransactionItem({ transaction }: SwapTransactionItemProps) {
  const theme = useTheme();

  const amount0 = new BigNumber(transaction.token0ChangeAmount).toFormat();
  const amount1 = new BigNumber(transaction.token1ChangeAmount).toFormat();

  const symbol0 = transaction.token0Symbol;
  const symbol1 = transaction.token1Symbol;

  const [, token0] = useToken(transaction.token0Id);
  const [, token1] = useToken(transaction.token1Id);

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
          <Typography>{RECORD_TYPE[enumToString(transaction.action)]}</Typography>
          <Typography sx={{ fontSize: "12px" }}>
            {dayjs(Number(transaction.timestamp * BigInt(1000))).format(DAYJS_FORMAT)}
          </Typography>
        </Box>
        <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, margin: "8px 0 0 0" }}>
          {enumToString(transaction.action) === "swap" ? (
            <>
              {amount0} <SwapTransactionPriceTip symbol={symbol0} price={transaction.token0Price} /> to {amount1}{" "}
              <SwapTransactionPriceTip symbol={symbol1} price={transaction.token1Price} />
            </>
          ) : (
            <>
              {amount0} <SwapTransactionPriceTip symbol={symbol0} price={transaction.token0Price} /> and {amount1}{" "}
              <SwapTransactionPriceTip symbol={symbol1} price={transaction.token1Price} />
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

  const { loading, result } = useUserSwapTransactions(principal, 0, 100);
  const transactions = !principal ? undefined : result?.content;

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
