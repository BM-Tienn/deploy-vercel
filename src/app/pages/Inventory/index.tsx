// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { InventoryWrapper } from './styled';
import { Helmet } from 'react-helmet-async';

export interface InventoryProps {}

export function Inventory(props: InventoryProps) {
  return (
    <InventoryWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>Inventory</title>
      </Helmet>
      Inventory
    </InventoryWrapper>
  );
}
