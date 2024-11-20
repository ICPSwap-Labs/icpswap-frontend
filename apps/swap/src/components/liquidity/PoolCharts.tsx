import { Typography, Box } from "components/Mui";
import { t } from "@lingui/macro";
import { TokenImage } from "components/index";
import { FeeTierPercentLabel, Flex, Modal, MainCard } from "@icpswap/ui";
import type { InfoPublicPoolWithTvl } from "@icpswap/types";
import { generateLogoUrl } from "hooks/token/useTokenLogo";
import { PoolCharts as InfoPoolCharts } from "components/info/PoolCharts";

export interface PoolChartsProps {
  showOnlyTokenList?: boolean;
  open: boolean;
  onClose: () => void;
  pool: InfoPublicPoolWithTvl;
}

export function PoolCharts({ open, onClose, pool }: PoolChartsProps) {
  return (
    <Modal open={open} title={t`Chart`} onClose={onClose} background="level1">
      <>
        <Flex gap="0 8px">
          <Flex>
            <TokenImage logo={generateLogoUrl(pool.token0Id)} tokenId={pool.token0Id} />
            <TokenImage logo={generateLogoUrl(pool.token1Id)} tokenId={pool.token1Id} />
          </Flex>

          <Typography
            sx={{
              "@media screen and (max-width: 500px)": {
                fontSize: "12px",
              },
            }}
            color="text.primary"
          >
            {pool.token0Symbol} / {pool.token1Symbol}
          </Typography>

          <FeeTierPercentLabel feeTier={pool.feeTier} />
        </Flex>

        <Box mt="16px">
          <MainCard level={2} padding="20px">
            <InfoPoolCharts canisterId={pool.pool} token0Price={pool.token0Price} volume24H={pool.volumeUSD} />
          </MainCard>
        </Box>
      </>
    </Modal>
  );
}
