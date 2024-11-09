import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { getTokenPriceChart } from "@icpswap/hooks";

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
    console.log("resolution: ", resolution);
    console.log("symbolInfo: ", symbolInfo);
    console.log("periodParams: ", periodParams);

    if (this.token) {
      getTokenPriceChart(this.token.address, 24 * 60 * 60, LIMIT).then((data) => {
        console.log("data: ", data);
        onResult(periodParams.firstDataRequest ? data : [], { noData: !periodParams.firstDataRequest });
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
