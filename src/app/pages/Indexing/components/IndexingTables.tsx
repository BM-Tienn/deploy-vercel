import { Button, Flex, Pagination, Table, TableProps, Tooltip } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import React, { useState } from 'react';
import { IndexingItems } from '../slice/types';
import { PagginationType } from 'utils/types/const';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import QueryString from 'qs';
import { useDispatch } from 'react-redux';
import { indexingDelete, indexingSubmitTypeApi } from 'services/indexingApi';
import { indexingsActions } from '../slice';
import { useTranslation } from 'react-i18next';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { IssuesCloseOutlined, StopOutlined } from '@ant-design/icons';
import { PermissionItem } from 'app/components/Permission/constant';
import { ResultModal } from './ResultModal';
import { ViewIcon } from 'hugeicons-react';

export interface IndexingTablesProps {
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: Function;
  data: IndexingItems[];
  view: { [key: string]: boolean }[];
  loading: boolean;
  pagination?: PagginationType;
  setPage: Function;
  setLimit: Function;
  handleItemClick: Function;
  permission?: PermissionItem;
  isAdmin?: boolean;
}

export function IndexingTables({
  selectedRowKeys,
  setSelectedRowKeys,
  data,
  view,
  loading,
  setPage,
  setLimit,
  pagination,
  handleItemClick,
  permission,
  isAdmin,
}: IndexingTablesProps) {
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

  const rowSelection: TableRowSelection<IndexingItems> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleItemSubmit = (type: string, id: number) => async () => {
    try {
      const formData = new FormData();
      formData.append('id', id.toString());
      formData.append('type', type);
      const { data } = await indexingSubmitTypeApi(formData);
      if (data) {
        getMessage(data);
      }
    } catch ({ response }) {
      getMessage(response.data);
    }
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
          {(isAdmin || permission?.save) && (
            <>
              <Tooltip
                title={t('indexing.title_data.update_submit')}
                color={'#2db7f5'}
                key={'#2db7f5'}
              >
                <Button
                  onClick={handleItemSubmit('update-submit', record.id)}
                  type="text"
                  className="h-8 w-8 p-0"
                >
                  <IssuesCloseOutlined />
                </Button>
              </Tooltip>
              <Tooltip
                title={t('indexing.title_data.delete_submit')}
                color={'orange'}
                key={'orange'}
              >
                <Button
                  onClick={handleItemSubmit('delete-submit', record.id)}
                  type="text"
                  className="h-8 w-8 p-0"
                >
                  <StopOutlined />
                </Button>
              </Tooltip>
            </>
          )}
          {(isAdmin || permission?.delete) && (
            <ConfirmDeleteModal
              title={t('indexing.delete.title')}
              question={t('indexing.delete.description')}
              message={t('indexing.delete.message')}
              action={async () => {
                try {
                  const { data } = await indexingDelete(
                    QueryString.stringify({ id: record.id }),
                  );
                  if (data.data.success) {
                    dispatch(indexingsActions.deleteIndexing([record.id]));
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
        <ResultModal
          modalTitle={t('indexing.modal.edit_title') + selectedData?.id}
          open={openModal}
          onClose={handleCloseModal}
          dataModal={selectedData}
        />
      )}
    </div>
  );
}
