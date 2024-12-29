import { Button } from 'antd';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import { SortFilter } from 'app/components/SortFilter';
import { TypeFilter } from 'app/components/TypeFilter';
import { ViewFilter } from 'app/components/ViewFIlter';
import { Sort, FilterObj } from 'app/slice/types';
import QueryString from 'qs';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSeoHttpsSlice, SEO_MONITOR_GET_LIST } from '../slice';
import {
  seoMonitorLoading,
  seoMonitorPagination,
  seoMonitorList,
} from '../slice/selector';
import { MonitorTables } from './MonitorTables';
import { useTranslation } from 'react-i18next';
import { PermissionItem } from 'app/components/Permission/constant';
import { permissionDefault } from 'app/components/Permission/components/LayoutTables';
import { seoMonitorDelete } from 'services/seoHttpApi';

export interface MonitorProps {
  permission?: PermissionItem;
  isAdmin?: boolean;
}

export function Monitor({
  permission = permissionDefault,
  isAdmin,
}: MonitorProps) {
  const { t } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [view, setView] = useState<{ [key: string]: boolean }[]>([
    { id: true },
    { code: true },
    { count: true },
    { date: false },
    { uri: true },
  ]);
  const [sort, setSort] = useState<Sort>({
    type: '',
    order: 'desc',
  });
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [filterObj, setFilterObj] = useState<FilterObj>({
    filterRule: 'and',
    filter: [],
  });
  const { actions } = useSeoHttpsSlice();
  const loading = useSelector(seoMonitorLoading);
  const pagination = useSelector(seoMonitorPagination);
  const data = useSelector(seoMonitorList);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      SEO_MONITOR_GET_LIST({
        params: {
          page,
          limit,
          order_by: sort.type,
          order: sort.order,
          ...filterObj,
        },
      }),
    );
  }, [page, limit, sort, filterObj, dispatch]);

  return (
    <div className="h-[calc(100%-60px)] px-6 pb-6">
      {!!selectedRowKeys.length && (
        <div className="flex gap-6 items-center">
          <span>
            {selectedRowKeys.length} {t('seo_http.selected')}
          </span>
          {(isAdmin || permission?.delete) && (
            <ConfirmDeleteModal
              title={t('seo_http.delete.title')}
              question={t('seo_http.delete.description')}
              message={t('seo_http.delete.message')}
              action={async () => {
                const { data } = await seoMonitorDelete(
                  QueryString.stringify({ id: selectedRowKeys }),
                );
                if (data) {
                  dispatch(actions.deleteSeoRedirect(selectedRowKeys));
                  setSelectedRowKeys([]);
                }
              }}
              multiple
            />
          )}
        </div>
      )}
      {(isAdmin || permission?.listing) && (
        <div className="h-full flex flex-col p-4 rounded-[20px] gap-3 shadow-[0px_0px_2px_0px_rgba(145,158,171,0.25),0px_10px_40px_-4px_rgba(145,158,171,0.15)]">
          <div className="h-9 flex justify-between items-center">
            <div className="flex gap-3 items-center"></div>
            <div className="flex gap-4 items-center">
              <div className="h-full gap-1 flex items-center">
                <ViewFilter list={view} setList={setView} />
                <SortFilter
                  types={[
                    { value: 'id', label: 'id' },
                    { value: 'code', label: 'code' },
                    { value: 'count', label: 'count' },
                    { value: 'date', label: 'date' },
                    { value: 'uri', label: 'uri' },
                  ]}
                  sort={sort}
                  setSort={setSort}
                />
                <TypeFilter
                  types={{
                    id: 'number',
                    uri: 'string',
                  }}
                  filterObj={filterObj}
                  setFilterObj={setFilterObj}
                />
              </div>
              <Button className="flex items-center gap-[10px] px-[10px] h-[32px] rounded-[8px]">
                <i className="fa-solid fa-download"></i>
                {t('seo_http.title_data.export')}
              </Button>
            </div>
          </div>
          <MonitorTables
            setPage={setPage}
            setLimit={setLimit}
            pagination={pagination}
            view={view}
            loading={loading}
            data={data}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            permission={permission}
            isAdmin
          />
        </div>
      )}
    </div>
  );
}
