import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  FormInstance,
  Select,
  Skeleton,
  Flex,
  Collapse,
  Space,
} from 'antd';
import { cn } from 'utils/tailwind';
import { ObjectLayout, SideBarData } from '../constant';
import { ContentMain } from './ContentMain';
import { ItemProps } from 'app/slice/types';
import { PermissionItem } from 'app/components/Permission/constant';
import { useTranslation } from 'react-i18next';

export interface ContentProps {
  loading: boolean;
  data?: {
    layout: ObjectLayout;
    sidebar: SideBarData;
    options: ItemProps[][];
  };
  globalForm: FormInstance;
  locale: string | undefined;
  setLocale: Function;
  permission: PermissionItem;
  isAdmin?: boolean;
}

export interface LanguagueProps {
  key?: string;
  value?: string;
  selected?: boolean;
}

export function Content({
  loading,
  data,
  globalForm,
  locale,
  setLocale,
  permission,
  isAdmin,
}: ContentProps) {
  const [languages, setLanguages] = useState<LanguagueProps[] | undefined>(
    undefined,
  );
  const [active, setActive] = useState<number>(0);
  const [underLine, setUnderLine] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });
  const { t } = useTranslation();
  const tabsRef = useRef<any>([]);

  useEffect(() => {
    function setTabPosition() {
      const currentTab = tabsRef.current[active];
      setUnderLine({
        left: currentTab?.offsetLeft + 16 || 0,
        width: currentTab?.clientWidth - 32 || 0,
      });
    }

    setTabPosition();
    window.addEventListener('resize', setTabPosition);

    return () => window.removeEventListener('resize', setTabPosition);
  }, [active, loading]);
  const activeLayout = data?.layout?.children
    ? data.layout.children[active]
    : undefined;

  useEffect(() => {
    if (data?.sidebar?.languages) {
      const languages = data.sidebar.languages;
      const selectedValue = languages?.find(item => item.selected)?.value;
      if (selectedValue) setLocale(selectedValue);
      setLanguages(languages);
    }
  }, [data, setLocale]);

  const sidebarItems = [
    {
      key: '1',
      label: t('object.sidebar_title'),
      children: (
        <Flex vertical gap={8}>
          <Flex vertical gap={8}>
            <span className="text-sm text-slate-400">
              {t('object.select_language')}
            </span>
            <Select
              className="w-full"
              placeholder={t('object.select_language')}
              value={locale}
              onChange={value => setLocale(value)}
              options={languages?.map(item => {
                return {
                  label: item.key,
                  value: item.value,
                };
              })}
              optionRender={option => (
                <span role="img" aria-label={option.data.label}>
                  {option.data.label}
                </span>
              )}
            />
          </Flex>
          <Collapse
            defaultActiveKey={['2']}
            items={[
              {
                key: '2',
                label: t('object.sidebar_label'),
                children: (
                  <Flex vertical gap={8}>
                    <Space>
                      <div className="w-[54px] flex-none text-slate-400">
                        {t('object.id')}
                      </div>
                      <span>{data?.sidebar.id}</span>
                    </Space>
                    <Space align="baseline">
                      <div className="w-[54px] flex-none text-slate-400">
                        {t('object.key')}
                      </div>
                      <span>{data?.sidebar.key}</span>
                    </Space>
                    <Space align="baseline">
                      <div className="w-[54px] flex-none text-slate-400">
                        {t('object.status')}
                      </div>
                      <span>{data?.sidebar.published}</span>
                    </Space>
                    <Space align="baseline">
                      <div className="w-[54px] flex-none text-slate-400">
                        {t('object.path')}
                      </div>
                      <span>{data?.sidebar.path}</span>
                    </Space>
                    <Space align="baseline">
                      <div className="w-[54px] flex-none text-slate-400">
                        {t('object.creation_date')}
                      </div>
                      <span>{data?.sidebar.creationDate}</span>
                    </Space>
                    <Space align="baseline">
                      <div className="w-[54px] flex-none text-slate-400">
                        {t('object.modification_date')}
                      </div>
                      <span>{data?.sidebar.modificationDate}</span>
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
        <Flex className="relative mx-5 w-fit p-1 items-center gap-2 bg-white rounded-xl border border-[#DAD9D9] hidden">
          {data?.layout.children?.length &&
            data.layout.children.map((tab, idx) => (
              <Button
                key={idx}
                ref={el => (tabsRef.current[idx] = el)}
                className={cn(
                  'rounded-lg text-base capitalize h-8 px-4 text-[#919EAB] font-medium',
                  active === idx && 'bg-[#EFE7F3] text-[#6A1B9A]',
                )}
                type="text"
                onClick={() => setActive(idx)}
              >
                {tab.title ? tab.title : tab.name}
              </Button>
            ))}
          <span
            className="absolute bottom-[-2px] block h-1 bg-[#6A1B9A] rounded-3xl transition-all duration-300"
            style={{ left: underLine.left, width: underLine.width }}
          />
        </Flex>
      )}
      <div className="w-full px-5 pt-0 pb-3 overflow-hidden">
        <Flex gap={16} className="w-full h-full overflow-hidden">
          {loading ? (
            <div className="w-3/4 flex flex-col gap-4">
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
            </div>
          ) : (
            <ContentMain
              key={data?.layout.name}
              globalForm={globalForm}
              data={activeLayout}
              options={data?.options}
            />
          )}
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
