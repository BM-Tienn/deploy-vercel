import { TableColumnProps, Tag } from 'antd';

export const columnKeys: { [key: string]: TableColumnProps<any> } = {
  id: {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '100px',
  },
  name: {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '320px',
  },
  title: {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: '320px',
  },
  checked: {
    title: 'Status',
    key: 'checked',
    dataIndex: 'checked',
    render: (_, { checked }) => {
      return (
        <Tag
          className="capitalize"
          color={checked === 'publish' ? 'green' : 'volcano'}
          key={checked}
        >
          {checked}
        </Tag>
      );
    },
    width: '120px',
  },
};
export const columnTypes = {
  id: 'string',
  title: 'string',
  checked: 'published',
  name: 'string',
};
