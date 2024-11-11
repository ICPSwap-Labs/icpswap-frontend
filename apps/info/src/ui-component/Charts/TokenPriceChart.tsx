/* eslint-disable import/named */
/* eslint-disable new-cap */

import { useEffect, useRef } from "react";
import { Box } from "ui-component/Mui";
import { Datafeed, SUPPORTED_RESOLUTIONS } from "utils/charting_library/datafeed";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";

import { widget, ChartingLibraryWidgetOptions, ResolutionString, IChartingLibraryWidget } from "./charting_library";

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions["symbol"];
  interval: ChartingLibraryWidgetOptions["interval"];
  libraryPath: ChartingLibraryWidgetOptions["library_path"];
  clientId: ChartingLibraryWidgetOptions["client_id"];
  userId: ChartingLibraryWidgetOptions["user_id"];
  fullscreen: ChartingLibraryWidgetOptions["fullscreen"];
  autosize: ChartingLibraryWidgetOptions["autosize"];
  studiesOverrides: ChartingLibraryWidgetOptions["studies_overrides"];
  container: ChartingLibraryWidgetOptions["container"];
}

interface TVChartContainerProps {
  token: Token | Null;
}

export function TokenPriceChart({ token }: TVChartContainerProps) {
  const chartContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    let tvWidget: Null | IChartingLibraryWidget = null;

    if (token) {
      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: token?.symbol,
        datafeed: new Datafeed(token),
        interval: "1D" as ChartingLibraryWidgetOptions["interval"],
        container: chartContainerRef.current,
        library_path: "/charting_library/",
        locale: "en",
        disabled_features: [
          "header_symbol_search",
          "header_compare",
          "header_resolutions",
          "edit_buttons_in_legend",
          "timeframes_toolbar",
        ],
        enabled_features: [],
        fullscreen: false,
        autosize: true,
        studies_overrides: {},
        favorites: {
          intervals: SUPPORTED_RESOLUTIONS as ResolutionString[],
        },
        theme: "dark",
      };

      tvWidget = new widget(widgetOptions);
    }

    return () => {
      if (tvWidget) tvWidget.remove();
    };
  }, [token]);

  return <Box ref={chartContainerRef} className="TVChartContainer" sx={{ width: "100%", height: "450px" }} />;
}
