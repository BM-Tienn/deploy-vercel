import { Button, Pagination, Table, TableProps } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import React, { useState } from 'react';
import { SettingItems } from '../slice/types';
import { columnKeys } from '../constant';
import { PagginationType } from 'utils/types/const';
import { Edit02Icon } from 'hugeicons-react';
import { EditModal } from './EditModal';
import { updateEditObjectTable } from 'services/settingApi';
import openNotificationWithIcon from 'app/functions/openNotificationWithIcon';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SETTING_GET_LIST } from '../slice';

export interface SettingTablesProps {
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: (keys: React.Key[]) => void;
  data: SettingItems[];
  view: { [key: string]: boolean }[];
  loading: boolean;
  pagination?: PagginationType;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export function SettingTables({
  selectedRowKeys,
  setSelectedRowKeys,
  data,
  view,
  loading,
  setPage,
  setLimit,
  pagination,
}: SettingTablesProps) {
  const dispatch = useDispatch();
  const { object } = useParams();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SettingItems | null>(
    null,
  );

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<SettingItems> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleEditClick = (record: SettingItems) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const handleFormSubmit = async (updatedData: SettingItems) => {
    try {
      const formData = new FormData();
      Object.keys(updatedData).forEach(key => {
        formData.append(key, updatedData[key]);
      });

      const response = await updateEditObjectTable(formData);

      openNotificationWithIcon(
        response.data?.data?.success ? 'success' : 'error',
        '',
        response.data?.data?.message,
      );
      setIsModalVisible(false);
      setSelectedRecord(null);
    } catch ({ response }: any) {
      openNotificationWithIcon(
        'error',
        '',
        response.data.errors
          ? response.data.errors?.key + ' ' + response.data.errors?.message
          : '',
      );
    }

    dispatch(
      SETTING_GET_LIST({
        params: {
          id: object,
          page: pagination?.current || 1,
          limit: pagination?.numItemsPerPage || 10,
        },
      }),
    );
  };

  const columns: TableProps<SettingItems>['columns'] = [
    ...view
      .filter(field => Object.values(field)[0])
      .map(field => {
        return columnKeys[Object.keys(field)[0]];
      }),
    {
      key: 'action',
      width: '110px',
      fixed: 'right',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleEditClick(record)}
            type="text"
            size="small"
            className="text-slate-400"
            icon={<Edit02Icon size={16} strokeWidth={2} />}
          />
        </div>
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
        rowKey={record => record.id || `temp-${Math.random()}`}
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

      {selectedRecord && (
        <EditModal
          open={isModalVisible}
          onCancel={handleModalClose}
          dataItem={selectedRecord}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
