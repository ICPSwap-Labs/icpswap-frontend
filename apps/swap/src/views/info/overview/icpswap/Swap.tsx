import { Flex, Image, Link } from "@icpswap/ui";
import { formatAmount, formatDollarAmount } from "@icpswap/utils";
import { Typography } from "components/Mui";
import { useGlobalProtocol } from "hooks/info/useSwapChartData";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, Item } from "../component";
import { IcpswapContext } from "./context";

export function Swap() {
  const { t } = useTranslation();
  const { setSwapTVL } = useContext(IcpswapContext);

  const { data: globalProtocol } = useGlobalProtocol();

  useEffect(() => {
    if (globalProtocol) {
      setSwapTVL(globalProtocol.tvlUSD);
    }
  }, [setSwapTVL, globalProtocol]);

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
          <Item label={t("common.tvl")} value={globalProtocol ? formatDollarAmount(globalProtocol.tvlUSD) : "--"} />
          <Item
            label={t("common.total.volume")}
            value={globalProtocol ? formatDollarAmount(globalProtocol?.volumeUSD) : "--"}
          />

          <Item
            label={t("swap.total.trading.pairs")}
            value={globalProtocol ? globalProtocol.totalTradingPairs : "--"}
          />
          <Item
            label={t("swap.total.users")}
            value={globalProtocol?.totalUsers === undefined ? "--" : formatAmount(Number(globalProtocol.totalUsers))}
          />
        </Flex>
      </Card>
    </Link>
  );
}
