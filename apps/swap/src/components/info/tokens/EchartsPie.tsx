import { getTextualAddress } from "@icpswap/ui";
import { BigNumber, isUndefinedOrNullOrEmpty, principalToAccount, shorten } from "@icpswap/utils";
import { echarts } from "components/echarts";
import type { ECharts } from "echarts/core";
import { type RefObject, useEffect } from "react";

export interface TokenHolderChartInput {
  value: string;
  address: string;
  percent: string;
  alias: string | undefined;
  sub: string | undefined;
}

export interface EchartsPieDatum {
  name: string;
  value: number;
  aid: string;
  /** Set for token-holder charts; omit or "" for pool charts */
  pid?: string;
}

const OTHER_ACCOUNTS = "Other accounts";

/** Only the first N slices (by data order: top holders first) show outside labels */
const PIE_LABEL_MAX_RANK = 20;

/** Default pie palette for dark background `#212946`; ECharts cycles when there are more slices than colors */
export const DEFAULT_PIE_CHART_COLORS = [
  "#5B8FF9",
  "#61DDAA",
  "#65789B",
  "#F6BD16",
  "#7262FD",
  "#78D3F8",
  "#9661BC",
  "#F6903D",
  "#269A99",
  "#F08BB4",
  "#9CD497",
  "#5AD8A6",
  "#9270CA",
  "#FF9D4E",
  "#5D7092",
  "#A78BFA",
  "#36CFC9",
  "#FFC069",
  "#B37FEB",
  "#BAE637",
  "#40A9FF",
] as const;

export function mapTokenHolderChartsToPieData(charts: TokenHolderChartInput[]): EchartsPieDatum[] {
  return charts.map((element) => {
    const pid = element.address.includes("-") ? element.address : undefined;
    const aid = element.address.includes("-") ? principalToAccount(element.address) : element.address;

    const textualAddress =
      element.address !== OTHER_ACCOUNTS
        ? getTextualAddress({
            shorten: true,
            shortenLength: 6,
            owner: pid,
            account: aid,
            alias: element.alias,
            subaccount: element.sub,
          })
        : undefined;

    const name =
      element.address === OTHER_ACCOUNTS
        ? "Other accounts"
        : (textualAddress ?? (pid ? `${shorten(element.address, 4)}/${shorten(aid, 4)}` : shorten(aid, 4)));

    return {
      name,
      value: new BigNumber(element.percent).toNumber(),
      aid,
      pid: pid ?? "",
    };
  });
}

export interface UseEchartsPieChartParams {
  containerRef: RefObject<HTMLDivElement | null>;
  seriesName: string;
  data: EchartsPieDatum[];
  /** Override global `color` palette; defaults to {@link DEFAULT_PIE_CHART_COLORS} */
  colors?: string[];
}

export function useEchartsPieChart({ containerRef, seriesName, data, colors }: UseEchartsPieChartParams) {
  useEffect(() => {
    if (!data.length) return;

    let disposed = false;
    let chartInstance: ECharts | null = null;

    const onResize = () => chartInstance?.resize();

    (async () => {
      if (disposed) return;

      const el = containerRef.current;
      if (!el) return;

      const chart = echarts.init(el, undefined, { renderer: "canvas" });
      if (disposed) {
        chart.dispose();
        return;
      }

      chartInstance = chart;

      chart.setOption({
        backgroundColor: "#212946",
        color: colors ?? [...DEFAULT_PIE_CHART_COLORS],
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(33, 41, 70, 0.70)",
          borderColor: "rgba(73, 88, 142, 0.70)",
          borderWidth: 2,
          borderRadius: 8,
          textStyle: { color: "#ffffff" },
          formatter: (params: unknown) => {
            const p = params as {
              data: { aid: string; pid?: string };
              percent?: number;
              seriesName: string;
            };
            const { aid, pid } = p.data;
            const pct = new BigNumber(p.percent ?? 0).toFixed(2);
            return (
              `AID: ${aid}<br/>` +
              `${!isUndefinedOrNullOrEmpty(pid) ? `PID: ${pid}<br />` : ""}` +
              `${p.seriesName}: <b>${pct}%</b>`
            );
          },
        },
        series: [
          {
            type: "pie",
            name: seriesName,
            radius: "72%",
            cursor: "pointer",
            data: data.map((d, index) => ({
              name: d.name,
              value: d.value,
              aid: d.aid,
              ...(d.pid !== undefined && d.pid !== "" ? { pid: d.pid } : {}),
              ...(index >= PIE_LABEL_MAX_RANK ? { label: { show: false } } : {}),
            })),
            label: {
              color: "#ffffff",
              fontFamily: "Poppins",
              fontSize: 12,
              fontWeight: 400,
            },
            emphasis: {
              focus: "self",
              scale: true,
              scaleSize: 6,
              itemStyle: {
                shadowBlur: 28,
                shadowColor: "rgba(0, 0, 0, 0.55)",
                shadowOffsetY: 6,
              },
              label: {
                fontWeight: 500,
              },
            },
            blur: {
              itemStyle: {
                opacity: 0.35,
              },
              label: {
                opacity: 0.35,
              },
              labelLine: {
                opacity: 0.35,
              },
            },
          },
        ],
      });

      if (disposed) {
        chart.dispose();
        chartInstance = null;
        return;
      }

      window.addEventListener("resize", onResize);
    })();

    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      chartInstance?.dispose();
      chartInstance = null;
    };
  }, [containerRef, seriesName, data, colors]);
}
