import React, { useState } from 'react';

// import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { FilterItem } from './components/FilterItem';
import { reorder } from 'utils/funcitions';
import { Button, Popover, Flex } from 'antd';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { ViewIcon } from 'hugeicons-react';
import { useTranslation } from 'react-i18next';

export interface ViewFilterProps {
  list: {
    [key: string]: boolean;
  }[];
  setList: Function;
}

export function ViewFilter({ list, setList }: ViewFilterProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();
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
      placement="bottom"
      overlayInnerStyle={{ padding: 0 }}
      open={open}
      onOpenChange={(newOpen: boolean) => {
        setOpen(newOpen);
      }}
      content={
        <Flex vertical className="w-max">
          <Flex className="w-full px-6 py-4">
            <span className="font-semibold">{t('view_filter.title')}</span>
          </Flex>
          <Flex className="w-full px-4">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable isCombineEnabled droppableId="droppable-1">
                {(provided, snapshot) => (
                  <Flex
                    vertical
                    gap={4}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      // @ts-ignore
                      ...provided.droppableProps.style,
                      height: `${
                        list.length
                          ? list.length * 40 + (list.length - 1) * 4
                          : 0
                      }px`,
                      maxHeight: 500,
                      overflow: 'auto',
                    }}
                  >
                    {list.map((item, index) => (
                      <FilterItem
                        key={index}
                        list={list}
                        setList={setList}
                        index={index}
                        draggableId={index.toString()}
                        title={Object.keys(item)[0]}
                      />
                    ))}
                  </Flex>
                )}
              </Droppable>
            </DragDropContext>
          </Flex>
          {/* <div className="px-6 flex gap-2 py-3  bg-[#F4F6F8] rounded-b-lg ">
            <Button
              onClick={() => {
                setOpen(false);
              }}
              className={
                'p-3.5	flex gap-3.5	 font-bold capitalize rounded-[0.5rem]'
              }
            >
              <i className="fa-solid fa-check-double"></i> Cập nhật
            </Button>
          </div> */}
        </Flex>
      }
      trigger="click"
    >
      <Button
        onClick={() => {
          setOpen(true);
        }}
        icon={<ViewIcon size={16} strokeWidth={2} />}
      />
    </Popover>
  );
}
