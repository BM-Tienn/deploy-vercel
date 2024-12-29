// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { AnalyticReportWrapper } from './styled';
import { Helmet } from 'react-helmet-async';

export interface AnalyticReportProps {}

export function AnalyticReport(props: AnalyticReportProps) {
  return (
    <AnalyticReportWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>AnalyticReport</title>
      </Helmet>
      AnalyticReport
    </AnalyticReportWrapper>
  );
}
