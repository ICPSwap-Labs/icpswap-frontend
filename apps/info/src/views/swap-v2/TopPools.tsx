import { useMemo } from "react";
import { Typography, Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import { MainCard } from "ui-component/index";
import { useGraphAllPools } from "hooks/v2";
import Pools from "ui-component/analytic-v2/Pools";

export default function TopPools() {
  const { result: pools, loading } = useGraphAllPools();

  const _pools = useMemo(() => {
    return pools?.filter((pool) => pool.feeTier === BigInt(3000));
  }, [pools]);

  return (
    <MainCard>
      <Typography variant="h4">
        <Trans>Top Pools</Trans>
      </Typography>

      <Box mt="20px" sx={{ overflow: "auto" }}>
        <Box sx={{ minWidth: "1200px" }}>
          <Pools pools={_pools} loading={loading} />
        </Box>
      </Box>
    </MainCard>
  );
}
