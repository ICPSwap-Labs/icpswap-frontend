import { Typography, Box, useTheme } from "components/Mui";
import { FilledTextField } from "components/index";
import { useTokensFromList, useNodeInfoAllTokens } from "@icpswap/hooks";
import { TokenTable } from "components/info/swap";
import { useState, useMemo, useEffect } from "react";
import { isValidPrincipal } from "@icpswap/utils";
import { ICP } from "@icpswap/tokens";
import { MainCard, OnlyTokenList } from "@icpswap/ui";
import { useTranslation } from "react-i18next";

export default function TopTokens() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [search, setSearch] = useState<null | string>(null);
  const [onlyTokenList, setOnlyTokenList] = useState(true);

  const { result: allTokens, loading } = useNodeInfoAllTokens();

  const { result: tokenList } = useTokensFromList();

  const handleCheckChange = (checked: boolean) => {
    setOnlyTokenList(checked);
  };

  const filteredAllTokens = useMemo(() => {
    if (!allTokens || !tokenList) return undefined;

    const tokenListIds = tokenList.map((token) => token.canisterId).concat(ICP.address);

    return allTokens
      .filter((token) => {
        if (onlyTokenList) return tokenListIds.includes(token.tokenLedgerId);
        return token;
      })
      .filter((token) => {
        if (!search) return true;

        if (isValidPrincipal(search)) {
          return token.tokenLedgerId === search;
        }

        return (
          token.tokenName?.toLocaleUpperCase().includes(search.toLocaleUpperCase()) ||
          token.tokenSymbol?.toLocaleUpperCase().includes(search.toLocaleUpperCase())
        );
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
        <Typography variant="h4">{t("info.top.tokens")}</Typography>

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
              textFieldProps={{
                slotProps: {
                  input: {
                    placeholder: `Search the canister ID or token`,
                  },
                },
              }}
              background={theme.palette.background.level1}
              onChange={(value: string) => setSearch(value)}
              placeholderSize="12px"
            />
          </Box>

          <OnlyTokenList onChange={handleCheckChange} checked={onlyTokenList} />
        </Box>
      </Box>

      <Box mt="20px" sx={{ overflow: "auto hidden" }}>
        <Box sx={{ minWidth: "1140px" }}>
          <TokenTable tokens={filteredAllTokens} loading={loading} />
        </Box>
      </Box>
    </MainCard>
  );
}
