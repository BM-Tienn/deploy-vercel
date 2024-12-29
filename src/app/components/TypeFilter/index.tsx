import React, { useState } from 'react';

import { cn } from 'utils/tailwind';
import { filterOptions } from './constant';
import { BooleanFilter } from './components/BooleanFilter';
import { NumberFilter } from './components/NumberFilter';
import { StringFilter } from './components/StringFilter';
import { Button, Popover, Radio, Flex } from 'antd';
import { FilterType } from 'utils/types/const';
import { DateFilter } from './components/DateFilter';
import { FilterIcon, PlusSignIcon } from 'hugeicons-react';
import { useTranslation } from 'react-i18next';
export interface TypeFilterProps {
  types: FilterType;
  filterObj: {
    filterRule: 'and' | 'or';
    filter: any[];
  };
  setFilterObj: Function;
}

export function TypeFilter({
  types,
  filterObj,
  setFilterObj,
}: TypeFilterProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [filterRule, setFilterRule] = useState<'and' | 'or'>(
    filterObj.filterRule,
  );
  const [filter, setFilter] = useState<
    {
      [key: string]: any;
    }[]
  >(filterObj?.filter);

  return (
    <Popover
      content={
        <Flex vertical className="w-max">
          <Flex
            justify="between"
            align="center"
            gap={8}
            className="w-full px-6 py-4"
          >
            <span className="font-semibold text-lg">
              {t('type_filter.title')}
            </span>
            {/* <span className="text-sm font-semibold uppercase text-slate-500">
                Rule
              </span> */}
            <Radio.Group
              onChange={e => {
                setFilterRule(e.target.value);
              }}
              size="small"
              value={filterRule}
              optionType="button"
              buttonStyle="solid"
              className="[&_.ant-radio-button-wrapper]:!w-[64px] [&_.ant-radio-button-wrapper]:text-center"
            >
              <Radio.Button value="and">{t('type_filter.and')}</Radio.Button>
              <Radio.Button value="or">{t('type_filter.or')}</Radio.Button>
            </Radio.Group>
          </Flex>
          <Flex vertical gap={8} className="px-6 mb-5">
            <Flex vertical gap={8} className="max-h-[192px] overflow-auto">
              {filter.map((item, index) => {
                const dataType = Object.keys(item)[0];

                const condition = item[dataType][types[dataType]].condition;
                const filterValue: any = item[dataType][types[dataType]].value;

                if (types[dataType] === 'boolean') {
                  return (
                    <BooleanFilter
                      key={index}
                      list={filter}
                      index={index}
                      title={dataType}
                      types={types}
                      setList={setFilter}
                      condition={condition}
                      filterValue={filterValue}
                    />
                  );
                }
                if (types[dataType] === 'number') {
                  return (
                    <NumberFilter
                      key={index}
                      list={filter}
                      index={index}
                      title={dataType}
                      types={types}
                      setList={setFilter}
                      condition={condition}
                      filterValue={filterValue}
                    />
                  );
                }
                if (types[dataType] === 'string') {
                  return (
                    <StringFilter
                      key={index}
                      list={filter}
                      index={index}
                      title={dataType}
                      types={types}
                      setList={setFilter}
                      condition={condition}
                      filterValue={filterValue}
                    />
                  );
                }
                if (types[dataType] === 'date') {
                  return (
                    <DateFilter
                      key={index}
                      list={filter}
                      index={index}
                      title={dataType}
                      types={types}
                      setList={setFilter}
                      condition={condition}
                      filterValue={filterValue}
                    />
                  );
                }
                return null;
              })}
            </Flex>
            <Button
              onClick={() => {
                setFilter(prv => [
                  ...prv,
                  {
                    [Object.keys(types)[0]]: {
                      [Object.values(types)[0]]:
                        filterOptions[Object.values(types)[0]][0],
                    },
                  },
                ]);
              }}
              // disabled={types.every(type =>
              //   list.some(item => Object.keys(item)[0] === Object.keys(type)[0]),
              // )}
              icon={<PlusSignIcon size={16} strokeWidth={2} />}
              type="text"
              className="w-max font-semibold"
            >
              {t('type_filter.condition')}
            </Button>
          </Flex>
          <Flex className="px-6 gap-2 py-3  bg-slate-100">
            <Button
              onClick={() => {
                setOpen(false);
                setFilterObj({ filterRule, filter });
              }}
              type="primary"
            >
              {t('type_filter.update')}
            </Button>
            <Button
              disabled={!filter.length}
              onClick={() => {
                setFilter([]);
                setFilterObj({ filterRule, filter: [] });
              }}
            >
              {t('type_filter.reset')}
            </Button>
          </Flex>
        </Flex>
      }
      overlayInnerStyle={{ padding: 0 }}
      open={open}
      onOpenChange={(newOpen: boolean) => {
        setOpen(newOpen);
      }}
      trigger="click"
    >
      <Button
        className={cn(
          '',
          filterObj?.filter.length && 'bg-[#007AFF1A] text-[#007AFF]',
        )}
        icon={<FilterIcon size={16} strokeWidth={2} />}
      />
    </Popover>
  );
}
