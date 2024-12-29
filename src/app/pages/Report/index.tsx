// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { ReportWrapper } from './styled';
import { Helmet } from 'react-helmet-async';
import { Header } from './components/Header';
import { useTranslation } from 'react-i18next';
import { Content } from './components/Content';

export interface ReportProps {}

export function Report(props: ReportProps) {
  const { t } = useTranslation();

  return (
    <ReportWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>{t('report.title')}</title>
      </Helmet>
      <Header />
      <Content />
    </ReportWrapper>
  );
}
