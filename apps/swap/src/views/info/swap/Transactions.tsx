import { Box, Typography } from "@mui/material";
import { useState, useMemo } from "react";
import { useBaseTransactions } from "hooks/info/index";
import { Transactions } from "components/info/index";
import { Trans } from "@lingui/macro";
import { useTokensFromList } from "@icpswap/hooks";
import { ICP } from "@icpswap/tokens";
import { MainCard, OnlyTokenList } from "@icpswap/ui";

export default function AllTransactions() {
  const [checked, setChecked] = useState(true);

  const { result, loading } = useBaseTransactions(0, 500);
  const transactions = result?.content;

  const handleCheckChange = (checked: boolean) => {
    setChecked(checked);
  };

  const { result: tokenList } = useTokensFromList();

  const showedTokens = useMemo(() => {
    if (!tokenList || !checked) return undefined;
    return tokenList.map((token) => token.canisterId).concat(ICP.address);
  }, [checked, tokenList]);

  return (
    <MainCard sx={{ width: "100%", overflow: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          "@media(max-width: 640px)": {
            flexDirection: "column",
            gap: "10px 0",
          },
        }}
      >
        <Typography variant="h4">
          <Trans>Transactions</Trans>
        </Typography>

        <OnlyTokenList onChange={handleCheckChange} checked={checked} />
      </Box>

      <Box sx={{ minWidth: "1140px", margin: "20px 0 0 0" }}>
        <Transactions transactions={transactions} loading={loading} hasFilter showedTokens={showedTokens} />
      </Box>
    </MainCard>
  );
}
