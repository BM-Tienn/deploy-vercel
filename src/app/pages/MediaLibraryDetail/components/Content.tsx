import React, { useState } from 'react';
import { Skeleton, Flex, Collapse, Space, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { PermissionItem } from 'app/components/Permission/constant';
import { MetaData } from './MetaData';
import { Preview } from './Preview';

export interface ContentProps {
  loading: boolean;
  data?: any;
  permission?: PermissionItem;
  isAdmin?: boolean;
}

export function Content({ loading, data, permission, isAdmin }: ContentProps) {
  const [activeTab, setActiveTab] = useState<string>('preview');
  const { t } = useTranslation();

  const layoutItems = [
    {
      key: 'preview',
      label: t('media_library.detail.preview_title'),
      content: <Preview data={data?.sidebar} />,
    },
    ...(isAdmin || permission?.setting
      ? [
          {
            key: 'metaData',
            label: t('media_library.detail.meta_data.title'),
            content: <MetaData parentData={data} />,
          },
        ]
      : []),
    ...(isAdmin || permission?.versions
      ? [
          {
            key: 'versions',
            label: t('media_library.detail.version_title'),
            content: <>Version</>,
          },
        ]
      : []),
  ];

  const sidebarItems = [
    {
      key: '1',
      label: t('media_library.sidebar_title'),
      children: (
        <Flex vertical gap={8}>
          <Collapse
            defaultActiveKey={['2']}
            items={[
              {
                key: '2',
                label: t('media_library.sidebar_label'),
                children: (
                  <Flex vertical gap={8}>
                    <Space>
                      <div className="w-[54px] flex-none text-slate-400">
                        {t('media_library.id')}
                      </div>
                      <span>{data?.sidebar?.id}</span>
                    </Space>
                    {/* <Space align="baseline">
                      <div className="w-[54px] flex-none text-slate-400">
                        {t('media_library.filename')}
                      </div>
                      <span>{data?.sidebar?.filename}</span>
                    </Space> */}
                    <Space align="baseline">
                      <div className="w-[54px] flex-none text-slate-400">
                        {t('media_library.type')}
                      </div>
                      <span>{data?.sidebar?.type}</span>
                    </Space>
                    {/* <Space align="baseline">
                      <div className="w-[54px] flex-none text-slate-400">
                        {t('media_library.path')}
                      </div>
                      <span>{data?.sidebar?.path}</span>
                    </Space> */}
                    <Space align="baseline">
                      <div className="w-[54px] flex-none text-slate-400">
                        {t('media_library.file_type')}
                      </div>
                      <span>{data?.sidebar?.fileType}</span>
                    </Space>
                    <Space align="baseline">
                      <div className="w-[54px] flex-none text-slate-400">
                        {t('media_library.file_size')}
                      </div>
                      <span>{data?.sidebar?.fileSize}</span>
                    </Space>
                    <Space align="baseline">
                      <div className="w-[54px] flex-none text-slate-400">
                        {t('media_library.creation_date')}
                      </div>
                      <span>{data?.sidebar?.creationDate}</span>
                    </Space>
                    <Space align="baseline">
                      <div className="w-[54px] flex-none text-slate-400">
                        {t('media_library.modification_date')}
                      </div>
                      <span>{data?.sidebar?.modificationDate}</span>
                    </Space>
                  </Flex>
                ),
              },
            ]}
          />
        </Flex>
      ),
    },
  ];

  return (
    <>
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
    </>
  );
}
