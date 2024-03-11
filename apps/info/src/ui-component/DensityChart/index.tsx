import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, LabelList, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useTheme } from "@mui/styles";
import { Box } from "@mui/material";
import { Pool, TickMath, TICK_SPACINGS, FeeAmount, Token, CurrencyAmount } from "@icpswap/swap-sdk";
import { numberToString } from "@icpswap/utils";
import { CurrentPriceLabel } from "./CurrentPriceLabel";
import CustomToolTip from "./CustomToolTip";
import { useToken } from "hooks/useToken";
import LoadingImage from "assets/images/loading.png";
import { Theme } from "@mui/material/styles";
import { useTicksSurroundingPrice, TickProcessed } from "hooks/swap/usePoolTickChartData";
import { useSwapPoolMetadata } from "@icpswap/hooks";
import BigNumber from "bignumber.js";
import JSBI from "jsbi";

const MAX_UINT128 = new BigNumber(340282366920938463463374607431768211455);

interface DensityChartProps {
  address: string;
  token0Price: number | undefined;
}

export interface ChartEntry {
  index: number;
  isCurrent: boolean;
  activeLiquidity: number;
  price0: number;
  price1: number;
  tvlToken0: number;
  tvlToken1: number;
}

interface ZoomStateProps {
  left: number;
  right: number;
  refAreaLeft: string | number;
  refAreaRight: string | number;
}

const INITIAL_TICKS_TO_FETCH = 200;

const initialState = {
  left: 0,
  right: INITIAL_TICKS_TO_FETCH * 2 + 1,
  refAreaLeft: "",
  refAreaRight: "",
};

type TickChartData = {
  index: number;
  isCurrent: boolean;
  activeLiquidity: number;
  price0: number;
  price1: number;
  tvlToken0: number;
  tvlToken1: number;
};

export default function DensityChart({ address, token0Price }: DensityChartProps) {
  const theme = useTheme() as Theme;

  const { result: _pool } = useSwapPoolMetadata(address);
  const [, token0] = useToken(_pool?.token0.address);
  const [, token1] = useToken(_pool?.token1.address);

  const feeTier = _pool?.fee;

  const { data: poolTickData } = useTicksSurroundingPrice(_pool);

  const [loading, setLoading] = useState(false);
  const [zoomState] = useState<ZoomStateProps>(initialState);

  const [formattedData, setFormattedData] = useState<ChartEntry[] | undefined>();

  useEffect(() => {
    async function formatData() {
      if (poolTickData && _pool && token0 && token1 && feeTier) {
        const newData = (
          await Promise.all(
            poolTickData.ticksProcessed.map(async (t: TickProcessed, i) => {
              const active = t.tickIndex === poolTickData.activeTickIdx;
              const sqrtPriceX96 = TickMath.getSqrtRatioAtTick(t.tickIndex);
              const feeAmount: FeeAmount = Number(feeTier);

              const minTick = t.tickIndex - TICK_SPACINGS[feeAmount];

              if (minTick < TickMath.MIN_TICK) return undefined;

              const mockTicks = [
                {
                  index: minTick,
                  liquidityGross: t.liquidityGross,
                  liquidityNet: JSBI.multiply(t.liquidityNet, JSBI.BigInt("-1")),
                },
                {
                  index: t.tickIndex,
                  liquidityGross: t.liquidityGross,
                  liquidityNet: t.liquidityNet,
                },
              ];

              const pool =
                token0 && token1 && feeTier
                  ? new Pool(
                      address,
                      token0,
                      token1,
                      Number(feeTier),
                      sqrtPriceX96,
                      t.liquidityActive,
                      t.tickIndex,
                      mockTicks,
                    )
                  : undefined;

              const nextSqrtX96 = poolTickData.ticksProcessed[i - 1]
                ? TickMath.getSqrtRatioAtTick(poolTickData.ticksProcessed[i - 1].tickIndex)
                : undefined;

              const maxAmountToken0 = token0
                ? CurrencyAmount.fromRawAmount(token0, numberToString(MAX_UINT128))
                : undefined;

              const outputRes0 =
                pool && maxAmountToken0 ? await pool.getOutputAmount(maxAmountToken0, nextSqrtX96) : undefined;

              const token1Amount = outputRes0?.[0] as CurrencyAmount<Token> | undefined;

              const amount0 = token1Amount ? parseFloat(token1Amount.toExact()) * parseFloat(t.price1) : 0;
              const amount1 = token1Amount ? parseFloat(token1Amount.toExact()) : 0;

              return {
                index: i,
                isCurrent: active,
                activeLiquidity: parseFloat(t.liquidityActive.toString()),
                price0: parseFloat(t.price0),
                price1: parseFloat(t.price1),
                tvlToken0: amount0,
                tvlToken1: amount1,
              };
            }),
          )
        ).filter((ele) => !!ele) as TickChartData[];

        // offset the values to line off bars with TVL used to swap across bar
        newData
          ?.map((entry, i) => {
            if (i > 0) {
              newData[i - 1].tvlToken0 = entry.tvlToken0;
              newData[i - 1].tvlToken1 = entry.tvlToken1;
            }

            return undefined;
          })
          .filter((ele) => !!ele);

        if (newData) {
          setLoading(false);
          setFormattedData(newData);
        }

        return;
      } else {
        return [];
      }
    }

    if (!formattedData) {
      setLoading(true);
      formatData();
    }
  }, [feeTier, formattedData, setLoading, loading, _pool, poolTickData, token0, token1]);

  // const atZoomMax = zoomState.left + ZOOM_INTERVAL >= zoomState.right - ZOOM_INTERVAL - 1;
  // const atZoomMin = zoomState.left - ZOOM_INTERVAL < 0;

  // const handleZoomIn = useCallback(() => {
  //   !atZoomMax &&
  //     setZoomState({
  //       ...zoomState,
  //       left: zoomState.left + ZOOM_INTERVAL,
  //       right: zoomState.right - ZOOM_INTERVAL,
  //     });
  // }, [zoomState, atZoomMax]);

  // const handleZoomOut = useCallback(() => {
  //   if (atZoomMin) {
  //     setLoading(true);
  //     setTicksToFetch(ticksToFetch + ZOOM_INTERVAL);
  //     setFormattedData(undefined);
  //     setZoomState({
  //       ...zoomState,
  //       left: 0,
  //       right: amountTicks,
  //     });
  //   } else {
  //     setZoomState({
  //       ...zoomState,
  //       left: zoomState.left - ZOOM_INTERVAL,
  //       right: zoomState.right + ZOOM_INTERVAL,
  //     });
  //   }
  // }, [amountTicks, atZoomMin, ticksToFetch, zoomState]);

  const zoomedData = useMemo(() => {
    if (formattedData) {
      return formattedData.slice(zoomState.left, zoomState.right);
    }
    return undefined;
  }, [formattedData, zoomState.left, zoomState.right]);

  // reset data on address change
  useEffect(() => {
    setFormattedData(undefined);
  }, [address]);

  const CustomBar = ({
    x,
    y,
    width,
    height,
    fill,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
  }) => {
    return (
      <g>
        <rect x={x} y={y} fill={fill} width={width} height={height} rx="2" />
      </g>
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "400px",
      }}
    >
      {!loading ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={zoomedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <Tooltip
              content={(props) => (
                <CustomToolTip chartProps={props} token0={token0} token1={token1} currentPrice={token0Price} />
              )}
            />
            <XAxis reversed={true} tick={false} />
            <Bar
              dataKey="activeLiquidity"
              fill={theme.colors.secondaryMain}
              isAnimationActive={false}
              shape={(props: any) => {
                // eslint-disable-next-line react/prop-types
                return (
                  <CustomBar height={props.height} width={props.width} x={props.x} y={props.y} fill={props.fill} />
                );
              }}
            >
              {zoomedData?.map((entry, index) => {
                // return <Cell key={`cell-${index}`} fill={entry.isCurrent ? theme.pink1 : theme.blue1} />;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isCurrent ? theme.colors.primaryMain : theme.colors.secondaryMain}
                  />
                );
              })}
              <LabelList
                dataKey="activeLiquidity"
                position="inside"
                content={(props) => (
                  <CurrentPriceLabel chartProps={props} token0={token0} token1={token1} data={zoomedData} />
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
            background: theme.palette.background.level2,
            zIndex: 100,
          }}
        >
          <img width="80px" height="80px" src={LoadingImage} alt="" />
        </Box>
      )}
      {/* <ControlsWrapper>
        <ActionButton disabled={false} onClick={handleZoomOut}>
          -
        </ActionButton>
        <ActionButton disabled={atZoomMax} onClick={handleZoomIn}>
          +
        </ActionButton>
      </ControlsWrapper> */}
    </Box>
  );
}
