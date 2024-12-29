import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

export interface LineChartProps {
  chartData?: {
    categories?: string[];
    title?: string;
    text?: string;
    colors?: string[];
    series?: { name: string; data: number[] }[];
  };
  width?: string | number;
  height?: string | number;
}

export function LineChart({
  chartData,
  width = '',
  height = '300',
}: LineChartProps) {
  const categories = chartData?.categories || [];
  const title = chartData?.title || 'Report';
  const text = chartData?.text || '';
  const colors = chartData?.colors || [];
  const series = chartData?.series || [];

  const chartOptions: ApexOptions = {
    chart: {
      height: height,
      type: 'line',
      dropShadow: {
        enabled: false,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
    },
    colors: colors,
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      lineCap: 'round',
      width: 4,
    },
    title: {
      text: title,
      align: 'left',
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5,
      },
    },
    markers: {
      size: 1,
    },
    xaxis: {
      categories: categories,
      title: {
        text: text,
      },
      max: categories.length > 20 ? 20 : undefined,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -15,
      offsetX: -5,
    },
  };

  return (
    <ReactApexChart
      type="line"
      height={height}
      options={chartOptions}
      series={series}
    />
  );
}
