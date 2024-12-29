import { Button, Popover, Table } from 'antd';
import type { TableProps } from 'antd';
import { useNavigate } from 'react-router-dom';

export interface DataType {
  id: string | number;
  class: string;
  type: string;
  name: string;
  userName: string;
  date: string;
  subId: number;
}

export interface LatestChangeTableProps {
  data?: DataType[];
}

export function LatestChangeTable({ data }: LatestChangeTableProps) {
  const navigate = useNavigate();

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => {
        const content = (
          <Button
            onClick={() =>
              navigate(
                process.env.REACT_APP_SUB_DIR +
                  '/' +
                  record.class +
                  '/detail?id=' +
                  record.id,
              )
            }
          >
            View
          </Button>
        );
        return (
          <Popover placement="right" content={content}>
            {name}
          </Popover>
        );
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Date',
      key: 'date',
      dataIndex: 'date',
    },
  ];

  return (
    <Table<DataType>
      columns={columns}
      dataSource={data}
      pagination={false}
      rowKey={record => record.subId}
    />
  );
}
