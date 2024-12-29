// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { PricingWrapper } from './styled';
import { Helmet } from 'react-helmet-async';

export interface PricingProps {}

export function Pricing(props: PricingProps) {
  return (
    <PricingWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>Pricing</title>
      </Helmet>
      Pricing
    </PricingWrapper>
  );
}
