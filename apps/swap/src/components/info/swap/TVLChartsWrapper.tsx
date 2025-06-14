import { useState, useEffect, useMemo } from "react";
import { Typography, Box } from "components/Mui";
import { formatDollarAmount, isNullArgs } from "@icpswap/utils";
import { GridAutoRows, MainCard, LineChartAlt, Tooltip, ImageLoading } from "@icpswap/ui";
import dayjs from "dayjs";
import { ApiResult, InfoGlobalDataResponse, InfoGlobalRealTimeDataResponse, Null, PageResponse } from "@icpswap/types";
import { useTranslation } from "react-i18next";

interface TVLChartsWrapperProps {
  globalProtocol: InfoGlobalRealTimeDataResponse | Null;
  globalCharts: ApiResult<PageResponse<InfoGlobalDataResponse>> | Null;
}

export function TVLChartsWrapper({ globalCharts, globalProtocol }: TVLChartsWrapperProps) {
  const { t } = useTranslation();

  const [liquidityHover, setLiquidityHover] = useState<number | undefined>();
  const [leftLabel, setLeftLabel] = useState<string | undefined>();

  const reversedGlobalCharts = useMemo(() => {
    if (isNullArgs(globalCharts)) return undefined;
    return [...globalCharts.content].reverse();
  }, [globalCharts]);

  useEffect(() => {
    if (liquidityHover === undefined && globalProtocol) {
      setLiquidityHover(Number(globalProtocol.tvlUSD));
    }
  }, [liquidityHover, globalProtocol]);

  const formattedTvlData = useMemo(() => {
    if (!reversedGlobalCharts) return undefined;

    return reversedGlobalCharts.map((data) => ({
      time: dayjs(data.snapshotTime).format("YYYY-MM-DD"),
      value:
        data.snapshotTime.toString() === "1686787200"
          ? 3694463
          : data.snapshotTime.toString() === "1686873600"
          ? 3756323
          : Number(data.snapshotTime) >= 1690502400 && Number(data.snapshotTime) <= 1690934400
          ? 1342535
          : Number(data.tvlUSD),
    }));
  }, [reversedGlobalCharts]);

  return (
    <MainCard
      sx={{
        position: "relative",
        width: "100%",
      }}
      level={3}
    >
      {formattedTvlData ? null : (
        <Box sx={{ width: "100%", height: "332px" }}>
          <ImageLoading loading={!formattedTvlData} />
        </Box>
      )}

      {formattedTvlData ? (
        <LineChartAlt
          data={formattedTvlData}
          height={220}
          minHeight={332}
          value={liquidityHover}
          label={leftLabel}
          setValue={setLiquidityHover}
          setLabel={setLeftLabel}
          topLeft={
            <GridAutoRows gap="4px">
              <Box sx={{ display: "flex", gap: "0 5px", alignItems: "center" }}>
                <Typography fontSize="16px">TVL</Typography>

                <Tooltip tips={t("info.swap.tvl.tips")} />
              </Box>
              <Typography fontSize="32px" fontWeight="500" color="text.primary">
                {formatDollarAmount(liquidityHover)}
              </Typography>
              <Typography fontSize="12px" sx={{ height: "14px" }}>
                {leftLabel || null}
              </Typography>
            </GridAutoRows>
          }
        />
      ) : null}
    </MainCard>
  );
}
