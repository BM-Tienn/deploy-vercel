// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react';
import { Skeleton, Flex } from 'antd';
import { useTranslation } from 'react-i18next';

export interface HeaderProps {
  id?: string | null;
  loading?: boolean;
  dataParent?: any;
}

export function Header({ id, loading, dataParent }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <Flex align="center" justify="space-between" className="px-5 py-2 w-full">
      {loading ? (
        <Flex vertical gap={2} className="h-[89px]">
          <Flex gap={2} className="w-[130px]">
            <Skeleton.Button active size="small" block shape="round" />{' '}
            <Skeleton.Button active size="small" block shape="round" />
          </Flex>
          <Skeleton.Button active size="small" block shape="round" />
          <Skeleton.Button active size="small" block shape="round" />
        </Flex>
      ) : (
        <Flex align="center" gap={8}>
          <Flex align="center" gap={8}>
            <span className="font-semibold text-lg cursor-pointer">
              {t('report.title')}
            </span>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
