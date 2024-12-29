import React, { useState } from 'react';
import { Skeleton, Flex, Collapse, Space, Button } from 'antd';
import { Setting } from './Setting';
import { PermissionItem } from 'app/components/Permission/constant';
import { useTranslation } from 'react-i18next';
import { Properties } from './Properties';

export interface ContentProps {
  loading: boolean;
  data?: any;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  iframeSrc: string;
  callback: Function;
  permission?: PermissionItem;
  isAdmin?: boolean;
}

export function Content({
  loading,
  data,
  iframeRef,
  iframeSrc,
  callback,
  permission,
  isAdmin,
}: ContentProps) {
  const [activeTab, setActiveTab] = useState<string>('edit');
  const { t } = useTranslation();

  const layoutItems = [
    {
      key: 'edit',
      label: t('pages.detail.edit_title'),
      content: (
        <iframe
          id="editIframe"
          ref={iframeRef}
          title="editable"
          src={iframeSrc}
          className="min-h-full"
          height={800}
          style={{ width: '100%', border: 'none' }}
        />
      ),
    },
    ...(isAdmin || permission?.setting
      ? [
          {
            key: 'setting',
            label: t('pages.detail.setting_title'),
            content: (
              <Setting
                dataForm={data?.data}
                permission={permission}
                isAdmin={isAdmin}
              />
            ),
          },
          {
            key: 'properties',
            label: t('pages.detail.properties_title'),
            content: <Properties />,
          },
        ]
      : []),
    ...(isAdmin || permission?.versions
      ? [
          {
            key: 'versions',
            label: t('pages.detail.version_title'),
            content: <>Version</>,
          },
        ]
      : []),
  ];

  const renderSidebarItem = (label: string, value: any) => (
    <Space align="baseline">
      <div className="w-[54px] flex-none text-slate-400">{label}</div>
      <span>{value}</span>
    </Space>
  );

  const sidebarContent = (
    <Flex vertical gap={8}>
      {renderSidebarItem(t('pages.id'), data?.sidebar?.id)}
      {renderSidebarItem(t('pages.key'), data?.sidebar?.key)}
      {renderSidebarItem(t('pages.status'), data?.sidebar?.published)}
      {renderSidebarItem(t('pages.path'), data?.sidebar?.path)}
      {renderSidebarItem(t('pages.creation_date'), data?.sidebar?.creationDate)}
      {renderSidebarItem(
        t('pages.modification_date'),
        data?.sidebar?.modificationDate,
      )}
    </Flex>
  );

  const sidebarItems = [
    {
      key: '1',
      label: t('pages.sidebar_title'),
      children: (
        <Flex vertical gap={8}>
          <Collapse
            defaultActiveKey={['2']}
            items={[
              {
                key: '2',
                label: t('pages.sidebar_label'),
                children: sidebarContent,
              },
            ]}
          />
        </Flex>
      ),
    },
  ];

  return (
    <React.Fragment>
      {loading ? (
        <div className="mx-5 w-[200px]">
          <Skeleton.Button active block size="large" shape="round" />
        </div>
      ) : (
        <Flex className="relative mx-5 w-fit p-1 items-center gap-2 bg-white rounded-xl border border-[#DAD9D9]">
          {layoutItems.map(tab => (
            <Button
              key={tab.key}
              className={`rounded-lg text-base capitalize h-8 px-4 font-medium ${
                activeTab === tab.key
                  ? 'bg-[#EFE7F3] text-[#6A1B9A]'
                  : 'text-[#919EAB]'
              }`}
              type="text"
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </Flex>
      )}
      <div className="w-full px-5 pt-0 pb-3 overflow-hidden">
        <Flex gap={24} className="w-full h-full overflow-hidden">
          <Flex
            vertical
            className="flex-1 px-4 h-full rounded-[12px] border overflow-auto"
          >
            {layoutItems.map(tab => (
              <div
                key={tab.key}
                style={{
                  display: activeTab === tab.key ? 'block' : 'none',
                  width: '100%',
                  height: '100%',
                }}
              >
                {tab.content}
              </div>
            ))}
          </Flex>
          <Flex vertical gap={8} className="w-[240px] flex-none">
            {loading ? (
              <>
                <Skeleton active />
                <Skeleton active />
              </>
            ) : (
              <Collapse defaultActiveKey={['1']} items={sidebarItems} />
            )}
          </Flex>
        </Flex>
      </div>
    </React.Fragment>
  );
}
