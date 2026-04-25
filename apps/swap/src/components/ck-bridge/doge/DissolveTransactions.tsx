import { Flex } from "@icpswap/ui";
import { isUndefinedOrNull, parseTokenAmount } from "@icpswap/utils";
import { txLinkTypographySx } from "components/ck-bridge/txLinkTypographySx";
import { ALink, MainCard, NoData } from "components/index";
import { Box, Typography, useTheme } from "components/Mui";
import { useDogeDissolveTxs } from "hooks/ck-bridge/doge/index";
import { useTranslation } from "react-i18next";
import type { DogeDissolveTx } from "types/chain-key";
import { dogeTransactionExplorer } from "utils/chain-key";

interface TransactionProps {
  transaction: DogeDissolveTx;
}

function Transaction({ transaction }: TransactionProps) {
  const { t } = useTranslation();
  const theme = useTheme();

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
          <Typography>{t("common.block.index")}</Typography>
          <Typography color="text.primary">{transaction.block_index}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.state")}</Typography>
          <Typography color="text.primary">{transaction.state ?? "--"}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.txid")}</Typography>

          <Typography component="div">
            {transaction.txid ? (
              <Typography sx={txLinkTypographySx} component="div">
                <ALink
                  link={dogeTransactionExplorer(transaction.txid)}
                  color="secondary"
                  textDecorationColor="secondary"
                  align="right"
                >
                  {transaction.txid}
                </ALink>
              </Typography>
            ) : (
              <Typography>--</Typography>
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.amount")}</Typography>
          <Typography color="text.primary">
            {transaction.value ? parseTokenAmount(transaction.value, 8).toFormat() : "--"}
          </Typography>
        </Flex>
      </Flex>
    </Box>
  );
}

export interface DissolveTransactionProps {
  refresh?: boolean | number;
}

export function DissolveTransactions() {
  const { t } = useTranslation();
  const transactions = useDogeDissolveTxs();

  return (
    <MainCard level={1}>
      <Typography sx={{ color: "text.primary", fontSize: "16px" }}>{t("common.retrieved")}</Typography>

      <Box>
        {isUndefinedOrNull(transactions) || transactions.length === 0 ? (
          <NoData tip={t("ck.empty")} />
        ) : (
          transactions.map((transaction, index) => (
            <Box key={index} sx={{ margin: "16px 0 0 0" }}>
              <Transaction transaction={transaction} />
            </Box>
          ))
        )}
      </Box>
    </MainCard>
  );
}
