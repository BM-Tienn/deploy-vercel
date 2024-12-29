import { TableColumnProps } from 'antd';

export const columnKeys: { [key: string]: TableColumnProps<any> } = {
  id: {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '5%',
  },
  filename: {
    title: 'Filename',
    dataIndex: 'filename',
    key: 'filename',
    width: '30%',
  },
  path: {
    title: 'Path',
    dataIndex: 'path',
    key: 'path',
    width: '30%',
  },
  type: {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (_, { type }) => (
      <div className="flex items-center capitalize">{type}</div>
    ),
  },
  fullPath: {
    title: 'FullPath',
    dataIndex: 'fullPath',
    key: 'fullPath',
    width: '40%',
  },
  mimetype: {
    title: 'Mimetype',
    key: 'mimetype',
    dataIndex: 'mimetype',
  },
};

export const columnView: {
  [key: string]: boolean;
}[] = [
  { id: true },
  { filename: true },
  { type: true },
  { path: true },
  { fullPath: false },
  { mimetype: true },
];
