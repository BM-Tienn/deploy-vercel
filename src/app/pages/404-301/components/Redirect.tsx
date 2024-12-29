/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Flex } from 'antd';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import { SortFilter } from 'app/components/SortFilter';
import { TypeFilter } from 'app/components/TypeFilter';
import { ViewFilter } from 'app/components/ViewFIlter';
import { Sort, FilterObj } from 'app/slice/types';
import QueryString from 'qs';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSeoHttpsSlice, SEO_REDIRECT_GET_LIST } from '../slice';
import {
  seoRedirectLoading,
  seoRedirectPagination,
  seoRedirectList,
} from '../slice/selector';
import { RedirectTables } from './RedirectTables';
import { useTranslation } from 'react-i18next';
import { PermissionItem } from 'app/components/Permission/constant';
import { permissionDefault } from 'app/components/Permission/components/LayoutTables';
import {
  seoRedirectCreate,
  seoRedirectDelete,
  seoRedirectOption,
  seoRedirectTypeOption,
} from 'services/seoHttpApi';
import { CreateModal } from 'app/components/CreateModal';
import { FormInput } from 'app/components/FormInput';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { FormSelect } from 'app/components/FormSelect';

export interface RedirectProps {
  permission?: PermissionItem;
  isAdmin?: boolean;
}

export function Redirect({
  permission = permissionDefault,
  isAdmin,
}: RedirectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isForm, setIsForm] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [view, setView] = useState<{ [key: string]: boolean }[]>([
    { id: false },
    { type: true },
    { source: true },
    { target: true },
    { active: true },
    { creationDate: false },
    { expiry: false },
    { modificationDate: false },
    { passThroughParameters: false },
    { priority: false },
    { regex: false },
    { sourceSite: false },
    { statusCode: false },
    { targetSite: false },
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
  const loading = useSelector(seoRedirectLoading);
  const pagination = useSelector(seoRedirectPagination);
  const data = useSelector(seoRedirectList);
  const [typeOption, setTypeOption] = useState([]);
  const [redirectOption, setRedirectOption] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: typeData } = await seoRedirectTypeOption();
      if (typeData?.data) {
        setTypeOption(typeData.data);
      }
      const { data: redirectData } = await seoRedirectOption();
      if (redirectData?.data) {
        setRedirectOption(redirectData.data);
      }
    };
    fetchData();
  }, [permission]);

  const createHandler = async (value, form) => {
    try {
      const formData = new FormData();
      ['type', 'source', 'target'].forEach(field => {
        const value = form.getFieldValue(field);
        if (value) {
          formData.append(field, value);
        }
      });

      const { data } = await seoRedirectCreate(formData);
      if (data) {
        getMessage(data);
        if (data.data?.success) {
          dispatch(actions.createSeoRedirect(data.data));
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

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      SEO_REDIRECT_GET_LIST({
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
              {t('seo_http.create')}
            </Button>
          )}

          {(isAdmin || permission?.create) && isForm && typeOption && (
            <CreateModal
              modalTitle={t('seo_http.modal.create_title')}
              open={open}
              onClose={() => {
                setOpen(false);
              }}
              onSubmit={createHandler}
              formItems={
                <>
                  <FormSelect
                    required
                    name="type"
                    label={t('seo_http.modal.type_label')}
                    option={typeOption}
                  />
                  <FormInput
                    required
                    name="source"
                    label={t('seo_http.modal.source_label')}
                  />
                  <FormInput
                    required
                    name="target"
                    label={t('seo_http.modal.target_label')}
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
            {selectedRowKeys.length} {t('seo_http.selected')}
          </span>
          {(isAdmin || permission?.delete) && (
            <ConfirmDeleteModal
              title={t('seo_http.delete.title')}
              question={t('seo_http.delete.description')}
              message={t('seo_http.delete.message')}
              action={async () => {
                const { data } = await seoRedirectDelete(
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
                    { value: 'type', label: 'type' },
                    { value: 'active', label: 'active' },
                    { value: 'creationDate', label: 'creationDate' },
                    { value: 'modificationDate', label: 'modificationDate' },
                  ]}
                  sort={sort}
                  setSort={setSort}
                />
                <TypeFilter
                  types={{
                    id: 'number',
                    type: 'string',
                    active: 'boolean',
                    source: 'string',
                    target: 'string',
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
          <RedirectTables
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
            typeOption={typeOption}
            redirectOption={redirectOption}
          />
        </div>
      )}
    </div>
  );
}
