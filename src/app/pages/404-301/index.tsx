// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { SeoHttpWrapper } from './styled';
import { Helmet } from 'react-helmet-async';
import { Flex, Tabs, TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { PermissionItem } from 'app/components/Permission/constant';
import { permissionDefault } from 'app/components/Permission/components/LayoutTables';
import { filterPermission } from 'app/functions/hasPermission';
import { globalPermissionData, globalIsAdmin } from 'app/slice/selector';
import { useSelector } from 'react-redux';
import { Monitor } from './components/Monitor';
import { Redirect } from './components/Redirect';

export interface SeoHttpProps {}

export function SeoHttp(props: SeoHttpProps) {
  const [activeTab, setActiveTab] = useState<string>('seo-monitor');
  const { t } = useTranslation();
  const [permission, setPermission] =
    useState<PermissionItem>(permissionDefault);
  const permissionData = useSelector(globalPermissionData);
  const isAdmin = useSelector(globalIsAdmin);

  useEffect(() => {
    const permissionItem = filterPermission(
      permissionData,
      'others',
      '404-301',
    );
    if (permissionItem) setPermission(permissionItem);
  }, [permissionData]);

  const layoutItems: TabsProps['items'] = [
    ...(isAdmin || permission?.listing
      ? [
          {
            key: 'seo-monitor',
            label: t('seo_http.title_data.monitor'),
            children: <Monitor permission={permission} isAdmin={isAdmin} />,
          },
        ]
      : []),
    ...(isAdmin || permission?.listing
      ? [
          {
            key: 'seo-redirect',
            label: t('seo_http.title_data.redirect'),
            children: <Redirect permission={permission} isAdmin={isAdmin} />,
          },
        ]
      : []),
    ...(isAdmin || permission?.setting
      ? [
          {
            key: 'seo-setting',
            label: t('seo_http.title_data.setting'),
            children: <></>,
          },
        ]
      : []),
  ];

  return (
    <SeoHttpWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>{t('seo_http.title')}</title>
      </Helmet>
      <Flex className="px-5 py-3 justify-between items-center">
        <Flex className="gap-6">
          <Flex vertical>
            <h1 className="font-bold text-[20px]">{t('seo_http.title')}</h1>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={layoutItems}
            />
          </Flex>
        </Flex>
      </Flex>
    </SeoHttpWrapper>
  );
}
