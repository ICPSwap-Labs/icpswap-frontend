import { useState, useCallback } from "react";
import { Null } from "@icpswap/types";
import { ChevronDown } from "react-feather";

import { Button } from "../Mui";
import { DropDownMenu } from "../Select";
import { ChartButton } from "./TokenCharts";
import { ChartView } from "./types";

export interface ChartViewSelectorProps {
  chartsViews?: ChartButton[];
  chartView: ChartButton | Null;
  onChartsViewChange: (val: ChartButton) => void;
}

export const ChartViewSelector = ({ chartView, chartsViews, onChartsViewChange }: ChartViewSelectorProps) => {
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

  return (
    <>
      <Button onClick={handleClick} className="secondary" variant="contained">
        {chartView?.label}
        <ChevronDown size={16} color="#8492c4" style={{ position: "relative", top: "1px", margin: "0 0 0 4px" }} />
      </Button>

      <DropDownMenu
        anchor={anchorEl}
        onMenuClick={handleClose}
        onClose={handleClose}
        menus={chartsViews.map((element) => ({
          label: element.label,
          value: element.tokenId ? `${element.value}_${element.tokenId}` : element.value,
        }))}
        minMenuWidth="140px"
        menuMaxHeight="240px"
        onChange={(value: any) => {
          const chart = chartsViews.find(
            (element) => (element.tokenId ? `${element.value}_${element.tokenId}` : element.value) === value,
          );
          handleChartViewChange(chart);
        }}
        value={chartView?.value === ChartView.PRICE ? `${chartView?.value}_${chartView?.tokenId}` : chartView?.value}
      />
    </>
  );
};
