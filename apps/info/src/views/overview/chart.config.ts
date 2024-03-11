export default {
  type: "line",
  height: 350,
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
      borderColor: "#29314F",
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
        shade: "dark",
        gradientToColors: ["#5669DC"],
        shadeIntensity: 1,
        type: "horizontal",
        opacityFrom: 1,
        opacityTo: 1,
        stops: [100, 100, 100, 100],
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
      colors: ["#6200ea"],
      width: 3,
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
        show: true,
      },
      y: {
        formatter: undefined,
        title: {
          formatter: () => `$`,
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
      labels: {
        show: false,
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
      labels: {
        show: true,
        style: {
          colors: ["#8492C4"],
          fontSize: "12px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 400,
          cssClass: "apexcharts-yaxis-label",
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
