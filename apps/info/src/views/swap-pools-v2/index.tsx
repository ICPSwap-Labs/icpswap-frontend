import { useMemo } from "react";
import { Typography, Box } from "@mui/material";
import Wrapper from "ui-component/Wrapper";
import { Trans } from "@lingui/macro";
import { MainCard } from "ui-component/index";
import { useGraphAllPools } from "hooks/v2";
import Pools from "ui-component/analytic-v2/Pools";

export default function SwapPools() {
  const { result: pools, loading } = useGraphAllPools();

  const _pools = useMemo(() => {
    return pools?.filter((pool) => pool.feeTier === BigInt(3000));
  }, [pools]);

  return (
    <Wrapper>
      <Box>
        <Typography color="text.primary" fontSize="20px" fontWeight="500">
          <Trans>All Pools</Trans>
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
    </Wrapper>
  );
}
