import { Button, Flex, Pagination, Table, TableProps } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import React from 'react';
import { CustomerItems } from '../slice/types';
import { columnKeys } from '../constant';
import { PagginationType } from 'utils/types/const';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import QueryString from 'qs';
import { useDispatch } from 'react-redux';
import { ViewIcon } from 'hugeicons-react';
import { useNavigate } from 'react-router-dom';
import { renderConfig } from 'app/pages/Object/constant';
import { customersActions } from '../slice';
import { customerDelete } from 'services/customerApi';

export interface CustomerTablesProps {
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: Function;
  data: CustomerItems[];
  view: { [key: string]: boolean }[];
  loading: boolean;
  pagination?: PagginationType;
  setPage: Function;
  setLimit: Function;
  handleItemClick: Function;
}

export function CustomerTables({
  selectedRowKeys,
  setSelectedRowKeys,
  data,
  view,
  loading,
  setPage,
  setLimit,
  pagination,
  handleItemClick,
}: CustomerTablesProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const corepulseRoot = process.env.REACT_APP_SUB_DIR;
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<CustomerItems> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: TableProps<any>['columns'] = [
    ...view
      .filter(field => Object.values(field)[0])
      .map(field => {
        const key = Object.keys(field)[0];
        const columnView = columnKeys[key];

        if (key === 'key') {
          columnView.render = (_, record, index) =>
            renderConfig['system'](_, record[key], index, () =>
              navigate(`${corepulseRoot}/Customers/detail?id=${record.id}`),
            );
        }
        return columnView;
      }),
    {
      key: 'action',
      render: (_, record) => (
        <Flex className="items-center gap-2" justify="flex-end">
          {record.parent && (
            <Button
              type="text"
              className="h-8 w-8 p-0"
              onClick={() => {
                handleItemClick(record.id, record.key);
              }}
            >
              <ViewIcon />
            </Button>
          )}

          <Button
            onClick={() =>
              navigate(`${corepulseRoot}/Customers/detail?id=${record.id}`)
            }
            type="text"
            className="h-8 w-8 p-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="none"
            >
              <path
                d="M2.58594 9.60938L10.8984 1.29688C11.582 0.613281 12.7031 0.613281 13.3867 1.29688L14.4531 2.36328C14.5352 2.44531 14.6172 2.55469 14.6719 2.63672C15.1367 3.32031 15.0547 4.25 14.4531 4.85156L6.14062 13.1641C6.11328 13.1914 6.05859 13.2188 6.03125 13.2734C5.75781 13.4922 5.45703 13.6562 5.12891 13.7656L1.82031 14.7227C1.60156 14.8047 1.35547 14.75 1.19141 14.5586C1 14.3945 0.945312 14.1484 1 13.9297L1.98438 10.6211C2.09375 10.2383 2.3125 9.88281 2.58594 9.60938ZM3.24219 11.0039L2.61328 13.1367L4.74609 12.5078C4.91016 12.4531 5.07422 12.3711 5.21094 12.2344L11.4727 5.97266L9.75 4.27734L3.51562 10.5391C3.48828 10.5391 3.48828 10.5664 3.46094 10.5938C3.35156 10.7031 3.29688 10.8398 3.24219 11.0039Z"
                fill="#919EAB"
              />
            </svg>
          </Button>
          <ConfirmDeleteModal
            title={`Delete ${record.type}?`}
            question={`Are you sure you want to delete ${record.key}?`}
            message={`This action cannot be undone.`}
            action={async () => {
              const { data } = await customerDelete(
                QueryString.stringify({ id: record.id }),
              );
              if (data) {
                dispatch(customersActions.deleteCustomer([record.id]));
              }
            }}
          />
        </Flex>
      ),
    },
  ];

  return (
    <div className="flex flex-col justify-between flex-1 table-wrapper">
      <Table
        loading={loading}
        rowSelection={rowSelection}
        pagination={false}
        columns={columns}
        dataSource={data.map(item => ({ ...item }))}
        scroll={{ y: window.innerHeight - 269 }}
        rowKey={record => record.id}
      />
      <Pagination
        className="h-[46px] items-center"
        align="end"
        showSizeChanger
        current={pagination?.current}
        pageSize={pagination?.numItemsPerPage || 10}
        onChange={(page, pageSize) => {
          setPage(page);
          setLimit(pageSize);
        }}
        total={pagination?.totalCount}
      />
    </div>
  );
}
