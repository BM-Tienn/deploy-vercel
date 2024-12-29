/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

export interface BarChartProps {
  chartData?: {
    categories?: string[];
    title?: string;
    text?: string;
    colors?: string[];
    series?: { name: string; data: number[] }[];
    label?: string[];
  };
  width?: string | number;
  height?: string | number;
}

export function BarChart({
  chartData,
  width = '',
  height = '350',
}: BarChartProps) {
  const {
    categories = [],
    title = 'Report',
    text = '',
    colors = [],
    series = [],
    label = [],
  } = chartData || {};

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: height,
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: title,
      align: 'left',
    },
    stroke: {
      width: 2,
    },
    xaxis: {
      labels: {
        rotate: -45,
      },
      max: categories.length > 20 ? 20 : undefined,
      categories: categories,
      tickPlacement: 'on',
    },
    yaxis: {
      title: {
        text: text,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.25,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100],
      },
    },
    tooltip: {
      y: {},
    },
    grid: {
      row: {
        colors: ['#fff', '#f2f2f2'],
      },
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      customLegendItems: label,
    },
  };

  return (
    <ReactApexChart
      type="bar"
      height={height}
      width={width}
      options={chartOptions}
      series={series}
    />
  );
}
