import * as React from 'react';
import { Flex } from 'antd';
import { Draggable } from 'react-beautiful-dnd';
import { cn } from 'utils/tailwind';
import {
  ViewIcon,
  ViewOffSlashIcon,
  DragDropVerticalIcon,
} from 'hugeicons-react';
export interface FilterItemProps {
  index: number;
  draggableId: string;
  title: string;
  list: {
    [key: string]: boolean;
  }[];
  setList: Function;
}

export function FilterItem({
  draggableId,
  index,
  title,
  list,
  setList,
}: FilterItemProps) {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          // let offsetEl = document.querySelector(
          //   `[data-rbd-draggable-id='${provided.draggableProps['data-rbd-draggable-id']}']`,
          // ) as HTMLElement;s
          // provided.draggableProps.style = {
          //   ...provided.draggableProps.style,
          //   left: offsetEl ? offsetEl.offsetLeft : 0,
          //   top: offsetEl ? offsetEl.offsetTop : 0,
          // };
        }
        return (
          <Flex
            className={cn(
              'flex py-2 px-3 items-center rounded-[0.5rem] justify-between hover:bg-[#F4F6F8]',
              snapshot.isDragging && 'bg-[#F4F6F8] select-none',
            )}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Flex gap={8} align="center" className="text-sm mr-4">
              <DragDropVerticalIcon size={16} strokeWidth={2} />
              {title}
            </Flex>
            <label
              htmlFor={title}
              className="h-[24px] w-[24px] flex items-center justify-center"
            >
              <input
                checked={list[index][title]}
                onChange={e => {
                  setList(prv => {
                    const output = [...prv];

                    output[index][title] = e.target.checked;

                    return output;
                  });
                }}
                className="peer hidden"
                type="checkbox"
                id={title}
              />
              <ViewIcon
                size={16}
                strokeWidth={2}
                className="hidden peer-checked:block"
              />
              <ViewOffSlashIcon
                size={16}
                strokeWidth={2}
                className="text-slate-400 peer-checked:hidden"
              />
            </label>
          </Flex>
        );
      }}
    </Draggable>
  );
}
