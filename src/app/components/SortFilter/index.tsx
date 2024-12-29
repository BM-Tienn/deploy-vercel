import React, { useState } from 'react';
import { Button, Flex, Popover, Radio, Select } from 'antd';
import { cn } from 'utils/tailwind';
import { SortByDown02Icon } from 'hugeicons-react';
import { useTranslation } from 'react-i18next';

export interface SortFilterProps {
  sort: { type: string; order: 'asc' | 'desc' };
  setSort: Function;
  types: { label: string; value: string }[];
}
const { Option } = Select;

export function SortFilter({ types, sort, setSort }: SortFilterProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [tempSort, setTempSort] = useState(sort);
  const { t } = useTranslation();
  return (
    <Popover
      content={
        <Flex vertical className="w-max">
          <Flex className="w-full px-6 py-4">
            <span className="font-semibold">{t('sort_filter.title')}</span>
          </Flex>
          <Flex vertical className="w-full px-4">
            <Flex
              className={cn(
                'flex items-center rounded-[0.5rem] justify-between ',
              )}
            >
              <div className="capitalize w-[40%] flex gap-2 items-center text-sm font-semibold">
                <Select
                  onChange={value => {
                    setTempSort(prv => ({ ...prv, type: value }));
                  }}
                  value={tempSort.type}
                  className="rounded-[0.5rem] h-full  w-full text-ellipsis	max-w-[100%]"
                >
                  <Option value={''}>{t('sort_filter.none')}</Option>
                  {types.map((type, index) => (
                    <Option key={index} value={type.value}>
                      <span className="capitalize"> {type.label}</span>
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Radio.Group
                  disabled={!tempSort.type}
                  options={[
                    {
                      label: t('sort_filter.asc'),
                      value: 'asc',
                    },
                    {
                      label: t('sort_filter.desc'),
                      value: 'desc',
                    },
                  ]}
                  buttonStyle="solid"
                  onChange={e => {
                    setTempSort(prv => ({ ...prv, order: e.target.value }));
                  }}
                  value={tempSort.order}
                  optionType="button"
                />
              </div>
            </Flex>
          </Flex>
          <Flex className="w-full px-4">
            <Button
              onClick={() => {
                setSort(tempSort);
                setOpen(false);
              }}
              type="primary"
            >
              {t('sort_filter.update')}
            </Button>
          </Flex>
        </Flex>
      }
      overlayInnerStyle={{ padding: 0 }}
      open={open}
      onOpenChange={(newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen) {
          setTempSort(sort);
        }
      }}
      trigger="click"
    >
      <Button
        className={cn(
          'rounded-[0.5rem] h-[32px] w-[32px] hover:text-[#ffffff] hover:bg-[#919EAB]',
          sort.type && 'bg-[#007AFF1A] text-[#007AFF]',
        )}
        icon={<SortByDown02Icon size={16} strokeWidth={2} />}
      />
    </Popover>
  );
}
