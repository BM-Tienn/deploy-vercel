import * as React from 'react';
import { cn } from 'utils/tailwind';
import { filterOptions } from '../constant';
import { Button, Input, Select } from 'antd';
import { FilterType } from 'utils/types/const';

export interface NumberFilterProps {
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

export function NumberFilter({
  list,
  setList,
  types,
  index,

  title,
  condition,
  filterValue,
}: NumberFilterProps) {
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
          className="rounded-[0.5rem] capitalize h-full w-full text-ellipsis	max-w-[100%]"
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
              const optionIndex = filterOptions.number.findIndex(
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
          className="rounded-[0.5rem] h-full text-ellipsis w-[150px] capitalize text-sm"
        >
          {filterOptions.number.map((option, index) => (
            <Option
              key={index}
              //   disabled={list.some(
              //     item => Object.conditions(item)[0] === Object.conditions(type)[0],
              //   )}
              value={option.condition}
            >
              <span className="capitalize"> {option.label}</span>
            </Option>
          ))}
        </Select>
        <Input
          onChange={e => {
            const value = e.target.value;

            setList(prv => {
              const output = [...prv];
              const optionIndex = filterOptions.number.findIndex(
                option => option.condition === condition,
              );
              output[index] = {
                [title]: {
                  [types[title]]: {
                    ...filterOptions[types[title]][optionIndex],
                    value: Number(value),
                  },
                },
              };

              return output;
            });
          }}
          type="number"
          value={typeof filterValue === 'number' ? filterValue : ''}
          className="rounded-[0.5rem]  flex-1"
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
