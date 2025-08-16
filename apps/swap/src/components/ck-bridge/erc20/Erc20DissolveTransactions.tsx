import { useTheme, makeStyles, Box, Typography } from "components/Mui";
import { MainCard, NoData, ALink } from "components/index";
import { isUndefinedOrNull, parseTokenAmount } from "@icpswap/utils";
import { LoadingRow, Flex } from "@icpswap/ui";
import { useChainKeyMinterInfo } from "@icpswap/hooks";
import type { WithdrawalDetail, ChainKeyETHMinterInfo } from "@icpswap/types";
import { useMemo } from "react";
import { MINTER_CANISTER_ID, EXPLORER_TX_LINK, EXPLORER_ADDRESS_LINK } from "constants/ckERC20";
import { formatWithdrawalStatus } from "utils/web3/withdrawalState";
import { useToken } from "hooks/index";
import { Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";
import { useErc20DissolveTxs } from "hooks/ck-bridge/useErc20DissolveTxs";

const useStyles = makeStyles(() => ({
  txLink: {
    maxWidth: "380px",
    wordBreak: "break-all",
    whiteSpace: "break-spaces",
    textAlign: "right",
    lineHeight: "16px",
    "@media(max-width:640px)": { width: "220px" },
  },
}));

interface TransactionProps {
  transaction: WithdrawalDetail;
  minterInfo: ChainKeyETHMinterInfo | undefined;
}

function Transaction({ transaction, minterInfo }: TransactionProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const { state, hash } = formatWithdrawalStatus(transaction.status);

  const { ledger_id } = useMemo(() => {
    if (!minterInfo) return {};

    const supported_tokens = minterInfo.supported_ckerc20_tokens[0];

    if (!supported_tokens) return {};

    const ckerc20_token = supported_tokens.find((supported_token) => {
      return supported_token.ckerc20_token_symbol === transaction.token_symbol;
    });

    if (!ckerc20_token) return {};

    return {
      ledger_id: ckerc20_token.ledger_canister_id.toString(),
    };
  }, [minterInfo, transaction]);

  const [, token] = useToken(ledger_id);

  return (
    <Box
      sx={{
        padding: "16px",
        background: theme.palette.background.level1,
        border: `1px solid ${theme.palette.background.level4}`,
        borderRadius: "12px",
      }}
    >
      <Flex vertical gap="12px 0" align="flex-start">
        <Flex fullWidth justify="space-between">
          <Typography>{t("common.withdrawal.id")}</Typography>
          <Typography color="text.primary">{transaction.withdrawal_id.toString()}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.state")}</Typography>
          <Typography color="text.primary">{state}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.txid")}</Typography>

          <Typography component="div">
            {hash ? (
              <Typography className={classes.txLink} component="div">
                <ALink
                  link={`${EXPLORER_TX_LINK}/${hash}`}
                  color="secondary"
                  textDecorationColor="secondary"
                  fontSize="16px"
                  align="right"
                >
                  {hash}
                </ALink>
              </Typography>
            ) : (
              <Typography>--</Typography>
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.token")}</Typography>
          <Typography color="text.primary">{transaction.token_symbol}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.amount")}</Typography>
          <Typography color="text.primary">
            {token
              ? parseTokenAmount(transaction.withdrawal_amount.toString(), token.decimals).toFormat()
              : transaction.withdrawal_amount.toString()}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.from")}</Typography>
          <Typography className={classes.txLink}>{transaction.from.toString()}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.recipient")}</Typography>

          <Typography className={classes.txLink} component="div">
            <ALink
              link={`${EXPLORER_ADDRESS_LINK}/${transaction.recipient_address}`}
              color="secondary"
              textDecorationColor="secondary"
              fontSize="16px"
              align="right"
            >
              {transaction.recipient_address}
            </ALink>
          </Typography>
        </Flex>
      </Flex>
    </Box>
  );
}

export interface DissolveRecordsProps {
  token: Token | undefined;
}

export function Erc20DissolveTransactions({ token }: DissolveRecordsProps) {
  const { t } = useTranslation();
  const { result: minterInfo } = useChainKeyMinterInfo(MINTER_CANISTER_ID);
  const { result: withdrawalResult, loading } = useErc20DissolveTxs();

  const transactions = useMemo(() => {
    if (!token || !withdrawalResult) return [];

    return withdrawalResult
      .filter((ele) => ele.token_symbol === token.symbol)
      .sort((a, b) => {
        if (a.withdrawal_id < b.withdrawal_id) return 1;
        if (a.withdrawal_id > b.withdrawal_id) return -1;
        return 0;
      });
  }, [withdrawalResult, token]);

  return (
    <MainCard level={1}>
      <Typography sx={{ color: "text.primary", fontSize: "16px" }}>{t("common.transactions")}</Typography>

      <Typography sx={{ margin: "12px 0 0 0", lineHeight: "20px", fontSize: "12px" }}>
        {t("ck.ether.sync", { symbol0: token?.symbol.replace("ck", ""), symbol1: token?.symbol })}
      </Typography>

      <Box>
        {loading ? (
          <Box sx={{ padding: "24px 0" }}>
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
            </LoadingRow>
          </Box>
        ) : (
          <>
            {isUndefinedOrNull(transactions) || transactions.length === 0 ? (
              <NoData tip={t("ck.empty")} />
            ) : (
              transactions.map((transaction, index) => (
                <Box key={index} sx={{ margin: "16px 0 0 0" }}>
                  <Transaction transaction={transaction} minterInfo={minterInfo} />
                </Box>
              ))
            )}
          </>
        )}
      </Box>
    </MainCard>
  );
}
