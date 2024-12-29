import { Button, Radio } from 'antd';
import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { cn } from 'utils/tailwind';
import { Select } from 'antd';
export interface FilterItemProps {
  index: number;
  draggableId: string;
  title: string;
  types: { [key: string]: string[] }[];

  list: {
    [key: string]: string;
  }[];
  setList: Function;
}
const { Option } = Select;
export function FilterItem({
  draggableId,
  index,
  title,
  list,
  setList,
  types,
}: FilterItemProps) {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          // let offsetEl = document.querySelector(
          //   `[data-rbd-draggable-id='${provided.draggableProps['data-rbd-draggable-id']}']`,
          // ) as HTMLElement;
        }

        return (
          <div
            className={cn(
              'flex items-center rounded-[0.5rem] justify-between hover:bg-[#F4F6F8]',
              snapshot.isDragging && 'bg-[#F4F6F8] select-none',
            )}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className="capitalize max-w-[40%] flex gap-2 items-center text-sm font-semibold">
              <i className="pl-2 fa-solid fa-grip-vertical"></i>
              <Select
                onChange={value => {
                  const selectedType = types.find(
                    type => Object.keys(type)[0] === value,
                  );
                  if (selectedType) {
                    setList(prv => {
                      const output = [...prv];

                      output[index] = { [value]: selectedType[value][0] };
                      return output;
                    });
                  }
                }}
                value={title}
                className="rounded-[0.5rem] h-full  w-fit text-ellipsis	max-w-[100%]"
              >
                {types.map((type, index) => (
                  <Option
                    key={index}
                    disabled={list.some(
                      item => Object.keys(item)[0] === Object.keys(type)[0],
                    )}
                    value={Object.keys(type)[0]}
                  >
                    {Object.keys(type)[0]}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Radio.Group
                options={types
                  ?.reduce((arr: any, type, index) => {
                    if (Object.keys(type)[0] === title) {
                      arr = type[title];

                      return arr;
                    }

                    return arr;
                  }, [])
                  ?.map((string, index) => ({ label: string, value: string }))}
                onChange={e => {
                  setList(prv => {
                    const output = [...prv];

                    output[index][title] = e.target.value;

                    return output;
                  });
                }}
                value={list[index][title]}
                optionType="button"
              />

              <Button
                onClick={() => {
                  setList(prv => {
                    const output = [...prv];
                    output.splice(index, 1);

                    return output;
                  });
                }}
                type="text"
                className="w-fit capitalize rounded-[0.5rem] p-2 flex text-[#919EAB]"
              >
                <i className="fa-solid fa-x"></i>
              </Button>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
}
