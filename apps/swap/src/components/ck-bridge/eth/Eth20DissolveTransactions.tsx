import { useTheme, makeStyles, Box, Typography } from "components/Mui";
import { Trans } from "@lingui/macro";
import { MainCard, NoData, ALink } from "components/index";
import { useAccountPrincipalString } from "store/auth/hooks";
import { parseTokenAmount } from "@icpswap/utils";
import { ckETH } from "@icpswap/tokens";
import { Flex } from "@icpswap/ui";
import { EXPLORER_TX_LINK } from "constants/ckERC20";
import { useUserWithdrawTxs } from "store/web3/hooks";
import { StoredWithdrawTxValue } from "types/ckETH";

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
  transaction: StoredWithdrawTxValue;
}

function Transaction({ transaction }: TransactionProps) {
  const theme = useTheme();
  const classes = useStyles();

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
          <Typography>
            <Trans>Block</Trans>
          </Typography>
          <Typography color="text.primary">{transaction.block_index}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>State</Trans>
          </Typography>
          <Typography color="text.primary">{transaction.state ?? "--"}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>Txid</Trans>
          </Typography>

          <Typography color="text.primary">
            {transaction.hash ? (
              <Typography className={classes.txLink}>
                <ALink
                  link={`${EXPLORER_TX_LINK}/${transaction.hash}`}
                  color="secondary"
                  textDecorationColor="secondary"
                >
                  {transaction.hash}
                </ALink>
              </Typography>
            ) : (
              "--"
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>Amount</Trans>
          </Typography>
          <Typography color="text.primary">
            {transaction.value ? parseTokenAmount(transaction.value, ckETH.decimals).toFormat() : "--"}
          </Typography>
        </Flex>
      </Flex>
    </Box>
  );
}

export function EthDissolveTransactions() {
  const principal = useAccountPrincipalString();
  const transactions = useUserWithdrawTxs(principal);

  return (
    <MainCard level={1}>
      <Typography sx={{ color: "text.primary", fontSize: "16px" }}>
        <Trans>Transactions</Trans>
      </Typography>

      <Box>
        <>
          {transactions?.map((transaction, index) => (
            <Box key={index} sx={{ margin: "16px 0 0 0" }}>
              <Transaction transaction={transaction} />
            </Box>
          ))}
          {transactions?.length === 0 || !transactions ? <NoData /> : null}
        </>
      </Box>
    </MainCard>
  );
}
