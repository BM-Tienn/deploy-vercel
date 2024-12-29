// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { LiveViewWrapper } from './styled';
import { Helmet } from 'react-helmet-async';

export interface LiveViewProps {}

export function LiveView(props: LiveViewProps) {
  return (
    <LiveViewWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>LiveView</title>
      </Helmet>
      LiveView
    </LiveViewWrapper>
  );
}
