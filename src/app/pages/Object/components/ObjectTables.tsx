import { Button, Pagination, Table, TableProps } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import React from 'react';
import { ObjectItems } from '../slice/types';
import { renderConfig } from '../constant';
import { PagginationType } from 'utils/types/const';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import { Edit02Icon } from 'hugeicons-react';
import QueryString from 'qs';
import { useDispatch } from 'react-redux';
import { objectDeleteApi } from 'services/objectApi';
import { useNavigate, useParams } from 'react-router-dom';
import { objectDelete } from '../slice';
import { PermissionItem } from 'app/components/Permission/constant';
import { corepulseRoot } from 'app/routesConfig';
import { useTranslation } from 'react-i18next';

export interface ObjectTablesProps {
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: Function;
  data: ObjectItems[];
  view: { [key: string]: boolean }[];
  loading: boolean;
  pagination?: PagginationType;
  setPage: Function;
  setLimit: Function;
  fields: any;
  permission?: PermissionItem;
  isAdmin?: boolean;
}

export function ObjectTables({
  selectedRowKeys,
  setSelectedRowKeys,
  data,
  view,
  loading,
  setPage,
  setLimit,
  pagination,
  fields,
  permission,
  isAdmin,
}: ObjectTablesProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { object } = useParams();
  const navigate = useNavigate();
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<ObjectItems> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: TableProps<any>['columns'] = [
    ...view
      .filter(field => Object.values(field)[0])
      .map(field => {
        const key = Object.keys(field)[0];
        const definedField = fields[key];
        const columnView = {
          title: key.toUpperCase(),
          dataIndex: key,
          key: key,
          width: '320px',
          render: (_, record, index) =>
            renderConfig['default'](_, record[key], index),
        };
        const fieldtype = definedField?.fieldtype || 'default';
        if (fieldtype === 'system') {
          const subtype = definedField?.subtype;
          if (subtype === 'published') {
            columnView.render = (_, record, index) =>
              renderConfig['published'](_, record[key], index);
          } else if (subtype === 'key') {
            columnView.render = (_, record, index) =>
              renderConfig['system'](_, record[key], index, () => {
                if (isAdmin || permission?.view) {
                  navigate(`${corepulseRoot}/${object}/detail?id=${record.id}`);
                }
              });
          } else {
            columnView.render = (_, record, index) =>
              renderConfig['system'](_, record[key], index);
          }
        } else if (fieldtype in renderConfig) {
          columnView.render = (_, record, index) =>
            renderConfig[fieldtype](_, record[key], index);
        }

        return columnView;
      }),
    {
      key: 'action',
      width: '110px',
      fixed: 'right',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {(isAdmin || permission?.view) && (
            <Button
              onClick={() =>
                navigate(`${corepulseRoot}/${object}/detail?id=${record.id}`)
              }
              type="text"
              size="small"
              className="text-slate-400"
              icon={<Edit02Icon size={16} strokeWidth={2} />}
            />
          )}

          {(isAdmin || permission?.delete) && (
            <ConfirmDeleteModal
              title={t('object.delete.title')}
              question={t('object.delete.description')}
              message={t('object.delete.message')}
              action={async () => {
                const { data } = await objectDeleteApi(
                  QueryString.stringify({ classId: object, id: record.id }),
                );
                if (data) {
                  dispatch(objectDelete([record.id]));
                }
              }}
            />
          )}
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
