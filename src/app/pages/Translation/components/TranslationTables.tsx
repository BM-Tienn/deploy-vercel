import { Button, Pagination, Table, TableProps } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import React, { useState } from 'react';
import { TranslationItems } from '../slice/types';
import { FilterTypes, PagginationType, SortType } from 'utils/types/const';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import QueryString from 'qs';
import { useDispatch } from 'react-redux';
import { TRANSLATION_GET_LIST, translationActions } from '../slice';
import { EditModal } from 'app/components/EditModal';
import { FormInput } from 'app/components/FormInput';
import openNotificationWithIcon from 'app/functions/openNotificationWithIcon';
import { translationDelete, translationUpdate } from 'services/translation';

export interface TranslationTablesProps {
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: Function;
  data: TranslationItems[];
  view: { [key: string]: boolean }[];
  loading: boolean;
  pagination?: PagginationType;
  setPage: Function;
  setLimit: Function;
  sort: SortType;
  filterObj: FilterTypes;
}

export function TranslationTables({
  selectedRowKeys,
  setSelectedRowKeys,
  data,
  view,
  loading,
  setPage,
  setLimit,
  pagination,
  sort,
  filterObj,
}: TranslationTablesProps) {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<TranslationItems | null>(
    null,
  );

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<TranslationItems> = {
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
          width: '320px',
        };
      }),
    {
      title: '',
      width: '100px',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            type="text"
            className="h-8 w-8 p-0"
            onClick={() => handleEdit(record)}
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
            message={`By deleting this ${record.type}, you won’t be able to access the system`}
            action={async () => {
              const { data } = await translationDelete(
                QueryString.stringify({ key: record.key }),
              );
              if (data.data?.success) {
                dispatch(
                  TRANSLATION_GET_LIST({
                    params: {
                      page: pagination?.current || 1,
                      limit: pagination?.numItemsPerPage || 10,
                      order_by: sort?.type,
                      order: sort?.order,
                      ...filterObj,
                    },
                  }),
                );
                openNotificationWithIcon('success', '', data?.data?.message);
              } else {
                openNotificationWithIcon('error', '', data?.data?.message);
              }
            }}
          />
        </div>
      ),
    },
  ];

  const formItems = view
    .filter(field => Object.values(field)[0])
    .map(field => {
      const key = Object.keys(field)[0];
      return (
        <FormInput
          key={key}
          name={key}
          label={key.toUpperCase()}
          readOnly={key === 'key' ? true : false}
        />
      );
    });

  const handleEdit = (record: TranslationItems) => {
    setCurrentRecord(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentRecord(null);
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (Array.isArray(values[key])) {
          values[key].forEach(item => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, values[key]);
        }
      });

      const response = await translationUpdate(formData);

      if (response.data?.data?.success) {
        dispatch(
          translationActions.updateTranslation({
            data: values,
          }),
        );
        openNotificationWithIcon('success', '', response.data?.data?.message);
        setIsModalOpen(false);
      } else {
        openNotificationWithIcon('error', '', response.data?.data?.message);
      }
    } catch ({ response }: any) {
      openNotificationWithIcon(
        'error',
        '',
        response.data.errors
          ? response.data.errors?.key + ' ' + response.data.errors?.message
          : '',
      );
    }
  };

  return (
    <div className="flex flex-col justify-between flex-1 table-wrapper">
      <Table
        loading={loading}
        rowSelection={rowSelection}
        pagination={false}
        columns={columns}
        dataSource={data.map(item => ({ ...item }))}
        scroll={{ y: window.innerHeight - 269 }}
        rowKey={record => record.key}
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

      {currentRecord && (
        <EditModal
          open={isModalOpen}
          onClose={handleCancel}
          onSubmit={handleSubmit}
          modalTitle="Edit Translation"
          initValues={currentRecord}
          formItems={<>{formItems}</>}
        />
      )}
    </div>
  );
}
