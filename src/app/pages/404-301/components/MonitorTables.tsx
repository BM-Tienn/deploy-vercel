import { Button, Flex, Pagination, Table, TableProps } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import React, { useState } from 'react';
import { SeoMonitorItems } from '../slice/types';
import { PagginationType } from 'utils/types/const';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import QueryString from 'qs';
import { useDispatch } from 'react-redux';
import { seoHttpsActions } from '../slice';
import { useTranslation } from 'react-i18next';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { PermissionItem } from 'app/components/Permission/constant';
import { ViewIcon } from 'hugeicons-react';
import { MonitorModal } from './MonitorModal';
import { seoMonitorDelete } from 'services/seoHttpApi';

export interface MonitorTablesProps {
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: Function;
  data: SeoMonitorItems[];
  view: { [key: string]: boolean }[];
  loading: boolean;
  pagination?: PagginationType;
  setPage: Function;
  setLimit: Function;
  permission?: PermissionItem;
  isAdmin?: boolean;
}

export function MonitorTables({
  selectedRowKeys,
  setSelectedRowKeys,
  data,
  view,
  loading,
  setPage,
  setLimit,
  pagination,
  permission,
  isAdmin,
}: MonitorTablesProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  const handleOpenModal = (data: any) => {
    setSelectedData(data);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedData(null);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<SeoMonitorItems> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

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
    {
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Flex className="items-center gap-2" justify="flex-end">
          {(isAdmin || permission?.view) && (
            <Button
              type="link"
              onClick={() => handleOpenModal(record)}
              icon={<ViewIcon />}
            />
          )}
          {(isAdmin || permission?.delete) && (
            <ConfirmDeleteModal
              title={t('indexing.delete.title')}
              question={t('indexing.delete.description')}
              message={t('indexing.delete.message')}
              action={async () => {
                try {
                  const { data } = await seoMonitorDelete(
                    QueryString.stringify({ id: record.id }),
                  );
                  if (data.data.success) {
                    dispatch(seoHttpsActions.deleteSeoMonitor([record.id]));
                  }
                  getMessage(data);
                } catch ({ response }) {
                  getMessage(response.data);
                }
              }}
            />
          )}
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
      {selectedData && (
        <MonitorModal
          modalTitle={
            t('indexing.modal.preview_data') + ':  ' + selectedData?.uri
          }
          open={openModal}
          onClose={handleCloseModal}
          dataModal={selectedData}
        />
      )}
    </div>
  );
}
