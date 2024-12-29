// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { DiscountWrapper } from './styled';
import { Helmet } from 'react-helmet-async';

export interface DiscountProps {}

export function Discount(props: DiscountProps) {
  return (
    <DiscountWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>Discount</title>
      </Helmet>
      Discount
    </DiscountWrapper>
  );
}
