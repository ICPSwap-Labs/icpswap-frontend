import { BarChart, LineChart, PieChart } from "echarts/charts";
import { GridComponent, MarkLineComponent, TooltipComponent } from "echarts/components";
import type { ECharts } from "echarts/core";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([BarChart, PieChart, LineChart, GridComponent, TooltipComponent, MarkLineComponent, CanvasRenderer]);

export { type ECharts, echarts };
