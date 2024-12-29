// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { UserWrapper } from './styled';
import { Helmet } from 'react-helmet-async';
import { Button, Flex } from 'antd';
import { USER_GET_LIST, usersActions, useUsersSlice } from './slice';
import { ViewFilter } from 'app/components/ViewFIlter';
import { SortFilter } from 'app/components/SortFilter';
import { TypeFilter } from 'app/components/TypeFilter';
import { useDispatch, useSelector } from 'react-redux';
import { usersList, usersLoading, usersPagination } from './slice/selector';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import { userCreate, userDelete } from 'services/userApi';
import QueryString from 'qs';
import { FilterObj, Sort } from 'app/slice/types';
import { UserTables } from './components/UserTables';
import { CreateModal } from 'app/components/CreateModal';
import { FormInput } from 'app/components/FormInput';
import { getMessage } from 'app/functions/openNotificationWithIcon';

export interface UserProps {}

export function User(props: UserProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [view, setView] = useState<{ [key: string]: boolean }[]>([
    { active: true },
    { username: true },
    { name: true },
    { email: true },
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
  const { actions } = useUsersSlice();
  const loading = useSelector(usersLoading);
  const pagination = useSelector(usersPagination);
  const data = useSelector(usersList);
  const [open, setOpen] = useState(false);
  const [isForm, setIsForm] = useState(true);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      USER_GET_LIST({
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
      formData.append('username', form.getFieldValue('username'));
      formData.append('password', form.getFieldValue('password'));

      const { data } = await userCreate(formData);
      if (data) {
        getMessage(data);
        dispatch(usersActions.createUser(data.data));

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
    <UserWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>User</title>
      </Helmet>
      <div className="px-5 py-3 flex justify-between items-center">
        <Flex className="gap-6">
          <Flex vertical>
            <h1 className="font-bold text-[20px]">Users</h1>

            <Button
              type="primary"
              onClick={() => setOpen(true)}
              icon={<i className="far fa-plus" />}
            >
              Create
            </Button>
            {isForm && (
              <CreateModal
                modalTitle="Create User"
                open={open}
                onClose={() => {
                  setOpen(false);
                }}
                onSubmit={createHandler}
                clear={true}
                formItems={
                  <>
                    <FormInput
                      required
                      rules={[
                        { required: true, message: 'Vui lòng nhập tên!' },
                      ]}
                      name="username"
                      label="UserName"
                    />
                    <FormInput
                      required
                      type="password"
                      rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                      ]}
                      name="password"
                      label="Password"
                    />
                  </>
                }
              />
            )}
          </Flex>
        </Flex>
        {!!selectedRowKeys.length && (
          <div className="flex gap-6 items-center">
            <span>{selectedRowKeys.length} Selected</span>
            <ConfirmDeleteModal
              title={`Delete selected user?`}
              question={`Are you sure you want to delete all selected user?`}
              message={`This action cannot be undone.`}
              action={async () => {
                try {
                  const { data } = await userDelete(
                    QueryString.stringify({ id: selectedRowKeys }),
                  );
                  if (data) {
                    dispatch(actions.deleteUsers(selectedRowKeys));
                    setSelectedRowKeys([]);
                    getMessage(data);
                  }
                } catch ({ response }: any) {
                  getMessage(response?.data);
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
                    { value: 'active', label: 'Active' },
                    { value: 'name', label: 'Name' },
                    { value: 'username', label: 'Username' },
                    { value: 'email', label: 'Email' },
                  ]}
                  sort={sort}
                  setSort={setSort}
                />
                <TypeFilter
                  types={{
                    name: 'string',
                    username: 'string',
                    email: 'string',
                    active: 'boolean',
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
          <UserTables
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
    </UserWrapper>
  );
}
