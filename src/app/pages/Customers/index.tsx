// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { CustomersWrapper } from './styled';
import { Helmet } from 'react-helmet-async';
import { Breadcrumb, Button, Flex } from 'antd';
import { CUSTOMER_GET_LIST, useCustomersSlice } from './slice';
import { ViewFilter } from 'app/components/ViewFIlter';
import { SortFilter } from 'app/components/SortFilter';
import { TypeFilter } from 'app/components/TypeFilter';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import QueryString from 'qs';
import { FilterObj, Sort } from 'app/slice/types';
import { HomeOutlined } from '@ant-design/icons';
import {
  customersList,
  customersLoading,
  customersPagination,
} from './slice/selector';
import { CustomerTables } from './components/CustomerTables';
import { customerDelete } from 'services/customerApi';

export interface CustomersProps {}

export function Customers(props: CustomersProps) {
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
  const { actions } = useCustomersSlice();
  const loading = useSelector(customersLoading);
  const pagination = useSelector(customersPagination);
  const data = useSelector(customersList);

  const handleItemClick = (id: number, title: JSX.Element | string) => {
    setBreadcrumbItems(prev => [...prev, { title, id }]);
    setParentId(id);
  };

  const handleBreadcrumbClick = (index: number, itemId: number) => {
    setBreadcrumbItems(prev => prev.slice(0, index + 1));
    setParentId(itemId);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      CUSTOMER_GET_LIST({
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
  }, [parentId, page, limit, sort, filterObj, dispatch]);

  return (
    <CustomersWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>Customer</title>
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
            <h1 className="font-bold text-[20px]">Customers</h1>
          </Flex>
        </Flex>
        {!!selectedRowKeys.length && (
          <div className="flex gap-6 items-center">
            <span>{selectedRowKeys.length} Selected</span>
            <ConfirmDeleteModal
              title={`Delete selected Customer?`}
              question={`Are you sure you want to delete all selected Customer?`}
              message={`This action cannot be undone.`}
              action={async () => {
                const { data } = await customerDelete(
                  QueryString.stringify({ id: selectedRowKeys }),
                );
                if (data) {
                  dispatch(actions.deleteCustomer(selectedRowKeys));
                  setSelectedRowKeys([]);
                }
              }}
              multiple
            />
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
                    { value: 'id', label: 'id' },
                    { value: 'key', label: 'Key' },
                    { value: 'type', label: 'type' },
                    { value: 'published', label: 'published' },
                    { value: 'modificationDate', label: 'modification date' },
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
                Export
              </Button>
            </div>
          </div>
          <CustomerTables
            handleItemClick={handleItemClick}
            setPage={setPage}
            setLimit={setLimit}
            pagination={pagination}
            view={view}
            loading={loading}
            data={data}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
          />
        </div>
      </div>
    </CustomersWrapper>
  );
}
