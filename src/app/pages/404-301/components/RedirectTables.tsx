import { Button, Flex, Pagination, Table, TableProps } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import React, { useState } from 'react';
import { SeoRedirectItems } from '../slice/types';
import { PagginationType } from 'utils/types/const';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import QueryString from 'qs';
import { useDispatch } from 'react-redux';
import { seoHttpsActions } from '../slice';
import { useTranslation } from 'react-i18next';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { PermissionItem } from 'app/components/Permission/constant';
import { Edit02Icon } from 'hugeicons-react';
import { seoRedirectDelete, seoRedirectUpdate } from 'services/seoHttpApi';
import { renderConfig } from 'app/pages/Object/constant';
import { EditModal } from 'app/components/EditModal';
import { FormInput } from 'app/components/FormInput';
import { FormSelect } from 'app/components/FormSelect';
import { FormCheckbox } from 'app/components/FormCheckbox';

export interface RedirectTablesProps {
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: Function;
  data: SeoRedirectItems[];
  view: { [key: string]: boolean }[];
  loading: boolean;
  pagination?: PagginationType;
  setPage: Function;
  setLimit: Function;
  permission?: PermissionItem;
  isAdmin?: boolean;
  typeOption?: any;
  redirectOption?: any;
}

export function RedirectTables({
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
  typeOption,
  redirectOption,
}: RedirectTablesProps) {
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

  const formItems = [
    <FormInput
      key="id"
      name="id"
      label={t('seo_http.modal.id_label')}
      readOnly
    />,
    <FormSelect
      key="type"
      name="type"
      label={t('seo_http.modal.type_label')}
      option={typeOption}
    />,
    <FormInput
      key="source"
      name="source"
      label={t('seo_http.modal.source_label')}
    />,
    <FormInput
      key="target"
      name="target"
      label={t('seo_http.modal.target_label')}
    />,
    <FormSelect
      key="statusCode"
      name="statusCode"
      label={t('seo_http.modal.status_code_label')}
      option={redirectOption}
    />,
    <FormCheckbox
      key="active"
      name="active"
      label={t('seo_http.modal.active_label')}
    />,
  ];

  const handleSubmit = async (values: any, formCallback) => {
    try {
      const formData = new FormData();
      ['type', 'source', 'target', 'id', 'active', 'statusCode'].forEach(
        field => {
          const value = formCallback.getFieldValue(field);
          if (field === 'active') {
            formData.append(field, value !== undefined ? value : '');
          } else if (value) {
            formData.append(field, value);
          }
        },
      );
      const { data } = await seoRedirectUpdate(formData);

      if (data?.data.success) {
        dispatch(seoHttpsActions.updateSeoRedirect(data?.data));
        setOpenModal(false);
      }

      getMessage(data);
    } catch ({ response }: any) {
      getMessage(response?.data);
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<SeoRedirectItems> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: TableProps<any>['columns'] = [
    ...view
      .filter(field => Object.values(field)[0])
      .map(field => {
        const key = Object.keys(field)[0];
        const columnView = {
          title: key.toUpperCase(),
          dataIndex: key,
          key: key,
          width: 200,
          render: (_, record, index) =>
            renderConfig['default'](_, record[key], index),
        };

        if (key === 'active') {
          columnView.render = (_, record, index) =>
            renderConfig['checkbox'](_, record[key], index);
        }

        return columnView;
      }),
    {
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Flex className="items-center gap-2" justify="flex-end">
          {(isAdmin || permission?.save) && (
            <Button
              type="link"
              onClick={() => handleOpenModal(record)}
              icon={<Edit02Icon />}
            />
          )}
          {(isAdmin || permission?.delete) && (
            <ConfirmDeleteModal
              title={t('indexing.delete.title')}
              question={t('indexing.delete.description')}
              message={t('indexing.delete.message')}
              action={async () => {
                try {
                  const { data } = await seoRedirectDelete(
                    QueryString.stringify({ id: record.id }),
                  );
                  if (data.data.success) {
                    dispatch(seoHttpsActions.deleteSeoRedirect([record.id]));
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
        <EditModal
          open={openModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          modalTitle="Edit Translation"
          initValues={selectedData}
          formItems={<>{formItems}</>}
        />
      )}
    </div>
  );
}
