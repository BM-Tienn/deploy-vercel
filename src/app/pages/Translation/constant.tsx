import { TableColumnProps } from 'antd';

export const columnKeys: { [key: string]: TableColumnProps<any> } = {
  key: {
    title: 'Key',
    dataIndex: 'key',
    key: 'key',
    width: '320px',
  },
};

export const columnTypes = {
  key: 'string',
};
