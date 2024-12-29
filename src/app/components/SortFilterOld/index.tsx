import React, { useState } from 'react';

import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { reorder } from 'utils/funcitions';
import { FilterItem } from './components/FilterItem';
import { Button, Popover } from 'antd';

export interface SortFilterProps {
  types: { [key: string]: string[] }[];
  list: {
    [key: string]: string;
  }[];
  setList: Function;
}

export function SortFilter({ list, setList, types }: SortFilterProps) {
  const [open, setOpen] = useState<boolean>(false);
  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const reorderedItems = reorder(
      list,
      result.source.index,
      result.destination.index,
    );

    setList(reorderedItems);
  };

  return (
    <Popover
      content={
        <div className="w-[32rem] p-0  flex flex-col">
          <h5 className="px-6 font-extrabold leading-[22px] py-3 m-0">
            Sắp xếp
          </h5>
          <div className="px-6 pt-2 pb-6 flex flex-col gap-4">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable isCombineEnabled droppableId="droppable-2">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      // @ts-ignore
                      ...provided.droppableProps.style,
                      height: `${list.length ? list.length * 48 - 12 : 0}px`,
                    }}
                    className="flex flex-col gap-3  "
                  >
                    {list.map((item, index) => (
                      <FilterItem
                        key={index}
                        types={types}
                        list={list}
                        setList={setList}
                        index={index}
                        draggableId={index.toString()}
                        title={Object.keys(item)[0]}
                      />
                    ))}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <Button
              onClick={() => {
                const unfilteredTypes = types.filter(
                  type =>
                    !list.some(
                      item => Object.keys(item)[0] === Object.keys(type)[0],
                    ),
                );
                if (unfilteredTypes.length) {
                  setList(prv => [
                    ...prv,
                    {
                      [Object.keys(unfilteredTypes[0])[0]]: Object.values(
                        unfilteredTypes[0],
                      )[0][0],
                    },
                  ]);
                }
              }}
              disabled={types.every(type =>
                list.some(
                  item => Object.keys(item)[0] === Object.keys(type)[0],
                ),
              )}
              className="w-[145px]  gap-3.5 capitalize rounded-[0.5rem] p-3.5 flex text-[#919EAB]"
            >
              <i className="fa-solid fa-plus"></i>

              <span className="text-[13px]">Thêm điều kiện</span>
            </Button>
          </div>
          <div className="px-6 flex gap-2 py-3  bg-[#F4F6F8] rounded-b-lg ">
            {' '}
            <Button
              onClick={() => {
                setOpen(false);
              }}
              className={
                'p-3.5	flex gap-3.5	 font-bold capitalize rounded-[0.5rem]'
              }
            >
              <i className="fa-solid fa-check-double"></i>{' '}
              <span className="text-[13px]"> Cập nhật</span>
            </Button>
            <Button
              disabled={!list.length}
              onClick={() => {
                setList([]);
              }}
              className={
                'p-3.5	flex gap-3.5	bg-[#919EAB] font-bold capitalize rounded-[0.5rem]'
              }
            >
              <i className="fa-solid fa-rotate"></i>

              <span className="text-[13px]"> làm lại</span>
            </Button>
          </div>
        </div>
      }
      overlayInnerStyle={{ padding: 0 }}
      open={open}
      onOpenChange={(newOpen: boolean) => {
        setOpen(newOpen);
      }}
      trigger="click"
    >
      <Button className="rounded-[0.5rem] h-[32px] w-[32px] hover:text-[#ffffff] hover:bg-[#919EAB]">
        <i className="fa-solid fa-arrow-up-z-a"></i>
      </Button>
    </Popover>
  );
}
