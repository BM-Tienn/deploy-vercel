// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { OrdersWrapper } from './styled';
import { Helmet } from 'react-helmet-async';

export interface OrdersProps {}

export function Orders(props: OrdersProps) {
  return (
    <OrdersWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>Orders</title>
      </Helmet>
      Orders
    </OrdersWrapper>
  );
}
