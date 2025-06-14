import { Typography, Box } from "components/Mui";
import { TokenImage } from "components/index";
import { FeeTierPercentLabel, Flex, Modal, MainCard } from "@icpswap/ui";
import { generateLogoUrl } from "hooks/token/useTokenLogo";
import { PoolCharts as InfoPoolCharts } from "components/info/PoolCharts";
import { useTranslation } from "react-i18next";
import { PoolInfoWithApr } from "types/info";

export interface PoolChartsProps {
  showOnlyTokenList?: boolean;
  open: boolean;
  onClose: () => void;
  pool: PoolInfoWithApr;
}

export function PoolCharts({ open, onClose, pool }: PoolChartsProps) {
  const { t } = useTranslation();

  return (
    <Modal open={open} title={t("common.chart")} onClose={onClose} background="level1">
      <>
        <Flex gap="0 8px">
          <Flex>
            <TokenImage logo={generateLogoUrl(pool.token0LedgerId)} tokenId={pool.token0LedgerId} />
            <TokenImage logo={generateLogoUrl(pool.token1LedgerId)} tokenId={pool.token1LedgerId} />
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

          <FeeTierPercentLabel feeTier={pool.poolFee} />
        </Flex>

        <Box mt="16px">
          <MainCard level={2} padding="20px">
            <InfoPoolCharts
              canisterId={pool.poolId}
              token0Price={Number(pool.token0Price)}
              volume24H={Number(pool.volumeUSD24H)}
            />
          </MainCard>
        </Box>
      </>
    </Modal>
  );
}
