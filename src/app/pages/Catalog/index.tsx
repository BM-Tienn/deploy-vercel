// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { CatalogWrapper } from './styled';
import { Helmet } from 'react-helmet-async';

export interface CatalogProps {}

export function Catalog(props: CatalogProps) {
  return (
    <CatalogWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>Catalog</title>
      </Helmet>
      Catalog
    </CatalogWrapper>
  );
}
