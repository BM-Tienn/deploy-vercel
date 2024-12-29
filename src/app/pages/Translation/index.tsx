import React, { useState, useEffect } from 'react';
import { TranslationWrapper } from './styled';
import { Helmet } from 'react-helmet-async';
import { Button, Flex, Space } from 'antd';
import { TranslationTables } from './components/TranslationTables';
import { TRANSLATION_GET_LIST, useTranslationSlice } from './slice';
import { ViewFilter } from 'app/components/ViewFIlter';
import { SortFilter } from 'app/components/SortFilter';
import { TypeFilter } from 'app/components/TypeFilter';
import { useDispatch, useSelector } from 'react-redux';
import {
  translationLoading,
  translationPagination,
  translationList,
  translationColumn,
} from './slice/selector';
import { ColumnType, FilterTypes, SortType, ViewType } from 'utils/types/const';
import QueryString from 'qs';
import { FileDownloadIcon } from 'hugeicons-react';
import { CreateModal } from 'app/components/CreateModal';
import openNotificationWithIcon from 'app/functions/openNotificationWithIcon';
import { FormInput } from 'app/components/FormInput';
import { translationCreate, translationDelete } from 'services/translation';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';

export interface TranslationProps {}

export function Translation(props: TranslationProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [view, setView] = useState<ViewType[]>([{ key: true }]);
  const [sort, setSort] = useState<SortType>({
    type: '',
    order: 'asc',
  });
  const [filterObj, setFilterObj] = useState<FilterTypes>({
    filterRule: 'and',
    filter: [],
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { actions } = useTranslationSlice();
  const loading = useSelector(translationLoading);
  const pagination = useSelector(translationPagination);
  const data = useSelector(translationList);
  const column = useSelector(translationColumn);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [columnTypes, setColumnTypes] = useState<ColumnType>({
    sortType: [
      {
        label: 'Key',
        value: 'key',
      },
      {
        label: 'Creation Date',
        value: 'creationDate',
      },
      {
        label: 'modification Date',
        value: 'modificationDate',
      },
    ],
    filterType: {
      key: 'string',
    },
  });

  const [open, setOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  const handleSubmit = async (values, form) => {
    setLoadingModal(true);
    try {
      const { data } = await translationCreate(QueryString.stringify(values));

      form.resetFields();
      openNotificationWithIcon(
        data?.data?.success ? 'success' : 'error',
        '',
        data?.data?.message,
      );

      setOpen(false);
      dispatch(
        TRANSLATION_GET_LIST({
          params: {
            page,
            limit,
            order_by: 'creationDate',
            order: 'desc',
            ...filterObj,
          },
        }),
      );
    } catch ({ response }: any) {
      openNotificationWithIcon(
        'error',
        '',
        response.data.error
          ? (response.data.error?.key ? response.data.error?.key + ' ' : '') +
              response.data.error?.message
          : '',
      );
    } finally {
      setLoadingModal(false);
    }
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      TRANSLATION_GET_LIST({
        params: {
          page,
          limit,
          order_by: sort.type,
          order: sort.order,
          ...filterObj,
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, sort, filterObj.filterRule, filterObj.filter]);

  useEffect(() => {
    setView(
      column.map((key, index) => {
        return { [key]: true };
      }),
    );
  }, [column]);

  return (
    <TranslationWrapper className="flex bg-[#ffffff] flex-col w-5/6">
      <Helmet>
        <title>Translation</title>
      </Helmet>
      <Flex vertical className="flex-1 overflow-hidden">
        <Flex justify="between" align="center" className="px-5 py-3">
          <Space size={16}>
            <span className="font-semibold text-xl">Translation</span>
            <Button
              type="primary"
              onClick={() => setOpen(true)}
              icon={<i className="far fa-plus" />}
            >
              Create
            </Button>
            <CreateModal
              modalTitle="Create New Translation"
              open={open}
              onClose={() => setOpen(false)}
              onSubmit={handleSubmit}
              loading={loadingModal}
              formItems={
                <>
                  <FormInput
                    required
                    rules={[{ required: true, message: 'Vui lòng nhập key!' }]}
                    name="key"
                    label="Key"
                  />
                </>
              }
            />
          </Space>
        </Flex>
        <Flex vertical className="flex-1 px-5 pb-4">
          <Flex
            vertical
            gap={16}
            className="h-full w-full p-4 rounded-[12px] shadow-[0px_0px_2px_0px_rgba(145,158,171,0.25),0px_10px_40px_-4px_rgba(145,158,171,0.15)]"
          >
            {!!selectedRowKeys.length && (
              <div className="flex gap-6 items-center">
                <span>{selectedRowKeys.length} Selected</span>
                <ConfirmDeleteModal
                  title={`Delete selected pages?`}
                  question={`Are you sure you want to delete all slected pages?`}
                  message={`By deleting  this them, you won’t be able to access the system`}
                  action={async () => {
                    const { data } = await translationDelete(
                      QueryString.stringify({ key: selectedRowKeys }),
                    );

                    if (data?.data?.success) {
                      setSelectedRowKeys([]);
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
                    }

                    openNotificationWithIcon(
                      data?.data?.success ? 'success' : 'error',
                      '',
                      data?.data?.message,
                    );
                  }}
                  multiple
                />
              </div>
            )}
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
                  Export
                </Button>
              </Space>
            </Flex>
            <TranslationTables
              setPage={setPage}
              setLimit={setLimit}
              pagination={pagination}
              view={view}
              loading={loading}
              data={data}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
              sort={sort}
              filterObj={filterObj}
            />
          </Flex>
        </Flex>
      </Flex>
    </TranslationWrapper>
  );
}
