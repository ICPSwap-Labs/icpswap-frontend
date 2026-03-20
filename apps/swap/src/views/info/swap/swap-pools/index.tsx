import { useNodeInfoAllPools } from "@icpswap/hooks";
import { InfoWrapper, MainCard } from "components/index";
import { Pools } from "components/info/swap";
import { Box, Typography } from "components/Mui";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function SwapPools() {
  const { t } = useTranslation();
  const { data: pools, isLoading: loading } = useNodeInfoAllPools();

  const _pools = useMemo(() => {
    return pools?.filter((pool) => pool.poolFee === 3000);
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
              overflow: "auto hidden",
            }}
          >
            <Box
              sx={{
                minWidth: "1200px",
              }}
            >
              <Pools pools={_pools} loading={loading} />
            </Box>
          </Box>
        </MainCard>
      </Box>
    </InfoWrapper>
  );
}
