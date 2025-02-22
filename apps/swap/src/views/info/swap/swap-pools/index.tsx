import { useMemo } from "react";
import { Typography, Box } from "@mui/material";
import { InfoWrapper, MainCard } from "components/index";
import { useNodeInfoAllPools } from "@icpswap/hooks";
import { Pools } from "components/info/swap";

export default function SwapPools() {
  const { result: pools, loading } = useNodeInfoAllPools();

  const _pools = useMemo(() => {
    return pools?.filter((pool) => pool.feeTier === BigInt(3000));
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
              <Pools pools={_pools} loading={loading} />
            </Box>
          </Box>
        </MainCard>
      </Box>
    </InfoWrapper>
  );
}
