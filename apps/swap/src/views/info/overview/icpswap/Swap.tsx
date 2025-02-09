import { useContext, useEffect } from "react";
import { Typography } from "components/Mui";
import { Flex, Image, Link } from "@icpswap/ui";
import { formatDollarAmount, formatAmount } from "@icpswap/utils";
import { useSwapProtocolData, useSwapPools } from "@icpswap/hooks";
import { useSwapGlobalData } from "hooks/info/index";
import { useTranslation } from "react-i18next";

import { IcpswapContext } from "./context";
import { Card, Item } from "../component";

export function Swap() {
  const { t } = useTranslation();
  const { setSwapTVL } = useContext(IcpswapContext);

  const { result: swapProtocol } = useSwapProtocolData();
  const { result: allSwapPools } = useSwapPools();
  const { result: swapGlobalData } = useSwapGlobalData();

  useEffect(() => {
    if (swapProtocol) {
      setSwapTVL(swapProtocol.tvlUSD);
    }
  }, [setSwapTVL, swapProtocol]);

  return (
    <Link to="/info-swap">
      <Card
        title={
          <Flex gap="0 12px">
            <Image src="/images/info/overview-swap.svg" sizes="40px" />

            <Typography color="text.primary" fontWeight={500} fontSize="18px">
              Swap
            </Typography>
          </Flex>
        }
      >
        <Flex vertical gap="32px 0" align="flex-start" sx={{ margin: "32px 0 0 0" }}>
          <Item
            label={t("common.tvl")}
            value={swapProtocol ? formatDollarAmount(swapProtocol.tvlUSD) : "--"}
            // tooltip={t`The cumulative value of positions staked across all live farming pools.`}
          />
          <Item
            label={t("common.total.volume")}
            value={swapGlobalData ? formatDollarAmount(swapGlobalData?.totalVolume) : "--"}
            // tooltip={t`The total value of rewards distributed by live farming pools.`}
          />

          <Item
            label={t`Total Trading Pairs`}
            value={allSwapPools ? allSwapPools.length : "--"}
            // tooltip={t`The total value of rewards distributed by finished farming pools.`}
          />
          <Item
            label={t`Total Users`}
            value={swapGlobalData?.totalUser === undefined ? "--" : formatAmount(Number(swapGlobalData.totalUser))}
            // tooltip={t`The total number of farming pools, including those that are unstart, live, and finished.`}
          />
        </Flex>
      </Card>
    </Link>
  );
}
