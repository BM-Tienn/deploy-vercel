// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react';
import { PagginationType } from 'utils/types/const';
import { Pagination, Table, TableProps } from 'antd';

export interface ReportTablesProps {
  data: any[];
  view: { [key: string]: boolean }[];
  loading: boolean;
  pagination?: PagginationType;
  setPage: Function;
  setLimit: Function;
}

export function ReportTables({
  data,
  view,
  loading,
  setPage,
  setLimit,
  pagination,
}: ReportTablesProps) {
  const columns: TableProps<any>['columns'] = [
    ...view
      .filter(field => Object.values(field)[0])
      .map(field => {
        const key = Object.keys(field)[0];
        return {
          title: key.toUpperCase(),
          dataIndex: key,
          key: key,
          width: 200,
        };
      }),
  ];

  return (
    <div className="flex flex-col justify-between flex-1 table-wrapper">
      <Table
        loading={loading}
        pagination={false}
        columns={columns}
        dataSource={data.map((item, index) => ({
          ...item,
          tempKey: `${item.key}-${index}`,
        }))}
        scroll={{ y: window.innerHeight - 269 }}
        rowKey={record => record.tempKey}
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
