import { Typography, Box, useTheme, Avatar } from "@mui/material";
import { useUserSwapTransactions } from "hooks/swap/v3Calls";
import { useAccountPrincipalString } from "store/auth/hooks";
import { enumToString } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { LoadingRow, NoData } from "components/index";
import type { UserStorageTransaction } from "@icpswap/types";
import dayjs from "dayjs";
import { DAYJS_FORMAT, INFO_URL } from "constants/index";
import { Theme } from "@mui/material/styles";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { mockALinkAndOpen } from "utils/index";
import { t } from "@lingui/macro";

function ArrowIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.87558 1.64258H0.927903V0.642578H7.08452H7.58452V1.14258V7.29919H6.58452V2.34786L1.34151 7.59087L0.634399 6.88376L5.87558 1.64258Z"
        fill="#5669dc"
      />
    </svg>
  );
}

export const RECORD_TYPE: { [key: string]: string } = {
  swap: "Swap",
  increaseLiquidity: "Add Liquidity",
  decreaseLiquidity: "Remove Liquidity",
  mint: "Add Liquidity",
  addLiquidity: "Add Liquidity",
  claim: "Collect",
};

interface SwapTransactionItemProps {
  transaction: UserStorageTransaction;
}

function SwapTransactionItem({ transaction }: SwapTransactionItemProps) {
  const theme = useTheme() as Theme;

  const amount0 = new BigNumber(transaction.token0ChangeAmount).toFormat();
  const amount1 = new BigNumber(transaction.token1ChangeAmount).toFormat();

  const symbol0 = transaction.token0Symbol;
  const symbol1 = transaction.token1Symbol;

  const { result: token0 } = useTokenInfo(transaction.token0Id);
  const { result: token1 } = useTokenInfo(transaction.token1Id);

  return (
    <Box
      sx={{
        padding: "12px 24px",
        display: "flex",
        gap: "0 12px",
        alignItems: "center",
        cursor: "pointer",
        "&:hover": {
          background: theme.palette.background.level2,
        },
        "@media(max-width: 640px)": {
          padding: "10px 0px",
        },
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Avatar src={token0?.logo} sx={{ width: "24px", height: "24px" }}>
          &nbsp;
        </Avatar>
        <Avatar src={token1?.logo} sx={{ width: "24px", height: "24px", margin: "0 0 0 -6px" }}>
          &nbsp;
        </Avatar>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>{RECORD_TYPE[enumToString(transaction.action)]}</Typography>
          <Typography sx={{ fontSize: "12px" }}>
            {dayjs(Number(transaction.timestamp * BigInt(1000))).format(DAYJS_FORMAT)}
          </Typography>
        </Box>
        <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, margin: "4px 0 0 0" }}>
          {enumToString(transaction.action) === "swap"
            ? t`${amount0} ${symbol0} to ${amount1} ${symbol1}`
            : `${amount0} ${symbol0} and ${amount1} ${symbol1}`}
        </Typography>
      </Box>
    </Box>
  );
}

export default function SwapTransactions() {
  const principal = useAccountPrincipalString();
  const theme = useTheme() as Theme;

  const { loading, result } = useUserSwapTransactions(principal, 0, 500);
  const list = !principal ? undefined : result?.content;

  const handleViewMore = () => {
    mockALinkAndOpen(`${INFO_URL}/swap-scan/transactions?principal=${principal}`, "SWAP_TRANSACTIONS_VIEW_MORE");
  };

  return (
    <>
      <Box sx={{ overflow: "hidden auto", height: "340px" }}>
        {list?.map((transaction, index) => <SwapTransactionItem key={index} transaction={transaction} />)}
        {(list?.length === 0 || !list) && !loading ? <NoData /> : null}

        {loading ? (
          <Box sx={{ padding: "0 24px" }}>
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
          </Box>
        ) : null}
      </Box>

      {!loading && !!list ? (
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
          onClick={handleViewMore}
        >
          <Typography sx={{ fontSize: "12px" }} component="span" color="secondary">
            View more
          </Typography>
          <ArrowIcon />
        </Typography>
      ) : null}
    </>
  );
}
