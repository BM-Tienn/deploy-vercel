import { PieChart } from 'app/components/Chart/PieChart';
import { PermissionItem } from 'app/components/Permission/constant';
import { useEffect, useState } from 'react';
import { Row, Col } from 'antd'; // Import các component layout của Ant Design
import { indexingStatusListGet } from 'services/indexingApi';

export interface StatusProps {
  permission?: PermissionItem;
  isAdmin?: boolean;
}

interface ChartData {
  series: number[];
  categories: string[];
  labels: string[];
  type: 'donut' | 'pie';
  title: string;
  colors: string[];
}

export function Status({ permission, isAdmin }: StatusProps) {
  const [chartsData, setChartsData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await indexingStatusListGet();
      if (data?.data) {
        const { counts, colors } = data.data;

        const newChartsData: ChartData[] = Object.keys(counts).map(key => {
          const countData = counts[key];
          const colorData = colors[key];

          const series: number[] = [];
          const categories: string[] = [];
          const chartColors: string[] = [];

          for (let itemKey in countData) {
            if (countData.hasOwnProperty(itemKey)) {
              series.push(countData[itemKey]);
              categories.push(itemKey);
              chartColors.push(colorData[itemKey]);
            }
          }

          return {
            series,
            categories,
            labels: categories,
            type: 'donut',
            title: key,
            colors: chartColors,
          };
        });

        setChartsData(newChartsData);
      }
    };

    fetchData();
  }, []);

  return (
    <Row gutter={[16, 16]} justify="start" align="stretch">
      {(isAdmin || permission?.view) &&
        chartsData.map((chartData, index) => (
          <Col key={index} xs={24} sm={12} md={12} lg={12} xl={12}>
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                border: '1px solid #ddd',
              }}
            >
              <PieChart chartData={chartData} width={400} height={400} />
            </div>
          </Col>
        ))}
    </Row>
  );
}
