import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button, Space, Flex } from 'antd';
import { ObjectTables } from './components/ObjectTables';
import { ViewFilter } from 'app/components/ViewFIlter';
import { SortFilter } from 'app/components/SortFilter';
import { TypeFilter } from 'app/components/TypeFilter';
import { useDispatch, useSelector } from 'react-redux';
import QueryString from 'qs';
import { ObjectWrapper } from './styled';
import { useParams } from 'react-router-dom';
import { OBJECT_GET_LIST, useObjectSlice } from './slice';
import { objectList, objectLoading, objectPagination } from './slice/selector';
import { getColumnList, objectDeleteApi } from 'services/objectApi';
import { ColumnType } from 'utils/types/const';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { CreateModal } from './components/CreateModal';
import { FileDownloadIcon } from 'hugeicons-react';
import { FilterObj, Sort } from 'app/slice/types';
import { useTranslation } from 'react-i18next';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import { PermissionItem } from 'app/components/Permission/constant';
import { permissionDefault } from 'app/components/Permission/components/LayoutTables';
import { filterPermission } from 'app/functions/hasPermission';
import {
  globalClasses,
  globalIsAdmin,
  globalPermissionData,
} from 'app/slice/selector';

export interface ObjectPageProps {}

export function ObjectPage(props: ObjectPageProps) {
  const { actions } = useObjectSlice();
  const { t } = useTranslation();
  const [columnTypes, setColumnTypes] = useState<ColumnType>({
    sortType: [],
    filterType: {},
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [view, setView] = useState<
    {
      [key: string]: boolean;
    }[]
  >([]);
  const [sort, setSort] = useState<Sort>({
    type: '',
    order: 'asc',
  });
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [filterObj, setFilterObj] = useState<FilterObj>({
    filterRule: 'and',
    filter: [],
  });
  const loading = useSelector(objectLoading);
  const pagination = useSelector(objectPagination);
  const data = useSelector(objectList);
  const classes = useSelector(globalClasses);
  const dispatch = useDispatch();
  const { object } = useParams();
  const [objectName, setObjectName] = useState<string | undefined>(object);
  const [columns, setColumns] = useState<string | undefined>(object);
  const [permission, setPermission] =
    useState<PermissionItem>(permissionDefault);
  const permissionData = useSelector(globalPermissionData);
  const isAdmin = useSelector(globalIsAdmin);

  useEffect(() => {
    const permissionItem = filterPermission(permissionData, 'objects', object);

    if (permissionItem) setPermission(permissionItem);
  }, [object, permissionData]);

  useEffect(() => {
    if (isAdmin || permission?.listing) {
      if (classes) {
        const objectName = classes.find(item => item.id === object);
        if (objectName) {
          setObjectName(objectName.title || objectName.name);
        }
      }
      (async () => {
        try {
          const { data } = await getColumnList(
            QueryString.stringify({ id: object }),
          );
          if (data) {
            const columns = data.data.columns;
            setColumns(columns);
            const keysList = Object.keys(columns);
            const nameIndex = keysList.findIndex(key => key === 'key');
            if (nameIndex !== -1) {
              const name = keysList.splice(nameIndex, 1);
              keysList.splice(1, 0, ...name);
            }

            setView(
              keysList.map((key, index) => {
                if (index < 6) {
                  return { [key]: true };
                }
                return { [key]: false };
              }),
            );
            const sortType = keysList.map(key => {
              return {
                value: key,
                label: columns[key].title,
              };
            });
            const filterType = {};
            keysList.forEach(key => {
              filterType[key] = columns[key].type;
            });

            setColumnTypes({ sortType, filterType });
          }
        } catch ({ response }: any) {
          getMessage(response);
        }
      })();
    }
  }, [classes, isAdmin, object, permission?.listing]);

  useEffect(() => {
    if (isAdmin || permission?.listing) {
      dispatch(
        OBJECT_GET_LIST({
          params: {
            id: object,
            page,
            limit,
            order_by: sort.type,
            order: sort.order,
            ...filterObj,
          },
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    limit,
    sort,
    filterObj.filterRule,
    filterObj.filter,
    object,
    permission?.listing,
    isAdmin,
  ]);

  return (
    <ObjectWrapper className="flex flex-1 bg-[#ffffff] flex-col overflow-hidden">
      <Helmet>
        <title>{objectName}</title>
      </Helmet>
      <Flex vertical className="flex-1 overflow-hidden">
        <Flex justify="between" align="center" className="px-5 py-3">
          <Space size={16}>
            <span className="font-semibold text-xl">{objectName}</span>
            {(isAdmin || permission?.create) && (
              <CreateModal
                type={object}
                modalTitle={t('object.new') + ': ' + objectName}
              >
                <Button type="primary" icon={<i className="far fa-plus" />}>
                  {t('object.title')}
                </Button>
              </CreateModal>
            )}
          </Space>
          {!!selectedRowKeys.length && (
            <div className="flex gap-6 items-center">
              <span>
                {selectedRowKeys.length}
                {t('object.selected')}
              </span>
              {(isAdmin || permission?.delete) && (
                <ConfirmDeleteModal
                  title={t('object.delete.title')}
                  question={t('object.delete.description')}
                  message={t('object.delete.message')}
                  action={async () => {
                    const { data } = await objectDeleteApi(
                      QueryString.stringify({ id: selectedRowKeys }),
                    );
                    if (data) {
                      dispatch(actions.objectDelete(selectedRowKeys));
                      setSelectedRowKeys([]);
                    }
                  }}
                  multiple
                />
              )}
            </div>
          )}
        </Flex>
        <Flex vertical className="flex-1 px-5 pb-4">
          <Flex
            vertical
            gap={16}
            className="h-full w-full p-4 rounded-[12px] shadow-[0px_0px_2px_0px_rgba(145,158,171,0.25),0px_10px_40px_-4px_rgba(145,158,171,0.15)]"
          >
            <Flex justify="end" align="center">
              <Space size={16} align="center">
                <Space size={4} align="center">
                  <ViewFilter list={view} setList={setView} />
                  <SortFilter
                    types={columnTypes.sortType}
                    sort={sort}
                    setSort={setSort}
                  />
                  <TypeFilter
                    types={columnTypes.filterType}
                    filterObj={filterObj}
                    setFilterObj={setFilterObj}
                  />
                </Space>
                <Button icon={<FileDownloadIcon size={16} strokeWidth={2} />}>
                  {t('object.export')}
                </Button>
              </Space>
            </Flex>
            <ObjectTables
              setPage={setPage}
              setLimit={setLimit}
              pagination={pagination}
              view={view}
              fields={columns}
              loading={loading}
              data={data}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
              permission={permission}
              isAdmin={isAdmin}
            />
          </Flex>
        </Flex>
      </Flex>
    </ObjectWrapper>
  );
}
