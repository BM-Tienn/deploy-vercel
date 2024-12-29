// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { OverviewWrapper } from './styled';
import { Helmet } from 'react-helmet-async';

export interface OverviewProps {}

export function Overview(props: OverviewProps) {
  return (
    <OverviewWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>Overview</title>
      </Helmet>
      Overview
    </OverviewWrapper>
  );
}
