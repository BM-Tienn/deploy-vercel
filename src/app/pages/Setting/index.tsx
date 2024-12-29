// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { AdminSettingWrapper } from './styled';
import { Helmet } from 'react-helmet-async';
import { Tabs, Form, Flex } from 'antd';
import type { TabsProps } from 'antd';
import { License } from './components/License';
import { Appearance } from './components/Appearance';
import { DataSetup } from './components/DataSetup';
import { CsrfToken } from 'utils/types/const';
import { useSearchParams } from 'react-router-dom';
import { setCookie } from 'utils/cookies';
import { User } from './components/User';

export interface AdminSettingProps {}

export function AdminSetting(props: AdminSettingProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('license');
  const [parentForm] = Form.useForm();

  let [searchParams] = useSearchParams();
  const csrfToken = searchParams.get('csrfToken');
  if (csrfToken) setCookie(CsrfToken, csrfToken);

  const layoutItems: TabsProps['items'] = [
    {
      key: 'license',
      label: 'License',
      children: <License activeTab={activeTab} setActiveTab={setActiveTab} />,
    },
    {
      key: 'appearance',
      label: 'Appearance',
      children: (
        <Appearance
          parentForm={parentForm}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      ),
    },
    {
      key: 'data',
      label: 'Data Setup',
      children: <DataSetup activeTab={activeTab} setActiveTab={setActiveTab} />,
    },
    {
      key: 'user',
      label: 'User Admin',
      children: <User activeTab={activeTab} setActiveTab={setActiveTab} />,
    },
  ];

  return (
    <AdminSettingWrapper className="w-5/6">
      <Helmet>
        <title>Setting</title>
      </Helmet>
      <Flex vertical className="px-5 py-3">
        <h3 className="font-semibold text-xl">Setting</h3>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={layoutItems}
        />
      </Flex>
    </AdminSettingWrapper>
  );
}
