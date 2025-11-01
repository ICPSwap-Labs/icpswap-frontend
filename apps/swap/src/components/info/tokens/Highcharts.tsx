// @ts-nocheck
/* eslint-disable object-shorthand */
/* eslint-disable func-names */
import { useEffect } from "react";
import { getTextualAddress } from "@icpswap/ui";
import { BigNumber, isUndefinedOrNullOrEmpty, principalToAccount, shorten } from "@icpswap/utils";
import * as Highcharts from "highcharts";

const OTHER_ACCOUNTS = "Other accounts";

export interface UseInitialHighchartsProps {
  id: string;
  charts: Array<{
    value: string;
    address: string;
    percent: string;
    alias: string | undefined;
    sub: string | undefined;
  }>;
}

export function useInitialHighcharts({ id, charts }: UseInitialHighchartsProps) {
  useEffect(() => {
    if (charts.length) {
      // @ts-ignore
      // The TypeScript compilation shows errors, but the code functions correctly.
      // These errors can be safely ignored, as the official Highcharts documentation uses the same approach.
      Highcharts.chart(id, {
        title: undefined,
        credits: false,
        chart: {
          type: "pie",
          backgroundColor: "#212946",
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
        },
        tooltip: {
          valueSuffix: "%",
          backgroundColor: "rgba(33, 41, 70, 0.70)",
          borderRadius: 8,
          borderColor: "rgba(73, 88, 142, 0.70)",
          borderWidth: 2,
          style: {
            color: "#ffffff",
          },
          headerFormat: " ",
          pointFormatter: function () {
            const name = this.series.name;
            const aid = this.aid;
            const pid = this.pid;

            return (
              `AID: ${aid}<br/>` +
              `${!isUndefinedOrNullOrEmpty(pid) ? `PID: ${pid}<br />` : ""}` +
              `${name}: <b>${new BigNumber(this.percentage).toFixed(2)}%</b>`
            );
          },
        },
        accessibility: {
          point: {
            valueSuffix: "%",
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: '<span style="font-size: 1em">{point.name}',
              style: {
                color: "#ffffff",
                fontWeight: 400,
                fontFamily: "Poppins",
                fontSize: "12px",
              },
            },
          },
        },
        series: [
          {
            name: "Tokens",
            colorByPoint: true,
            data: charts.map((element) => {
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
                  : textualAddress ?? (pid ? `${shorten(element.address, 4)}/${shorten(aid, 4)}` : shorten(aid, 4));

              return {
                name,
                y: new BigNumber(element.percent).toNumber(),
                pid: pid ?? "",
                aid,
              };
            }),
          },
        ],
      });
    }
  }, [id, charts]);
}
