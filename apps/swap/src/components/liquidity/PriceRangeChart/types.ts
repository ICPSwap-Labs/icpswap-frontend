import { Bound } from "constants/mint";
import { Null } from "@icpswap/types";

export interface ChartEntry {
  activeLiquidity: number;
  price0: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ZoomLevels {
  initialMin: number;
  initialMax: number;
  min: number;
  max: number;
}

export interface LiquidityChartRangeInputProps {
  // to distringuish between multiple charts in the DOM
  id?: string;
  data: {
    series: ChartEntry[];
    current: number;
    lower?: number;
    upper?: number;
  };
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
  styles: {
    area: {
      // color of the ticks in range
      selection: string;
    };
    brush: {
      handle: {
        west: string;
        east: string;
      };
    };
  };
  dimensions: Dimensions;
  margins: Margins;
  interactive?: boolean;
  brushLabels: (d: "w" | "e", x: number) => string;
  brushDomain: [number, number] | undefined;
  onBrushDomainChange: (domain: [number, number], mode: string | undefined) => void;
  zoomLevels: ZoomLevels;
  poolPriceLower: string | number | Null;
  poolPriceUpper: string | number | Null;
}
