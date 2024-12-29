// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { RoleWrapper } from './styled';
import { Helmet } from 'react-helmet-async';
import { Button, Flex } from 'antd';
import { ROLE_GET_LIST, rolesActions, useRolesSlice } from './slice';
import { ViewFilter } from 'app/components/ViewFIlter';
import { SortFilter } from 'app/components/SortFilter';
import { TypeFilter } from 'app/components/TypeFilter';
import { useDispatch, useSelector } from 'react-redux';
import { rolesList, rolesLoading, rolesPagination } from './slice/selector';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import { roleCreate, roleDelete } from 'services/roleApi';
import QueryString from 'qs';
import { FilterObj, Sort } from 'app/slice/types';
import { RoleTables } from './components/RoleTables';
import { CreateModal } from 'app/components/CreateModal';
import { FormInput } from 'app/components/FormInput';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import usePermission from 'utils/hooks/usePermission';
import { useTranslation } from 'react-i18next';

export interface RoleProps {}

export function Role(props: RoleProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [view, setView] = useState<{ [key: string]: boolean }[]>([
    { id: true },
    { name: true },
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
  const { actions } = useRolesSlice();
  const loading = useSelector(rolesLoading);
  const pagination = useSelector(rolesPagination);
  const data = useSelector(rolesList);
  const [open, setOpen] = useState(false);
  const [isForm, setIsForm] = useState(true);
  const isCreate = usePermission('others', 'role', 'create');
  const isDelete = usePermission('others', 'role', 'delete');
  const isView = usePermission('others', 'role', 'view');
  const isListing = usePermission('others', 'role', 'listing');
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(
      ROLE_GET_LIST({
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

  const createHandler = async (value, form) => {
    try {
      const formData = new FormData();
      formData.append('name', form.getFieldValue('name'));

      const { data } = await roleCreate(formData);
      if (data) {
        getMessage(data);
        dispatch(rolesActions.createRole(data.data));

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

  return (
    <RoleWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>{t('role.title')}</title>
      </Helmet>
      <div className="px-5 py-3 flex justify-between items-center">
        <Flex className="gap-6">
          <Flex vertical>
            <h1 className="font-bold text-[20px]">{t('role.title')}</h1>

            {isCreate && (
              <Button
                type="primary"
                onClick={() => setOpen(true)}
                icon={<i className="far fa-plus" />}
              >
                {t('role.create')}
              </Button>
            )}

            {isCreate && isForm && (
              <CreateModal
                modalTitle={t('role.modal.title')}
                open={open}
                onClose={() => {
                  setOpen(false);
                }}
                onSubmit={createHandler}
                formItems={
                  <>
                    <FormInput
                      required
                      name="name"
                      label={t('role.modal.name_label')}
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
              {selectedRowKeys.length} {t('role.selected')}
            </span>
            {isDelete && (
              <ConfirmDeleteModal
                title={t('role.delete.title')}
                question={t('role.delete.description')}
                message={t('role.delete.message')}
                action={async () => {
                  try {
                    const { data } = await roleDelete(
                      QueryString.stringify({ id: selectedRowKeys }),
                    );
                    if (data) {
                      dispatch(actions.deleteRoles(selectedRowKeys));
                      setSelectedRowKeys([]);
                      getMessage(data);
                    }
                  } catch ({ response }: any) {
                    getMessage(response?.data);
                  }
                }}
                multiple
              />
            )}
          </div>
        )}
      </div>
      {isListing && (
        <div className="h-[calc(100%-60px)] px-6 pb-6">
          <div className="h-full w-full flex flex-col p-4 rounded-[20px] gap-3 shadow-[0px_0px_2px_0px_rgba(145,158,171,0.25),0px_10px_40px_-4px_rgba(145,158,171,0.15)]">
            <div className="h-9 flex justify-between items-center">
              <div className="flex gap-3 items-center"></div>
              <div className="flex gap-4 items-center">
                <div className="h-full gap-1 flex items-center">
                  <ViewFilter list={view} setList={setView} />
                  <SortFilter
                    types={[
                      { value: 'id', label: 'Id' },
                      { value: 'name', label: 'Name' },
                    ]}
                    sort={sort}
                    setSort={setSort}
                  />
                  <TypeFilter
                    types={{
                      id: 'number',
                      name: 'string',
                    }}
                    filterObj={filterObj}
                    setFilterObj={setFilterObj}
                  />
                </div>
                <Button className="flex items-center gap-[10px] px-[10px] h-[32px] rounded-[8px]">
                  <i className="fa-solid fa-download"></i>
                  {t('role.export')}
                </Button>
              </div>
            </div>
            <RoleTables
              isView={isView}
              isDelete={isDelete}
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
      )}
    </RoleWrapper>
  );
}
