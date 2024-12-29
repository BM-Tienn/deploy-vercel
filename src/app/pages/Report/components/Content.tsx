/* eslint-disable @typescript-eslint/no-unused-vars */
import { Flex, Form, Input, InputRef, List, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import QueryString from 'qs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { reportDetailList, reportListGet } from 'services/reportApi';
import { PagginationType, SortType, ViewType } from 'utils/types/const';
import { ReportTables } from './ReportTables';
import { ReportChart } from './ReportChart';

export interface ContentProps {}
export interface SidebarItem {
  id: string;
  name: string;
  niceName: string;
  iconClass: string;
  group: string;
  groupIconClass: string;
  menuShortcut: string;
  reportClass: string;
}

export function Content(props: ContentProps) {
  const [form] = useForm();
  const searchInputRef = useRef<InputRef>(null);
  const [siderbarLoading, setSidebarLoading] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>();
  const [sidebarData, setSibarData] = useState<SidebarItem[]>();
  const [exportName, setExportName] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [view, setView] = useState<ViewType[]>([{ key: true }]);
  const [sort, setSort] = useState<SortType>({
    type: '',
    order: 'asc',
  });
  const [dataTables, setDataTables] = useState<any[]>();
  const [pagination, setPagination] = useState<PagginationType>();
  const [column, setColumn] = useState<any[]>();

  const fetchData = useCallback(async (search?: string) => {
    setSidebarLoading(true);
    try {
      const { data } = await reportListGet(QueryString.stringify({ search }));
      if (data?.data) {
        setSibarData(data.data);
      }
    } catch ({ response }) {
      getMessage(response?.data);
    } finally {
      setSidebarLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isSearch) {
      fetchData();
    }
  }, [isSearch, fetchData]);

  const handleFinish = useCallback(
    async (values?: { search: string }) => {
      setIsSearch(true);
      fetchData(values?.search);
    },
    [fetchData],
  );

  useEffect(() => {
    (async () => {
      if (exportName) {
        try {
          const { data } = await reportDetailList(
            QueryString.stringify({
              type: 'table',
              id: exportName,
              page,
              limit,
              order_by: sort.type,
              order: sort.order,
            }),
          );
          if (data.data) {
            setDataTables(data.data?.data);
            setPagination(data.data?.paginationData);
            setColumn(data.data?.column);
          }
        } catch ({ response }) {
          getMessage(response?.data);
        } finally {
          setSidebarLoading(false);
        }
      }
    })();
  }, [exportName, limit, page, sort.order, sort.type]);

  const handleItemClick = useCallback(
    (id: string) => {
      if (exportName !== id) {
        setExportName(id);
      }
    },
    [exportName],
  );

  useEffect(() => {
    if (column) {
      setView(
        column.map((key, index) => {
          return { [key]: true };
        }),
      );
    }
  }, [column, exportName]);

  return (
    <Flex style={{ display: 'flex', width: '100%' }}>
      <div style={{ flex: '0 0 25%', maxWidth: '25%', padding: '10px' }}>
        <Form
          form={form}
          onValuesChange={value => {
            if (!value.search) setIsSearch(false);
            else handleFinish(value);
          }}
          onFinish={handleFinish}
          className="w-full p-6"
        >
          <Form.Item name="search" className="m-0">
            <Input ref={searchInputRef} placeholder="Search" />
          </Form.Item>
        </Form>
        {siderbarLoading && (
          <Flex align="center" justify="center">
            <Spin size="large" />
          </Flex>
        )}
        <List
          style={{ maxHeight: '750px', overflowY: 'auto' }}
          itemLayout="horizontal"
          dataSource={sidebarData}
          renderItem={item => (
            <List.Item
              onClick={() => handleItemClick(item.id)}
              style={{
                cursor: 'pointer',
                background: exportName === item.id ? '#f0f0f0' : 'transparent',
              }}
            >
              <List.Item.Meta
                title={item.niceName}
                description={`ID: ${item.id}`}
              />
            </List.Item>
          )}
        />
      </div>

      <div
        style={{
          flex: '0 0 75%',
          padding: '10px',
          overflow: 'auto',
          maxHeight: '100%',
        }}
      >
        {exportName && <ReportChart id={exportName} />}
        {view && dataTables && exportName && (
          <ReportTables
            data={dataTables}
            view={view}
            loading={loading}
            setPage={setPage}
            setLimit={setLimit}
          />
        )}
      </div>
    </Flex>
  );
}
