/* eslint-disable @typescript-eslint/no-loss-of-precision */

import { useSwapPoolMetadata } from "@icpswap/hooks";
import { type FeeAmount, TICK_SPACINGS, TickMath } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { Box, useTheme } from "components/Mui";
import { type TickProcessed, useTicksSurroundingPrice } from "hooks/swap/useTicksSurroundingPrice";
import { useToken } from "hooks/useCurrency";
import JSBI from "jsbi";
import { useEffect, useState } from "react";
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip } from "recharts";
import { CurrentPriceLabel } from "./CurrentPriceLabel";
import { LiquidityChartToolTip } from "./LiquidityChartToolTip";
import type { ChartEntry } from "./type";
import { calculateTokensLocked } from "./utils/calculateTokensLocked";

interface DensityChartProps {
  address: string | Null;
  token0Price: number | string | undefined;
}

interface CustomBarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

function CustomBar({ x, y, width, height, fill }: CustomBarProps) {
  return (
    <g>
      <rect x={x} y={y} fill={fill} width={width} height={height} rx="2" />
    </g>
  );
}

type TickChartData = {
  index: number;
  isCurrent: boolean;
  activeLiquidity: number;
  price0: number;
  price1: number;
  tvlToken0: number;
  tvlToken1: number;
};

export function DensityChart({ address }: DensityChartProps) {
  const theme = useTheme();

  const { data: __pool } = useSwapPoolMetadata(address);
  const [, token0] = useToken(__pool?.token0.address);
  const [, token1] = useToken(__pool?.token1.address);

  const feeTier = __pool?.fee;

  const { data: ticksData } = useTicksSurroundingPrice(__pool);

  const [loading, setLoading] = useState(false);

  const [formattedData, setFormattedData] = useState<ChartEntry[] | undefined>();
  const [activeToken0Price, setActiveToken0Price] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function formatData() {
      if (ticksData && __pool && token0 && token1 && feeTier && address) {
        const newData = (
          await Promise.all(
            ticksData.map(async (tickProcessed: TickProcessed, index) => {
              const feeAmount: FeeAmount = Number(feeTier);

              const minTick = tickProcessed.tick - TICK_SPACINGS[feeAmount];

              if (minTick < TickMath.MIN_TICK) return undefined;

              const nextTick = ticksData[index + 1]?.tick;

              const { amount0Locked, amount1Locked } = calculateTokensLocked({
                token0,
                token1,
                currentTick: __pool?.tick ? Number(__pool.tick) : 0,
                amount: JSBI.BigInt(tickProcessed.liquidityActive.toString()),
                nextTick,
                tick: { tick: tickProcessed.tick, liquidityNet: tickProcessed.liquidityNet },
              });

              const isCurrent = amount0Locked > 0 && amount1Locked > 0;

              if (isCurrent) {
                setActiveToken0Price(parseFloat(tickProcessed.price0));
              }

              if (amount0Locked === 0 && amount1Locked === 0) return undefined;

              return {
                index: index,
                isCurrent,
                activeLiquidity: parseFloat(tickProcessed.liquidityActive.toString()),
                price0: parseFloat(tickProcessed.price0),
                price1: parseFloat(tickProcessed.price1),
                tvlToken0: amount0Locked,
                tvlToken1: amount1Locked,
                tick: tickProcessed.tick,
              };
            }),
          )
        ).filter((ele) => !!ele) as TickChartData[];

        if (newData) {
          setLoading(false);
          setFormattedData(newData);
        }
      } else {
        return [];
      }
    }

    if (!formattedData) {
      setLoading(true);
      formatData();
    }
  }, [feeTier, formattedData, __pool, ticksData, token0, token1, address]);

  // reset data on address change
  useEffect(() => {
    setFormattedData(undefined);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "300px",
      }}
    >
      {!loading ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={500} height={300} data={formattedData}>
            <Tooltip
              content={(props) => {
                return (
                  <LiquidityChartToolTip
                    chartProps={props}
                    token0={token0}
                    token1={token1}
                    currentPrice={activeToken0Price}
                    data={formattedData}
                  />
                );
              }}
            />
            {/* <XAxis reversed tick={false} /> */}
            <Bar
              dataKey="activeLiquidity"
              fill="#ffffff"
              isAnimationActive={false}
              shape={(props: any) => {
                // eslint-disable-next-line react/prop-types
                return (
                  <CustomBar height={props.height} width={props.width} x={props.x} y={props.y} fill={props.fill} />
                );
              }}
            >
              {formattedData?.map((entry, index) => {
                return <Cell key={`cell-${index}`} fill={entry.isCurrent ? "#ffffff" : theme.colors.secondaryMain} />;
              })}

              <LabelList
                dataKey="activeLiquidity"
                position="inside"
                content={(props) => (
                  <CurrentPriceLabel chartProps={props} token0={token0} token1={token1} data={formattedData} />
                )}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            top: "0",
            left: "0",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            zIndex: 100,
          }}
        >
          <img width="80px" height="80px" src="/images/loading.png" alt="" />
        </Box>
      )}
    </Box>
  );
}
