import { useEffect, useState } from 'react';
import { SiteMapWrapper } from './styled';
import { Helmet } from 'react-helmet-async';
import { TabsProps, Flex, Tabs } from 'antd';
import { permissionDefault } from 'app/components/Permission/components/LayoutTables';
import { PermissionItem } from 'app/components/Permission/constant';
import { filterPermission } from 'app/functions/hasPermission';
import { globalPermissionData, globalIsAdmin } from 'app/slice/selector';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Setting } from './components/Setting';
import { Preview } from './components/Preview';

export interface SiteMapProps {}

export function SiteMap(props: SiteMapProps) {
  const [activeTab, setActiveTab] = useState<string>('sitemap-preview');
  const { t } = useTranslation();
  const [permission, setPermission] =
    useState<PermissionItem>(permissionDefault);
  const permissionData = useSelector(globalPermissionData);
  const isAdmin = useSelector(globalIsAdmin);

  useEffect(() => {
    const permissionItem = filterPermission(
      permissionData,
      'others',
      'sitemap',
    );
    if (permissionItem) setPermission(permissionItem);
  }, [permissionData]);
  const layoutItems: TabsProps['items'] = [
    ...(isAdmin || permission?.listing
      ? [
          {
            key: 'sitemap-preview',
            label: t('sitemap.title_data.preview'),
            children: <Preview permission={permission} isAdmin={isAdmin} />,
          },
        ]
      : []),
    ...(isAdmin || permission?.setting
      ? [
          {
            key: 'sitemap-setting',
            label: t('sitemap.title_data.setting'),
            children: <Setting permission={permission} isAdmin={isAdmin} />,
          },
        ]
      : []),
  ];
  return (
    <SiteMapWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>{t('sitemap.title')}</title>
      </Helmet>
      <Flex className="px-5 py-3 justify-between items-center">
        <Flex className="gap-6">
          <Flex vertical>
            <h1 className="font-bold text-[20px]">{t('sitemap.title')}</h1>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={layoutItems}
            />
          </Flex>
        </Flex>
      </Flex>
    </SiteMapWrapper>
  );
}
