import { useMemo } from "react";
import { Typography, Box } from "components/Mui";
import { InfoWrapper, MainCard } from "components/index";
import { useNodeInfoAllPools } from "@icpswap/hooks";
import { Pools } from "components/info/swap";
import { useTranslation } from "react-i18next";
import { swapPoolsFilter } from "utils/index";
import { isNullArgs } from "@icpswap/utils";
import { FeeAmount } from "@icpswap/swap-sdk";

export default function SwapPools() {
  const { result: pools, loading } = useNodeInfoAllPools();
  const { t } = useTranslation();

  const filteredPools = useMemo(() => {
    if (isNullArgs(pools)) return null;

    return pools.filter(
      (pool) =>
        !swapPoolsFilter({ token0Id: pool.token0Id, token1Id: pool.token1Id, fee: Number(pool.feeTier) as FeeAmount }),
    );
  }, [pools]);

  return (
    <InfoWrapper>
      <Box>
        <Typography color="text.primary" fontSize="20px" fontWeight="500">
          {t("common.pools.all")}
        </Typography>
      </Box>

      <Box mt="20px">
        <MainCard>
          <Box
            sx={{
              width: "100%",
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                minWidth: "1200px",
              }}
            >
              <Pools pools={filteredPools} loading={loading} />
            </Box>
          </Box>
        </MainCard>
      </Box>
    </InfoWrapper>
  );
}
