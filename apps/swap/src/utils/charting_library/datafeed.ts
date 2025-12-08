import { Token } from "@icpswap/swap-sdk";
import { Null, InfoTokenDataResponse } from "@icpswap/types";
import { getTokenCharts } from "@icpswap/hooks";
import { BigNumber } from "@icpswap/utils";

function priceChartFormat(data: InfoTokenDataResponse[]) {
  return data
    .filter((d) => {
      // ICVC
      if (d.tokenLedgerId === "m6xut-mqaaa-aaaaq-aadua-cai") {
        const time = new Date("2024-08-28").getTime();
        return new BigNumber(d.beginTime).multipliedBy(1000).isGreaterThan(time);
      }

      // SNS1
      if (d.tokenLedgerId === "zfcdd-tqaaa-aaaaq-aaaga-cai") {
        const time = new Date("2024-03-12").getTime();
        return !new BigNumber(d.beginTime).multipliedBy(1000).isLessThan(time);
      }

      return true;
    })
    .map((d, index) => {
      return {
        ...d,
        open: d.beginTime.toString() === "1686787200000" ? data[index - 1].close : d.open,
        close:
          d.beginTime.toString() === "1686787200000" || d.beginTime.toString() === "1686873600000"
            ? data[index + 1]?.open ?? d.close
            : d.close,
        low:
          d.beginTime.toString() === "1686787200000"
            ? data[index - 1].close > (data[index + 1]?.open ?? 0)
              ? data[index + 1]?.open ?? data[index - 1]?.close ?? 0
              : data[index - 1].close
            : d.beginTime.toString() === "1686873600000"
            ? data[index - 2].close > (data[index + 1]?.open ?? 0)
              ? data[index + 1]?.open ?? 0
              : data[index - 2]?.close ?? 0
            : d.low,
        timestamp: undefined,
        time: d.beginTime,
      };
    });
}

export const SUPPORTED_RESOLUTIONS = ["1", "5", "15", "30", "60", "1D", "1W", "1M"];
const LIMIT = 500;

export class Datafeed {
  public token: Token | Null = null;

  constructor(token: Token | Null) {
    this.token = token;
  }

  onReady(callback) {
    setTimeout(() => callback(defaultConfiguration()), 0);
  }

  searchSymbols(userInput, exchange, symbolType, onResult) {}

  resolveSymbol(symbolName, onResolve, onError, extension) {
    const symbol = this.token?.symbol;

    const result = {
      name: symbol,
      base_name: symbol,
      listed_exchange: "ICPSwap",
      exchange: "ICPSwap",
      ticker: symbol,
      minmov: 1,
      minmove2: 0,
      session: "24x7",
      supported_resolutions: SUPPORTED_RESOLUTIONS,
      has_weekly_and_monthly: false,
      has_empty_bars: true,
      volume_precision: 6,
      pricescale: 10 ** 6,
      timezone: "Etc/UTC",
      full_name: symbol,
      variable_tick_size:
        "0.0000000001 0.000001 0.00000001 0.00001 0.0000001 0.0001 0.000001 0.001 0.00001 0.01 0.0001 0.1 0.001 1 0.01 10 0.01",
    };

    setTimeout(() => onResolve(result), 0);
  }

  getBars(symbolInfo, resolution, periodParams, onResult, onError) {
    if (this.token) {
      getTokenCharts({ tokenId: this.token.address, level: "d1", page: 1, limit: LIMIT }).then((result) => {
        if (result) {
          const __data = priceChartFormat([...result.content].reverse());
          onResult(periodParams.firstDataRequest ? __data : [], { noData: !periodParams.firstDataRequest });
        } else {
          onResult([], { noData: true });
        }
      });
    } else {
      onResult([], { noData: true });
    }
  }
  subscribeBars(symbolInfo, resolution, onTick, listenerGuid, _onResetCacheNeededCallback) {}
  unsubscribeBars(listenerGuid) {}
}

function defaultConfiguration() {
  return {
    supports_search: false,
    supports_group_request: true,
    supported_resolutions: SUPPORTED_RESOLUTIONS,
    supports_marks: false,
    supports_timescale_marks: false,
  };
}
