import { useState, useCallback, useMemo } from "react";
import { Null } from "@icpswap/types";
import { ChevronDown } from "react-feather";

import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { Button } from "../Mui";
import { DropDownMenu } from "../Select";
import { ChartButton } from "./TokenCharts";
import { ChartView } from "./types";

export interface ChartViewSelectorProps {
  options?: ChartButton[];
  chartView: ChartButton | Null;
  onChartsViewChange: (val: ChartButton) => void;
  maxHeight?: string;
}

export const ChartViewSelector = ({
  chartView,
  options,
  onChartsViewChange,
  maxHeight = "240px",
}: ChartViewSelectorProps) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChartViewChange = useCallback(
    (chart: ChartButton) => {
      onChartsViewChange(chart);
    },
    [onChartsViewChange],
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const label = useMemo(() => {
    if (isUndefinedOrNull(chartView)) return undefined;

    const result = options.find(
      (option) =>
        option.value === chartView.value &&
        (nonUndefinedOrNull(chartView.tokenId) ? chartView.tokenId === option.tokenId : true),
    );

    return result?.label;
  }, [chartView, options]);

  return (
    <>
      <Button onClick={handleClick} className="secondary" variant="contained">
        {label}
        <ChevronDown size={16} color="#8492c4" style={{ position: "relative", top: "1px", margin: "0 0 0 4px" }} />
      </Button>

      <DropDownMenu
        anchor={anchorEl}
        onMenuClick={handleClose}
        onClose={handleClose}
        menus={options.map((element) => ({
          label: element.label,
          value: element.tokenId ? `${element.value}_${element.tokenId}` : element.value,
        }))}
        minMenuWidth="140px"
        menuMaxHeight={maxHeight}
        onChange={(value: any) => {
          const chart = options.find(
            (element) => (element.tokenId ? `${element.value}_${element.tokenId}` : element.value) === value,
          );
          handleChartViewChange(chart);
        }}
        value={chartView?.value === ChartView.PRICE ? `${chartView?.value}_${chartView?.tokenId}` : chartView?.value}
      />
    </>
  );
};
