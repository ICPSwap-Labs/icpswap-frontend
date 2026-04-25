import { useFarmAprCharts } from "@icpswap/hooks";
import { LineChartAlt, Tooltip as Tip } from "@icpswap/ui";
import { BigNumber } from "@icpswap/utils";
import { Flex, MainCard } from "components/index";
import { Box, Typography } from "components/Mui";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const DAYJS_FORMAT = "MMM D, YYYY HH:mm:ss";

export interface FarmAprChartsProps {
  farmId: string | undefined;
}

export function FarmAprCharts({ farmId }: FarmAprChartsProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState<undefined | number>(undefined);
  const [label, setLabel] = useState<undefined | string>(undefined);

  const { data: aprCharts } = useFarmAprCharts(farmId);

  const chartData = useMemo(() => {
    if (!aprCharts) return [];

    return aprCharts
      .filter(([, value]) => value !== Infinity)
      .map((e) => ({ time: Number(e[0] * BigInt(1000)), value: e[1] }));
  }, [aprCharts]);

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

            <Tip tips={t("farm.apr.chart.description")} iconSize="14px" />
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
                ? `${new BigNumber(chartData[chartData.length - 1].value).toFixed(2)}%`
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
                ? `${dayjs(Number(chartData[chartData.length - 1].time)).format(DAYJS_FORMAT)}`
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
