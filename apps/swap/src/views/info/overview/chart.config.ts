import { BigNumber, formatDollarAmount } from "@icpswap/utils";
import dayjs from "dayjs";

export default {
  type: "area",
  width: "100%",
  height: 275,
  options: {
    chart: {
      id: "support-chart",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    colors: ["#5669DC"],
    fill: {
      type: "gradient",
      gradient: {
        gradientToColors: ["#111936", "#5669DC"],
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      colors: "#5669DC",
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#5669DC"],
    },
    tooltip: {
      enabled: true,
      enabledOnSeries: undefined,
      shared: true,
      followCursor: false,
      intersect: false,
      inverseOrder: false,
      custom: undefined,
      fillSeriesColor: false,
      theme: false,
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
      onDatasetHover: {
        highlightDataSeries: false,
      },
      x: {
        formatter: (value) => {
          return dayjs(Number(value) * 1000).format("MM/DD/YYYY h:mm");
        },
      },
      y: {
        formatter: (value) => formatDollarAmount(value),
        title: {
          formatter: (name) => "",
        },
      },
      marker: {
        show: false,
      },
      items: {
        display: "flex",
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        show: true,
        style: {
          colors: ["#8492C4"],
          fontSize: "12px",
          fontFamily: "'Poppins','Roboto',sans-serif",
          fontWeight: 400,
          offsetX: 0,
          offsetY: 0,
          rotate: 0,
          cssClass: "apexcharts-xaxis-label",
        },
        formatter: (value) => {
          return dayjs(Number(value) * 1000).format("MM.DD h:mm A");
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      opposite: true,
      labels: {
        show: true,
        style: {
          colors: ["#8492C4"],
          fontSize: "12px",
          fontFamily: "'Poppins','Roboto',sans-serif",
          fontWeight: 400,
          cssClass: "apexcharts-yaxis-label",
        },
        align: "left",
        formatter: (value) => {
          return new BigNumber(value).toFormat(6);
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
  },
  series: [
    {
      data: [],
    },
  ],
};
