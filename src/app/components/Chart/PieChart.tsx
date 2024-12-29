import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

export interface PieChartProps {
  chartData?: {
    categories?: string[];
    title?: string;
    colors?: string[];
    series?: number[];
    type?: 'pie' | 'donut';
  };
  width?: string | number;
  height?: string | number;
}
export function PieChart({
  chartData,
  width = '300',
  height = '300',
}: PieChartProps) {
  const {
    categories = [],
    title = 'Report',
    colors = [],
    series = [],
    type = 'pie',
  } = chartData || {};

  // Nếu dữ liệu trống, hiển thị thông báo thay thế
  if (!series.length || !categories.length) {
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
        }}
      >
        <p>Không có dữ liệu</p>
      </div>
    );
  }

  const chartOptions: ApexOptions = {
    chart: {
      type: type,
    },
    title: {
      text: title,
      align: 'center',
    },
    colors: colors,
    labels: categories.map(item => (item === null ? 'Không xác định' : item)),
  };

  return (
    <ReactApexChart
      type={type}
      width={width}
      height={height}
      options={chartOptions}
      series={series}
    />
  );
}
