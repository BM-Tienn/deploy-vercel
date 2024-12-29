import { BarChart } from 'app/components/Chart/BarChart';
import { LineChart } from 'app/components/Chart/LineChart';
import { PieChart } from 'app/components/Chart/PieChart';

import { getMessage } from 'app/functions/openNotificationWithIcon';
import QueryString from 'qs';
import { useEffect, useState } from 'react';
import { reportDetailList } from 'services/reportApi';

export interface ReportChartProps {
  id: string;
}

export function ReportChart({ id }: ReportChartProps) {
  const [chartData, setChartData] = useState<any>();
  const [chart, setChart] = useState<any>();

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          const { data } = await reportDetailList(
            QueryString.stringify({
              type: 'chart',
              id,
            }),
          );
          if (data?.data) {
            setChartData(data.data?.chartData);
            setChart(data.data?.chart);
          }
        } catch ({ response }) {
          getMessage(response?.data);
        } finally {
        }
      }
    })();
  }, [id]);

  return (
    <div className="flex-1 overflow-hidden">
      {chartData && chart?.type === 'line' && (
        <LineChart chartData={chartData} />
      )}
      {chartData && chart?.type === 'pie' && <PieChart chartData={chartData} />}
      {chartData && chart?.type === 'bar' && <BarChart chartData={chartData} />}
    </div>
  );
}
