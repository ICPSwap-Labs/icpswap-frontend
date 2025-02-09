import { Typography, Box } from "components/Mui";
import { SelectPair } from "components/index";
import { useNodeInfoAllPools, useTokensFromList } from "@icpswap/hooks";
import Pools from "components/info/Pools";
import { useState, useMemo } from "react";
import { ICP } from "@icpswap/tokens";
import { MainCard, OnlyTokenList } from "@icpswap/ui";
import { HIDDEN_POOLS } from "constants/info";
import { useTranslation } from "react-i18next";

export default function TopPools() {
  const { t } = useTranslation();
  const [onlyTokenList, setOnlyTokenList] = useState(true);
  const [selectedPair, setSelectedPair] = useState<undefined | string>(undefined);

  const { result: pools, loading } = useNodeInfoAllPools();

  const { result: tokenList } = useTokensFromList();

  const handleCheckChange = (checked: boolean) => {
    setOnlyTokenList(checked);
  };

  const filteredAllPools = useMemo(() => {
    if (!pools || !tokenList) return undefined;

    const tokenListIds = tokenList.map((token) => token.canisterId).concat(ICP.address);

    return pools
      .filter((pool) => {
        if (onlyTokenList) {
          return tokenListIds.includes(pool.token0Id) && tokenListIds.includes(pool.token1Id);
        }

        return pool;
      })
      .filter((pool) => pool.feeTier === BigInt(3000) && !HIDDEN_POOLS.includes(pool.pool))
      .filter((pool) => {
        if (!selectedPair) return true;

        return pool.pool === selectedPair;
      });
  }, [pools, onlyTokenList, tokenList, selectedPair]);

  const handlePairChange = (pairId: string | undefined) => {
    setSelectedPair(pairId);
  };

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
        <Typography variant="h4">{t("info.top.pools")}</Typography>

        <Box
          sx={{
            display: "flex",
            gap: "0 10px",
            alignItems: "center",
            width: "fit-content",
            "@media(max-width: 640px)": {
              flexDirection: "column",
              gap: "10px 0",
              alignItems: "flex-start",
            },
          }}
        >
          <Box
            sx={{
              width: "240px",
              height: "40px",
              "@media(max-width: 640px)": {
                width: "100%",
              },
            }}
          >
            <SelectPair value={selectedPair} onPairChange={handlePairChange} search />
          </Box>

          <OnlyTokenList onChange={handleCheckChange} checked={onlyTokenList} />
        </Box>
      </Box>

      <Box mt="20px" sx={{ overflow: "auto" }}>
        <Box sx={{ minWidth: "1140px" }}>
          <Pools pools={filteredAllPools} loading={loading} />
        </Box>
      </Box>
    </MainCard>
  );
}
