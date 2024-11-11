import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { getTokenPriceChart } from "@icpswap/hooks";
import { BigNumber } from "@icpswap/utils";

interface InfoPriceChartData {
  open: number;
  high: number;
  low: number;
  close: number;
  time: number;
  id: string;
}

function priceChartFormat(data: InfoPriceChartData[]) {
  return data
    .filter((d) => {
      // ICVC
      if (d.id === "m6xut-mqaaa-aaaaq-aadua-cai") {
        const time = new Date("2024-08-28").getTime();
        return new BigNumber(d.time).isGreaterThan(time);
      }

      // SNS1
      if (d.id === "zfcdd-tqaaa-aaaaq-aaaga-cai") {
        const time = new Date("2024-03-12").getTime();
        return !new BigNumber(d.time).isLessThan(time);
      }

      return true;
    })
    .map((d, index) => {
      return {
        ...d,
        open: d.time.toString() === "1686787200" ? data[index - 1].close : d.open,
        close:
          d.time.toString() === "1686787200" || d.time.toString() === "1686873600"
            ? data[index + 1]?.open ?? d.close
            : d.close,
        low:
          d.time.toString() === "1686787200"
            ? data[index - 1].close > (data[index + 1]?.open ?? 0)
              ? data[index + 1]?.open ?? data[index - 1]?.close ?? 0
              : data[index - 1].close
            : d.time.toString() === "1686873600"
            ? data[index - 2].close > (data[index + 1]?.open ?? 0)
              ? data[index + 1]?.open ?? 0
              : data[index - 2]?.close ?? 0
            : d.low,
        id: undefined,
      };
    });
}

export const SUPPORTED_RESOLUTIONS = ["1", "5", "15", "30", "60", "1D", "1W", "1M"];
const LIMIT = 1000;

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
      getTokenPriceChart(this.token.address, 24 * 60 * 60, LIMIT).then((data) => {
        const __data = priceChartFormat(data);
        onResult(periodParams.firstDataRequest ? __data : [], { noData: !periodParams.firstDataRequest });
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
