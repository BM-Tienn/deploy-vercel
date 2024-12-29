// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { IndexingWrapper } from './styled';
import { Helmet } from 'react-helmet-async';
import { Flex, Tabs, TabsProps } from 'antd';
import { Content } from './components/Content';
import { useTranslation } from 'react-i18next';
import { Setting } from './components/Setting';
import { PermissionItem } from 'app/components/Permission/constant';
import { permissionDefault } from 'app/components/Permission/components/LayoutTables';
import { filterPermission } from 'app/functions/hasPermission';
import { globalPermissionData, globalIsAdmin } from 'app/slice/selector';
import { useSelector } from 'react-redux';
import { Status } from './components/Status';

export interface IndexingProps {}

export function Indexing(props: IndexingProps) {
  const [activeTab, setActiveTab] = useState<string>('indexing-request');
  const { t } = useTranslation();
  const [permission, setPermission] =
    useState<PermissionItem>(permissionDefault);
  const permissionData = useSelector(globalPermissionData);
  const isAdmin = useSelector(globalIsAdmin);

  useEffect(() => {
    const permissionItem = filterPermission(
      permissionData,
      'others',
      'indexing',
    );
    if (permissionItem) setPermission(permissionItem);
  }, [permissionData]);

  const layoutItems: TabsProps['items'] = [
    ...(isAdmin || permission?.listing
      ? [
          {
            key: 'indexing-request',
            label: t('indexing.title_data.request'),
            children: <Content permission={permission} isAdmin={isAdmin} />,
          },
        ]
      : []),
    ...(isAdmin || permission?.listing
      ? [
          {
            key: 'indexing-status',
            label: t('indexing.title_data.status'),
            children: <Status permission={permission} isAdmin={isAdmin} />,
          },
        ]
      : []),
    ...(isAdmin || permission?.setting
      ? [
          {
            key: 'indexing-setting',
            label: t('indexing.title_data.setting'),
            children: <Setting permission={permission} isAdmin={isAdmin} />,
          },
        ]
      : []),
  ];

  return (
    <IndexingWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>{t('indexing.title')}</title>
      </Helmet>
      <Flex className="px-5 py-3 justify-between items-center">
        <Flex className="gap-6">
          <Flex vertical>
            <h1 className="font-bold text-[20px]">{t('indexing.title')}</h1>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={layoutItems}
            />
          </Flex>
        </Flex>
      </Flex>
    </IndexingWrapper>
  );
}
