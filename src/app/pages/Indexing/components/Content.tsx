import { Button, Flex } from 'antd';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import { SortFilter } from 'app/components/SortFilter';
import { TypeFilter } from 'app/components/TypeFilter';
import { ViewFilter } from 'app/components/ViewFIlter';
import { Sort, FilterObj } from 'app/slice/types';
import QueryString from 'qs';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { indexingCreate, indexingDelete } from 'services/indexingApi';
import {
  useIndexingsSlice,
  INDEXING_GET_LIST,
  indexingsActions,
} from '../slice';
import {
  indexingsLoading,
  indexingsPagination,
  indexingsList,
} from '../slice/selector';
import { IndexingTables } from './IndexingTables';
import { useTranslation } from 'react-i18next';
import { PermissionItem } from 'app/components/Permission/constant';
import { permissionDefault } from 'app/components/Permission/components/LayoutTables';
import { CreateModal } from 'app/components/CreateModal';
import { FormInput } from 'app/components/FormInput';
import { getMessage } from 'app/functions/openNotificationWithIcon';

export interface ContentProps {
  permission?: PermissionItem;
  isAdmin?: boolean;
}

export function Content({
  permission = permissionDefault,
  isAdmin,
}: ContentProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isForm, setIsForm] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [view, setView] = useState<{ [key: string]: boolean }[]>([
    { id: true },
    { url: true },
    { time: false },
    { type: true },
    { response: false },
    { createAt: true },
    { updateAt: false },
    // { internalType: false },
    // { internalValue: false },
    { coverageState: false },
    { crawledAs: false },
    { indexingState: false },
    { pageFetchState: false },
    { robotsTxtState: false },
    { userCanonical: false },
    { verdict: false },
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
  const { actions } = useIndexingsSlice();
  const loading = useSelector(indexingsLoading);
  const pagination = useSelector(indexingsPagination);
  const data = useSelector(indexingsList);

  const createHandler = async (value, form) => {
    try {
      const formData = new FormData();
      formData.append('url', form.getFieldValue('url'));

      const { data } = await indexingCreate(formData);
      if (data) {
        getMessage(data);
        if (data.data?.success) {
          dispatch(indexingsActions.createIndexing(data.data));
        }
        setOpen(false);
        setIsForm(false);
        setTimeout(() => {
          setIsForm(true);
        }, 300);
      }
    } catch ({ response }: any) {
      getMessage(response?.data);
    }
  };

  const handleItem = (id: number) => {
    console.log(id);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      INDEXING_GET_LIST({
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
      <Flex className="gap-6">
        <Flex vertical>
          {(isAdmin || permission?.create) && (
            <Button
              type="primary"
              onClick={() => setOpen(true)}
              icon={<i className="far fa-plus" />}
            >
              {t('indexing.create')}
            </Button>
          )}

          {(isAdmin || permission?.create) && isForm && (
            <CreateModal
              modalTitle={t('indexing.modal.create_title')}
              open={open}
              onClose={() => {
                setOpen(false);
              }}
              onSubmit={createHandler}
              formItems={
                <>
                  <FormInput
                    required
                    name="url"
                    label={t('indexing.modal.url_label')}
                  />
                </>
              }
            />
          )}
        </Flex>
      </Flex>

      {!!selectedRowKeys.length && (
        <div className="flex gap-6 items-center">
          <span>
            {selectedRowKeys.length} {t('indexing.selected')}
          </span>
          {(isAdmin || permission?.delete) && (
            <ConfirmDeleteModal
              title={t('indexing.delete.title')}
              question={t('indexing.delete.description')}
              message={t('indexing.delete.message')}
              action={async () => {
                const { data } = await indexingDelete(
                  QueryString.stringify({ id: selectedRowKeys }),
                );
                if (data) {
                  dispatch(actions.deleteIndexing(selectedRowKeys));
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
                    { value: 'type', label: 'type' },
                    { value: 'url', label: 'url' },
                    { value: 'createAt', label: 'createAt' },
                    { value: 'updateAt', label: 'updateAt' },
                  ]}
                  sort={sort}
                  setSort={setSort}
                />
                <TypeFilter
                  types={{
                    id: 'number',
                    url: 'string',
                    type: 'string',
                  }}
                  filterObj={filterObj}
                  setFilterObj={setFilterObj}
                />
              </div>
              <Button className="flex items-center gap-[10px] px-[10px] h-[32px] rounded-[8px]">
                <i className="fa-solid fa-download"></i>
                {t('indexing.title_data.export')}
              </Button>
            </div>
          </div>
          <IndexingTables
            handleItemClick={handleItem}
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
