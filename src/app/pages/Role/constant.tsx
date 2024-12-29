import { TableColumnProps, Tag } from 'antd';

export const columnKeys: { [key: string]: TableColumnProps<any> } = {
  id: {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '100px',
  },
  key: {
    title: 'Key',
    dataIndex: 'key',
    key: 'key',
    width: '40%',
  },
  type: {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (_, { type }) => (
      <div className="flex items-center capitalize">{type}</div>
    ),
  },
  published: {
    title: 'Published',
    key: 'published',
    dataIndex: 'published',
    render: (_, { published }) => (
      <Tag
        className="capitalize"
        color={published === 'Publish' ? 'green' : 'volcano'}
        key={published}
      >
        {published}
      </Tag>
    ),
  },
  modificationDate: {
    title: 'Modification Date',
    dataIndex: 'modificationDate',
    key: 'modificationDate',
  },
};
