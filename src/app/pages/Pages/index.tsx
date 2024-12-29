import React, { useState, useEffect, useCallback } from 'react';
import { PageWrapper } from './styled';
import { Helmet } from 'react-helmet-async';
import { Breadcrumb, Button, Flex } from 'antd';
import { PageTables } from './components/PageTables';
import { PAGES_GET_LIST, usePagesSlice } from './slice';
import { ViewFilter } from 'app/components/ViewFIlter';
import { SortFilter } from 'app/components/SortFilter';
import { TypeFilter } from 'app/components/TypeFilter';
import { useDispatch, useSelector } from 'react-redux';
import { pagesList, pagesLoading, pagesPagination } from './slice/selector';
import { CreatePopover } from './components/CreatePopover';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import { pageDelete } from 'services/pagesApi';
import QueryString from 'qs';
import { FilterObj, Sort } from 'app/slice/types';
import { HomeOutlined } from '@ant-design/icons';
import { PermissionItem } from 'app/components/Permission/constant';
import { permissionDefault } from 'app/components/Permission/components/LayoutTables';
import { globalIsAdmin, globalPermissionData } from 'app/slice/selector';
import { filterPermission } from 'app/functions/hasPermission';
import { useTranslation } from 'react-i18next';
import { getMessage } from 'app/functions/openNotificationWithIcon';

export interface PagesProps {}

export function Pages(props: PagesProps) {
  const { t } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [view, setView] = useState<{ [key: string]: boolean }[]>([
    { id: true },
    { key: true },
    { type: true },
    { published: true },
    { modificationDate: true },
  ]);
  const [sort, setSort] = useState<Sort>({
    type: '',
    order: 'desc',
  });
  const [breadcrumbItems, setBreadcrumbItems] = useState<
    { title: JSX.Element | string; id: number }[]
  >([{ title: <HomeOutlined />, id: 0 }]);
  const [parentId, setParentId] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [filterObj, setFilterObj] = useState<FilterObj>({
    filterRule: 'and',
    filter: [],
  });
  const { actions } = usePagesSlice();
  const loading = useSelector(pagesLoading);
  const pagination = useSelector(pagesPagination);
  const data = useSelector(pagesList);
  const [permission, setPermission] =
    useState<PermissionItem>(permissionDefault);
  const permissionData = useSelector(globalPermissionData);
  const isAdmin = useSelector(globalIsAdmin);

  const handleItemClick = (id: number, title: JSX.Element | string) => {
    setBreadcrumbItems(prev => [...prev, { title, id }]);
    setParentId(id);
  };

  const fetchPermission = useCallback(() => {
    const permissionItem = filterPermission(
      permissionData,
      'documents',
      parentId === 0 ? 1 : parentId,
    );
    if (permissionItem) setPermission(permissionItem);
  }, [parentId, permissionData]);

  useEffect(() => {
    fetchPermission();
  }, [fetchPermission]);

  const handleBreadcrumbClick = (index: number, itemId: number) => {
    setBreadcrumbItems(prev => prev.slice(0, index + 1));
    setParentId(itemId);
  };

  const dispatch = useDispatch();
  const fetchPagesList = useCallback(() => {
    if (isAdmin || permission?.listing) {
      dispatch(
        PAGES_GET_LIST({
          params: {
            parentId,
            page,
            limit,
            order_by: sort.type,
            order: sort.order,
            ...filterObj,
          },
        }),
      );
    }
  }, [
    parentId,
    page,
    limit,
    sort,
    filterObj,
    dispatch,
    isAdmin,
    permission?.listing,
  ]);

  useEffect(() => {
    fetchPagesList();
  }, [fetchPagesList]);

  const handleDelete = async () => {
    for (const id of selectedRowKeys) {
      try {
        const { data } = await pageDelete(QueryString.stringify({ id }));
        if (data) {
          dispatch(actions.deletePages([id]));
        }
        getMessage(data);
      } catch ({ response }) {
        getMessage(response);
      }
    }
    setSelectedRowKeys([]);
  };

  return (
    <PageWrapper className="flex bg-[#ffffff] flex-col w-5/6">
      <Helmet>
        <title>{t('pages.title')}</title>
      </Helmet>
      <div className="px-5 py-3 flex justify-between items-center">
        <Flex className="gap-6">
          <Flex vertical>
            <Breadcrumb
              items={breadcrumbItems.map((item, index) => ({
                title: (
                  <span onClick={() => handleBreadcrumbClick(index, item.id)}>
                    {item.title}
                  </span>
                ),
              }))}
            />
            <h1 className="font-bold text-[20px]">{t('pages.title')}</h1>
          </Flex>
          {(isAdmin || permission?.create) && (
            <CreatePopover parentId={parentId} />
          )}
        </Flex>
        {!!selectedRowKeys.length && (
          <div className="flex gap-6 items-center">
            <span>
              {selectedRowKeys.length} {t('pages.selected')}
            </span>
            {(isAdmin || permission?.delete) && (
              <ConfirmDeleteModal
                title={t('pages.delete.title')}
                question={t('pages.delete.description')}
                message={t('pages.delete.message')}
                action={handleDelete}
                multiple
              />
            )}
          </div>
        )}
      </div>
      <div className="h-[calc(100%-60px)] px-6 pb-6">
        <div className="h-full w-full flex flex-col p-4 rounded-[20px] gap-3 shadow-[0px_0px_2px_0px_rgba(145,158,171,0.25),0px_10px_40px_-4px_rgba(145,158,171,0.15)]">
          <div className="h-9 flex justify-between items-center">
            <div className="flex gap-3 items-center"></div>
            <div className="flex gap-4 items-center">
              <div className="h-full gap-1 flex items-center">
                <ViewFilter list={view} setList={setView} />
                <SortFilter
                  types={[
                    { value: 'id', label: t('pages.id') },
                    { value: 'key', label: t('pages.key') },
                    { value: 'type', label: t('pages.type') },
                    { value: 'published', label: t('pages.publish') },
                    {
                      value: 'modificationDate',
                      label: t('pages.modification_date'),
                    },
                  ]}
                  sort={sort}
                  setSort={setSort}
                />
                <TypeFilter
                  types={{
                    id: 'number',
                    key: 'string',
                    type: 'string',
                    published: 'boolean',
                    modificationDate: 'date',
                  }}
                  filterObj={filterObj}
                  setFilterObj={setFilterObj}
                />
              </div>
              <Button className="flex items-center gap-[10px] px-[10px] h-[32px] rounded-[8px]">
                <i className="fa-solid fa-download"></i>
                {t('pages.export')}
              </Button>
            </div>
          </div>
          <PageTables
            handleItemClick={handleItemClick}
            setPage={setPage}
            setLimit={setLimit}
            pagination={pagination}
            view={view}
            loading={loading}
            data={data}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
