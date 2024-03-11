import { ChartEntry } from "./index";
import { GridAutoRows, RowFixed } from "ui-component/Grid/index";
import { Typography, Box } from "@mui/material";
import { Token } from "@icpswap/swap-sdk";
import { Theme } from "@mui/material/styles";
import { useTheme } from "@mui/styles";
import { toSignificant } from "@icpswap/utils";

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
  const theme = useTheme() as Theme;
  const labelData = chartProps as LabelProps;
  const entryData = data?.[labelData.index];

  if (entryData?.isCurrent) {
    const price0 = entryData.price0;
    const price1 = entryData.price1;

    return (
      <g>
        <foreignObject x={labelData.x - 80} y={318} width={"100%"} height={100}>
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
              <RowFixed align="center">
                <Typography color="text.primary" mr="6px">
                  Current Price
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
              </RowFixed>
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
