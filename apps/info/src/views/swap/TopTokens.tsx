import { Typography, Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import { MainCard, FilledTextField } from "ui-component/index";
import { useInfoAllTokens, useTokensFromList } from "@icpswap/hooks";
import TokenTable from "ui-component/analytic/TokenTable";
import InTokenListCheck from "ui-component/InTokenListCheck";
import { useState, useMemo, useEffect } from "react";
import { isValidPrincipal } from "@icpswap/utils";
import { ICP } from "constants/index";

export default function TopTokens() {
  const [search, setSearch] = useState<null | string>(null);
  const [onlyTokenList, setOnlyTokenList] = useState(true);

  const { result: allTokens, loading } = useInfoAllTokens();

  const { result: tokenList } = useTokensFromList();

  const handleCheckChange = (checked: boolean) => {
    setOnlyTokenList(checked);
  };

  const filteredAllTokens = useMemo(() => {
    if (!allTokens || !tokenList) return undefined;

    const tokenListIds = tokenList.map((token) => token.canisterId).concat(ICP.address);

    return allTokens
      .filter((token) => {
        if (onlyTokenList) return tokenListIds.includes(token.address);
        return token;
      })
      .filter((token) => {
        if (!search) return true;

        if (isValidPrincipal(search)) {
          return token.address === search;
        } 
          return token.symbol.toLocaleUpperCase().includes(search.toLocaleUpperCase());
        
      });
  }, [allTokens, onlyTokenList, tokenList, search]);

  useEffect(() => {
    return () => {
      setSearch(null);
      setOnlyTokenList(true);
    };
  }, []);

  return (
    <MainCard>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          "@media(max-width: 860px)": {
            flexDirection: "column",
            gap: "10px 0",
          },
        }}
      >
        <Typography variant="h4">
          <Trans>Top Tokens</Trans>
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: "0 10px",
            alignItems: "center",
            "@media(max-width: 640px)": {
              flexDirection: "column",
              gap: "10px 0",
              alignItems: "flex-start",
            },
          }}
        >
          <Box
            sx={{
              width: "343px",
              height: "40px",
              "@media(max-width: 640px)": {
                width: "100%",
              },
            }}
          >
            <FilledTextField
              width="100%"
              fullHeight
              value={search}
              textFiledProps={{
                placeholder: `Search the canister ID or token`,
              }}
              onChange={(value: string) => setSearch(value)}
            />
          </Box>

          <InTokenListCheck onChange={handleCheckChange} checked={onlyTokenList} />
        </Box>
      </Box>

      <Box mt="20px" sx={{ overflow: "auto" }}>
        <Box sx={{ minWidth: "1200px" }}>
          <TokenTable tokens={filteredAllTokens} loading={loading} />
        </Box>
      </Box>
    </MainCard>
  );
}
