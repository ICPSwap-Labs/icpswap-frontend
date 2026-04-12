import { useStakeAprChartData } from "@icpswap/hooks";
import { Flex, LineChartAlt, Tooltip as Tip } from "@icpswap/ui";
import { BigNumber } from "@icpswap/utils";
import { MainCard } from "components/index";
import { Box, Typography } from "components/Mui";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const DAYJS_FORMAT = "MMM D, YYYY HH:mm:ss";

export interface FarmAprChartsProps {
  canisterId: string | undefined;
}

export function AprChart({ canisterId }: FarmAprChartsProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState<undefined | number>(undefined);
  const [label, setLabel] = useState<undefined | string>(undefined);

  const { start_time, end_time } = useMemo(() => {
    const now = parseInt(String(Date.now() / 1000), 10);

    let start_time = now - 30 * 24 * 3600;
    const end_time = now;

    if (start_time < 1725883800) start_time = 1725883800;

    return {
      start_time,
      end_time,
    };
  }, []);

  const { data: aprCharts } = useStakeAprChartData(canisterId, start_time, end_time);

  const chartData = useMemo(() => {
    if (!aprCharts || aprCharts.length === 0) return [];

    return aprCharts.map((e) => ({ time: Number(e.time * BigInt(1000)), value: e.apr * 100 }));
  }, [aprCharts]);

  const defaultAprData = useMemo(() => {
    if (!chartData || chartData.length === 0) return {};

    const latestData = chartData[chartData.length - 1];

    return { time: latestData.time, value: latestData.value };
  }, [chartData]);

  return aprCharts && aprCharts.length > 0 ? (
    <Box
      sx={{
        width: "470px",
        "@media (max-width: 520px)": {
          width: "100%",
        },
      }}
    >
      <MainCard
        borderRadius="16px"
        level={1}
        padding="24px 0"
        sx={{
          width: "100%",
          overflow: "hidden",
          height: "fit-content",
        }}
      >
        <Box sx={{ padding: "0 24px" }}>
          <Flex gap="0 6px">
            <Typography fontSize="16px">{t("common.apr")}</Typography>

            <Tip tips={t("stake.apr.chart.descriptions")} iconSize="14px" />
          </Flex>

          <Typography
            sx={{
              margin: "12px 0 0 0",
              fontSize: "28px",
              fontWeight: 500,
              color: "text.primary",
            }}
          >
            {value
              ? `${new BigNumber(value).toFixed(2)}%`
              : aprCharts
                ? `${defaultAprData.value ? new BigNumber(defaultAprData.value).toFixed(2) : "--"}%`
                : "--"}
          </Typography>

          <Typography
            sx={{
              margin: "8px 0 0 0",
              fontSize: "12px",
            }}
          >
            {label
              ? label
              : aprCharts
                ? `${defaultAprData?.time ? dayjs(Number(defaultAprData.time)).format(DAYJS_FORMAT) : "--"}`
                : "--"}
          </Typography>
        </Box>

        <Box sx={{ margin: "32px 0 0 0" }}>
          <Box
            sx={{
              width: "100%",
              height: `240px`,
              display: "flex",
              flexDirection: "column",
              "> *": {
                fontSize: "1rem",
              },
            }}
          >
            <LineChartAlt
              data={chartData}
              showYAxis
              height={240}
              minHeight={332}
              setValue={setValue}
              setLabel={setLabel}
              tipFormat={DAYJS_FORMAT}
            />
          </Box>
        </Box>
      </MainCard>
    </Box>
  ) : null;
}
