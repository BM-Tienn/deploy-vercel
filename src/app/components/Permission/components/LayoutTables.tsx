import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Select, Table, TableProps } from 'antd';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import { PermissionItem } from 'app/components/Permission/constant';
import { useSelector } from 'react-redux';
import {
  permissionsAssetsConfig,
  permissionsDocumentsConfig,
  permissionsObjectsConfig,
  permissionsOthersConfig,
} from '../slice/selector';
import { ItemProps } from 'app/components/FormSelect';

export interface LayoutTablesProps {
  loading?: boolean;
  data: any[];
  callback: Function;
  type?: 'documents' | 'assets' | 'objects' | 'others';
}

export interface OptionsData {
  others: ItemProps[];
  documents: ItemProps[];
  objects: ItemProps[];
  assets: ItemProps[];
}

export const permissionDefault = {
  path: '',
  listing: false,
  view: false,
  save: false,
  publish: false,
  unpublish: false,
  delete: false,
  rename: false,
  create: false,
  setting: false,
  versions: false,
};

export function LayoutTables({
  loading,
  data,
  callback,
  type = 'documents',
}: LayoutTablesProps) {
  const [tableData, setTableData] = useState<PermissionItem[]>([]);
  const others = useSelector(permissionsOthersConfig);
  const documents = useSelector(permissionsDocumentsConfig);
  const assets = useSelector(permissionsAssetsConfig);
  const objects = useSelector(permissionsObjectsConfig);

  const optionsData: OptionsData = {
    others,
    documents,
    objects,
    assets,
  };

  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

  const handleEdit = (value: any, key: string, index: number) => {
    const newData = tableData.map((item, idx) =>
      idx === index
        ? {
            ...item,
            [key]: value,
          }
        : item,
    );
    setTableData(newData);
    callback(newData);
  };

  const createHandle = () => {
    const newItem = {
      id: tableData.length + 1,
      ...permissionDefault,
    };

    const newData = [newItem, ...tableData];
    setTableData(newData);
    callback(newData);
  };

  const getFilteredOptions = (type: string) => {
    const usedPaths = tableData.map(item => item.path);
    const options = optionsData[type] || [];

    return options.map(option => ({
      label: option.label,
      value: option.value,
      disabled: usedPaths.includes(option.value),
    }));
  };

  const columns: TableProps<any>['columns'] = [];

  Object.keys(permissionDefault).forEach(field => {
    if (
      type === 'others' &&
      (field === 'versions' ||
        field === 'publish' ||
        field === 'rename' ||
        field === 'unpublish')
    ) {
      return;
    }
    columns.push({
      title: field.toUpperCase(),
      dataIndex: field,
      key: field,
      render: (value: any, record: any, index: number) => {
        if (typeof record[field] === 'boolean') {
          return (
            <Checkbox
              checked={value}
              onChange={e => handleEdit(e.target.checked, field, index)}
            />
          );
        }

        const options = getFilteredOptions(type);
        return (
          <Select
            style={{ width: 200 }}
            value={value}
            onChange={e => handleEdit(e, field, index)}
            options={options}
          />
        );
      },
      onCell: () => ({
        style: {
          minWidth: '110px',
        },
      }),
    });
  });

  columns.push({
    key: 'action',
    title: 'Action',
    width: '100px',
    render: (_, record, index) => (
      <Flex className="items-center gap-2" justify="flex-end">
        <ConfirmDeleteModal
          title={`Delete ${record.path}?`}
          question={`Are you sure you want to delete ${record.path}?`}
          message={`This action cannot be undone.`}
          action={async () => {
            const newData = tableData.filter((_, i) => i !== index);
            setTableData(newData);
            callback(newData);
          }}
        />
      </Flex>
    ),
  });

  return (
    <>
      <Button onClick={createHandle} type="primary">
        Add permission
      </Button>
      <div className="flex flex-col justify-between flex-1 table-wrapper">
        {columns && (
          <Table
            loading={loading}
            pagination={false}
            columns={columns}
            dataSource={tableData}
            scroll={{ x: 'max-content', y: window.innerHeight - 269 }}
            rowKey={record => record.id}
          />
        )}
      </div>
    </>
  );
}
