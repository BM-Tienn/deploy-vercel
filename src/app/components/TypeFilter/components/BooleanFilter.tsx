// import { Button } from 'app/components/ui/button';
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from 'app/components/ui/select';
import * as React from 'react';
import { cn } from 'utils/tailwind';
import { filterOptions } from '../constant';
import { Button, Checkbox, Select, Flex } from 'antd';
import { FilterType } from 'utils/types/const';
// import { Checkbox } from 'app/components/ui/checkbox';

export interface BooleanFilterProps {
  list: {
    [key: string]: string;
  }[];
  setList: Function;
  types: FilterType;
  index: number;

  title: string;
  condition: string;
  filterValue?: string | number | boolean;
}
const { Option } = Select;

export function BooleanFilter({
  list,
  setList,
  types,
  index,

  title,
  condition,
  filterValue,
}: BooleanFilterProps) {
  return (
    <Flex gap={8} justify="between" align="center" className={cn('')}>
      <Flex className="w-[120px] flex items-center text-sm">
        <Select
          onChange={value => {
            setList(prv => {
              const output = [...prv];

              output[index] = {
                [value]: { [types[value]]: filterOptions[types[value]][0] },
              };

              return output;
            });
          }}
          value={title}
          className="w-full"
        >
          {Object.keys(types).map((keys, index) => (
            <Option key={index} value={keys}>
              <span className="capitalize"> {keys}</span>
            </Option>
          ))}
        </Select>
      </Flex>
      <Flex gap={8} align="center" className="w-[280px]">
        <Select
          onChange={value => {
            setList(prv => {
              const output = [...prv];
              const optionIndex = filterOptions.boolean.findIndex(
                option => option.condition === value,
              );
              output[index] = {
                [title]: {
                  [types[title]]: filterOptions[types[title]][optionIndex],
                },
              };

              return output;
            });
          }}
          value={condition}
          className="w-full"
        >
          {filterOptions.boolean.map((option, index) => (
            <Option key={index} value={option.condition}>
              <span className="capitalize"> {option.label}</span>
            </Option>
          ))}
        </Select>
        <Flex justify="center" align="center" className="w-full">
          <Checkbox
            checked={typeof filterValue === 'boolean' ? filterValue : false}
            onChange={e => {
              setList(prv => {
                const output = [...prv];
                const optionIndex = filterOptions.boolean.findIndex(
                  option => option.condition === condition,
                );
                output[index] = {
                  [title]: {
                    [types[title]]: {
                      ...filterOptions[types[title]][optionIndex],
                      value: e.target.checked,
                    },
                  },
                };
                return output;
              });
            }}
          >
            <span className={filterValue ? 'text-[#007AFF]' : ''}>
              {filterValue ? 'publish' : 'unpublish'}
            </span>
          </Checkbox>
        </Flex>
        <Button
          onClick={() => {
            setList(prv => {
              const output = [...prv];
              output.splice(index, 1);

              return output;
            });
          }}
          type="text"
          size="small"
          className="rounded-[8px] text-slate-500"
          icon={<i className="far fa-x" />}
        />
      </Flex>
    </Flex>
  );
}
