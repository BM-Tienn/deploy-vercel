import * as React from 'react';
import { cn } from 'utils/tailwind';
import { filterOptions } from '../constant';
import { Button, DatePicker, Select } from 'antd';
import { FilterType } from 'utils/types/const';
import dayjs from 'dayjs';
export interface DateFilterProps {
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

export function DateFilter({
  list,
  setList,
  types,
  index,

  title,
  condition,
  filterValue,
}: DateFilterProps) {
  return (
    <div className={cn('flex items-center rounded-[0.5rem] justify-between')}>
      <div className="capitalize w-[28%] flex gap-2 items-center text-sm font-semibold">
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
          className="rounded-[0.5rem] h-full w-full text-ellipsis	max-w-[100%]"
        >
          {Object.keys(types).map((keys, index) => (
            <Option key={index} value={keys}>
              <span className="capitalize"> {keys}</span>
            </Option>
          ))}
        </Select>
      </div>
      <div className="flex items-center w-[72%] max-w-[72%] gap-2">
        <Select
          onChange={value => {
            setList(prv => {
              const output = [...prv];
              const optionIndex = filterOptions.date.findIndex(
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
          className="rounded-[0.5rem] h-full text-ellipsis w-[150px]	 text-sm"
        >
          {filterOptions.date.map((option, index) => (
            <Option key={index} value={option.condition}>
              <span className="capitalize"> {option.label}</span>
            </Option>
          ))}
        </Select>
        <DatePicker
          onChange={(date, dateString) => {
            const value = dateString;

            setList(prv => {
              const output = [...prv];
              const optionIndex = filterOptions.date.findIndex(
                option => option.condition === condition,
              );
              output[index] = {
                [title]: {
                  [types[title]]: {
                    ...filterOptions[types[title]][optionIndex],
                    value,
                  },
                },
              };

              return output;
            });
          }}
          className="rounded-[0.5rem]  flex-1"
          value={
            typeof filterValue === 'string'
              ? dayjs(filterValue, 'DD-MM-YYYY')
              : undefined
          }
          format={'DD-MM-YYYY'}
        />

        <Button
          onClick={() => {
            setList(prv => {
              const output = [...prv];
              output.splice(index, 1);

              return output;
            });
          }}
          className="w-fit capitalize rounded-[0.5rem] p-2 flex text-[#919EAB]"
          type="text"
        >
          <i className="fa-solid fa-x"></i>
        </Button>
      </div>
    </div>
  );
}
