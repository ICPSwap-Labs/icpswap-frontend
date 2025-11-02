import { Box, Typography } from "components/Mui";
import { useTokensTreeMapData } from "@icpswap/hooks";
import { useMemo } from "react";
import { BigNumber, formatDollarAmount, formatDollarTokenPrice, isUndefinedOrNull } from "@icpswap/utils";
import { generateLogoUrl } from "hooks/token/useTokenLogo";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { TreemapNode } from "recharts/types/chart/Treemap";
import { Flex, Proportion } from "@icpswap/ui";
import { TokenImage } from "components/Image";

const COLORS = [
  { value: -20, color: "#971E27" },
  { value: -10, color: "#EE3544" },
  { value: -5, color: "#F27A7E" },
  { value: 0, color: "#C6C6C6" },
  { value: 5, color: "#54C081" },
  { value: 10, color: "#04974F" },
  { value: 20, color: "#076436" },
];

type TreeMapData = {
  name: string;
  value: number;
  color: string;
  logo: string;
  price: string;
  marketCap: string;
  tokenId: string;
  volume: string;
  fdv: string;
  tvl: string;
  priceChange24H: string;
};

export function TokensTreeMap() {
  const { result, loading } = useTokensTreeMapData();

  const data: Array<TreeMapData> | undefined = useMemo(() => {
    if (isUndefinedOrNull(result)) return undefined;

    return result
      .map((element) => {
        let colorMap;

        COLORS.find((__element, index) => {
          if (__element.value === 0 && new BigNumber(element.priceChange24H).abs().isLessThan(5)) {
            if (new BigNumber(element.priceChange24H).isLessThan(__element.value)) {
              colorMap = COLORS[index - 1];
              return true;
            }

            if (new BigNumber(element.priceChange24H).isEqualTo(__element.value)) {
              colorMap = __element;
              return true;
            }

            colorMap = COLORS[index + 1];
            return true;
          }

          if (new BigNumber(element.priceChange24H).isLessThanOrEqualTo(__element.value)) {
            colorMap = __element;
            return true;
          }

          return false;
        });

        return {
          name: element.tokenSymbol,
          value: new BigNumber(element.marketCap).toNumber(),
          color: colorMap?.color ?? (element.priceChange24H.includes("-") ? "#ed7171" : "#7ec17e"),
          logo: generateLogoUrl(element.tokenLedgerId),
          price: element.price,
          marketCap: element.marketCap,
          tokenId: element.tokenLedgerId,
          volume: element.volumeUSD24H,
          fdv: element.fdv,
          tvl: element.tvlUSD,
          priceChange24H: element.priceChange24H,
        };
      })
      .filter((element) => new BigNumber(element.value).isGreaterThan(0) && element.name !== "ICP")
      .sort((a, b) => {
        if (new BigNumber(a.value).isGreaterThan(b.value)) return -1;
        if (new BigNumber(a.value).isLessThan(b.value)) return 1;
        return 0;
      });
  }, [result]);

  const CustomizedContent = (props: TreemapNode) => {
    const { x, y, width, height, index, name } = props;

    const nameFontSize = 72 / (index + 1);
    const secondFontSize = 28 / (index + 1);
    const margin1 = 4 / (index + 1);
    const margin2 = 8 / (index + 1);

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: props.color,
            stroke: "#1A223F",
            strokeWidth: 1,
            cursor: "pointer",
          }}
        />

        <foreignObject x={x} y={y} width={width} height={height} style={{ cursor: "pointer" }}>
          <Flex sx={{ width: "100%", height: "100%", cursor: "pointer" }} justify="center" vertical>
            <Typography sx={{ fontSize: `${nameFontSize}px`, fontWeight: 400, color: "#ffffff" }}>
              {name.length > 6 ? `${name.slice(0, 4)}...` : name}
            </Typography>
            <Typography
              sx={{ fontSize: `${secondFontSize}px`, fontWeight: 400, color: "#ffffff" }}
              marginTop={`${margin1}px`}
            >
              {formatDollarTokenPrice(props.price)}
            </Typography>
            <Typography
              sx={{ fontSize: `${secondFontSize}px`, fontWeight: 400, color: "#ffffff" }}
              marginTop={`${margin2}px`}
            >
              {formatDollarAmount(props.marketCap)}
            </Typography>
          </Flex>
        </foreignObject>
      </g>
    );
  };

  return (
    <Box sx={{ margin: "40px 0 0 0" }}>
      <Typography sx={{ fontSize: "20px", fontWeight: 500, color: "text.primary" }}>
        24h Token Volume Heatmap
      </Typography>

      <Box sx={{ margin: "24px 0 0 0", width: "100%", height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            style={{ width: "100%", maxWidth: "500px", maxHeight: "80vh", aspectRatio: 4 / 3 }}
            data={data}
            dataKey="value"
            stroke="#ffffff"
            content={CustomizedContent}
            aspectRatio={4 / 3}
            isAnimationActive={false}
          >
            <Tooltip
              content={(props) => {
                const payload = props.payload?.[0]?.payload as TreeMapData | undefined;

                if (isUndefinedOrNull(payload)) return null;

                const { tokenId, logo } = payload;

                return (
                  <Box
                    sx={{
                      padding: "14px 16px",
                      width: "210px",
                      zIndex: 10,
                      borderRadius: "16px",
                      border: "1px solid rgba(73, 88, 142, 0.70)",
                      background: "rgba(33, 41, 70, 0.9)",
                    }}
                  >
                    <Flex gap="16px 0" vertical align="flex-start">
                      <Flex gap="0 8px">
                        <TokenImage tokenId={tokenId} logo={logo} size="20px" />
                        <Typography sx={{ fontSize: "18px", color: "#ffffff", fontWeight: 500 }}>
                          {payload.name.length > 6 ? `${payload.name.slice(0, 6)}...` : payload.name}
                        </Typography>
                      </Flex>

                      <Flex gap="0 8px">
                        <Typography>Price:</Typography>
                        <Flex gap="0 3px">
                          <Typography color="text.primary">{formatDollarTokenPrice(payload.price)}</Typography>
                          <Flex>
                            <Typography color="text.primary" fontSize="12px">
                              (
                            </Typography>
                            <Proportion
                              showArrow={false}
                              value={payload.priceChange24H}
                              fontSize="12px"
                              component="span"
                            />
                            <Typography color="text.primary" fontSize="12px">
                              )
                            </Typography>
                          </Flex>
                        </Flex>
                      </Flex>

                      <Flex gap="0 8px">
                        <Typography>FDV:</Typography>
                        <Typography color="text.primary">{formatDollarAmount(payload.fdv)}</Typography>
                      </Flex>

                      <Flex gap="0 8px">
                        <Typography>Market cap:</Typography>
                        <Typography color="text.primary">{formatDollarAmount(payload.marketCap)}</Typography>
                      </Flex>

                      <Flex gap="0 8px">
                        <Typography>TVL:</Typography>
                        <Typography color="text.primary">{formatDollarAmount(payload.tvl)}</Typography>
                      </Flex>

                      <Flex gap="0 8px">
                        <Typography>Volume:</Typography>
                        <Typography color="text.primary">{formatDollarAmount(payload.volume)}</Typography>
                      </Flex>
                    </Flex>
                  </Box>
                );
              }}
            />
          </Treemap>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
