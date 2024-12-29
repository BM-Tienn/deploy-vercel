import React, { useEffect, useState } from 'react';
import { ObjectDetailWrapper } from './styled';
import { useParams, useSearchParams } from 'react-router-dom';
import { Header } from './components/Header';
import { Helmet } from 'react-helmet-async';
import { Content } from './components/Content';
import { objectGetDetailsApi, objectGetOptionsApi } from 'services/objectApi';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { ObjectLayout, SideBarData } from './constant';
import { Form } from 'antd';
import QueryString from 'qs';
import { ItemProps } from 'app/slice/types';
import { PermissionItem } from 'app/components/Permission/constant';
import { permissionDefault } from 'app/components/Permission/components/LayoutTables';
import { globalIsAdmin, globalPermissionData } from 'app/slice/selector';
import { filterPermission } from 'app/functions/hasPermission';
import { useSelector } from 'react-redux';

export interface ObjectDetailProps {}

export const fixData = data => {
  let output: any = {};

  if (data?.children) {
    output = {
      ...data,
      label: <span>{data?.label}</span>,
      children: data?.children.map(child => fixData(child)),
      value: `${data.value}`,
    };
  } else {
    output = {
      ...data,
      label: <span>{data?.label}</span>,
      value: `${data.value}`,
    };
  }

  return output;
};

export function ObjectDetail(props: ObjectDetailProps) {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { object } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [locale, setLocale] = useState<string | undefined>(undefined);
  const [data, setData] = useState<
    | {
        layout: ObjectLayout;
        sidebar: SideBarData;
        options: ItemProps[][];
      }
    | undefined
  >(undefined);
  const [form] = Form.useForm();
  const [permission, setPermission] =
    useState<PermissionItem>(permissionDefault);
  const permissionData = useSelector(globalPermissionData);
  const isAdmin = useSelector(globalIsAdmin);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const permissionItem = filterPermission(permissionData, 'objects', object);

    if (permissionItem) setPermission(permissionItem);
  }, [object, permissionData]);

  useEffect(() => {
    if (isAdmin || permission?.view) {
      (async () => {
        setLoading(true);
        try {
          const { data: res } = await objectGetDetailsApi(id);
          if (res) {
            const { data } = res;
            data.options = {};
            await Promise.all(
              Object.keys(data.optionData).map(async key => {
                const { data: res } = await objectGetOptionsApi(
                  QueryString.stringify(data.optionData[key]),
                );
                if (res) {
                  if (Array.isArray(res.data) && res.data.length > 0) {
                    data.options[key] = res.data?.map(item => fixData(item));
                  } else {
                    data.options[key] = [res.data]?.map(item => fixData(item));
                  }
                }
              }),
            );

            setData(data);
            const layout = data?.layoutData;

            form.setFieldsValue({ ...layout });
          }
        } catch ({ response }: any) {
          setIsError(true);
          getMessage(response);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [form, id, isAdmin, permission?.view]);

  return (
    <ObjectDetailWrapper className="flex-1 bg-white flex flex-col overflow-hidden">
      <Helmet>
        <title>{data?.sidebar.key}</title>
      </Helmet>
      {isError ? (
        <> </>
      ) : (
        <>
          <Header
            locale={locale}
            id={id}
            globalForm={form}
            data={data}
            loading={loading}
            object={object}
            permission={permission}
            isAdmin={isAdmin}
          />
          <Content
            locale={locale}
            setLocale={setLocale}
            globalForm={form}
            data={data}
            loading={loading}
            permission={permission}
            isAdmin={isAdmin}
          />
        </>
      )}
    </ObjectDetailWrapper>
  );
}
