import React from 'react';
import { List } from 'antd';
import VirtualList from 'rc-virtual-list';

interface CustomListProps {
  data: any[];
  header?: string;
  className?: string;
  height?: number;
  itemKeyPrefix: string;
  renderItem: (item: any, index: number) => React.ReactNode;
  onScroll?: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
}

export function CustomList({
  data,
  header,
  className,
  height = 500,
  itemKeyPrefix,
  renderItem,
  onScroll,
  ...props
}: CustomListProps) {
  return (
    <List
      header={
        header ? (
          <div className="custom-header text-base font-semibold">{header}</div>
        ) : null
      }
      className={`custom-list ${className}`}
    >
      <VirtualList
        data={data}
        height={height}
        itemHeight={47}
        itemKey={item => `${itemKeyPrefix}-${data.indexOf(item)}`}
        onScroll={onScroll}
        {...props}
      >
        {(item, index) => (
          <List.Item key={`${itemKeyPrefix}-${index}`}>
            {renderItem(item, index)}
          </List.Item>
        )}
      </VirtualList>
    </List>
  );
}

CustomList.defaultProps = {
  data: [],
  header: '',
  className: '',
  height: 500,
  onScroll: () => {},
};
