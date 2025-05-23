import { GridAutoRows, GridRowFixed } from "@icpswap/ui";
import { Typography, Box, useTheme } from "components/Mui";
import { Token } from "@icpswap/swap-sdk";
import { toSignificant } from "@icpswap/utils";
import { useTranslation } from "react-i18next";

import { ChartEntry } from "./type";

interface LabelProps {
  x: number;
  y: number;
  index: number;
}

interface CurrentPriceLabelProps {
  data: ChartEntry[] | undefined;
  chartProps: any;
  token0: Token | undefined;
  token1: Token | undefined;
}

export function CurrentPriceLabel({ data, chartProps, token0, token1 }: CurrentPriceLabelProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const labelData = chartProps as LabelProps;
  const entryData = data?.[labelData.index];

  if (entryData?.isCurrent) {
    const { price0, price1 } = entryData;

    return (
      <g>
        <foreignObject x={labelData.x - 80} y={318} width="100%" height={100}>
          <Box
            sx={{
              borderRadius: "8px",
              padding: "6px 12px",
              width: "fit-content",
              fontSize: "14px",
              backgroundColor: theme.palette.background.level4,
            }}
          >
            <GridAutoRows gap="6px">
              <GridRowFixed align="center">
                <Typography color="text.primary" mr="6px">
                  {t("common.current.price")}
                </Typography>
                <div
                  style={{
                    marginTop: "2px",
                    height: "6px",
                    width: "6px",
                    borderRadius: "50%",
                    backgroundColor: theme.colors.primaryMain,
                  }}
                />
              </GridRowFixed>
              <Typography color="text.primary">{`1 ${token0?.symbol} = ${toSignificant(price0, undefined, {
                groupSeparator: ",",
              })} ${token1?.symbol}`}</Typography>
              <Typography color="text.primary">{`1 ${token1?.symbol} = ${toSignificant(price1, undefined, {
                groupSeparator: ",",
              })} ${token0?.symbol}`}</Typography>
            </GridAutoRows>
          </Box>
        </foreignObject>
      </g>
    );
  }
  return null;
}
