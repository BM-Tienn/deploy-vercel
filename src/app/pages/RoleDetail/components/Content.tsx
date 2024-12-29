import React, { useEffect, useState } from 'react';
import { Skeleton, Flex, Button, Form } from 'antd';
import { FormInput } from 'app/components/FormInput';
import { PermissionData } from 'app/components/Permission/constant';
import { Permission } from 'app/components/Permission';
import usePermission from 'utils/hooks/usePermission';
import { AccessDenied } from 'app/pages/AccessDenied/Loadable';

export interface ContentProps {
  loading: boolean;
  data?: any;
  callback?: Function;
}

export function Content({ loading, data, callback }: ContentProps) {
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [form] = Form.useForm();
  const [permissions, setPermissions] = useState<PermissionData>({
    assets: [],
    documents: [],
    objects: [],
    others: [],
  });
  const isView = usePermission('others', 'role', 'view');

  useEffect(() => {
    if (data?.role) {
      form.setFieldsValue(data.role);
      if (data.role?.permission) {
        setPermissions(data.role?.permission);
      }
    }
  }, [data, form]);

  const layoutItems = [
    {
      key: 'basic',
      label: 'Basic',
      content: (
        <Form
          form={form}
          onFinish={() => {}}
          onValuesChange={value => {
            const fieldName = Object.keys(value)[0];
            form.setFieldValue(fieldName, value[fieldName]);
            if (callback) callback(form.getFieldsValue());
          }}
        >
          <Flex vertical justify="flex-start" className="max-w-xl">
            <FormInput name="name" label="Role Name" />
          </Flex>
        </Form>
      ),
    },
    {
      key: 'permissions',
      label: 'Permissions',
      content: <Permission data={permissions} />,
    },
  ];

  if (!isView) return <AccessDenied />;

  return (
    <>
      {loading ? (
        <div className="mx-5 w-[200px]">
          <Skeleton.Button active block size="large" shape="round" />
        </div>
      ) : (
        <Flex className="relative mx-5 w-fit p-1 items-center gap-2 bg-white rounded-xl border border-[#DAD9D9]">
          {layoutItems.map(tab => (
            <Button
              key={tab.key}
              className={`rounded-lg text-base capitalize h-8 px-4 font-medium ${
                activeTab === tab.key
                  ? 'bg-[#EFE7F3] text-[#6A1B9A]'
                  : 'text-[#919EAB]'
              }`}
              type="text"
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </Flex>
      )}
      <div className="w-full px-5 pt-0 pb-3 overflow-hidden">
        <Flex gap={24} className="w-full h-full overflow-hidden">
          <Flex
            vertical
            className="flex-1 px-4 h-full rounded-[12px] border overflow-auto"
          >
            {layoutItems.map(tab => (
              <div
                key={tab.key}
                style={{
                  display: activeTab === tab.key ? 'block' : 'none',
                  width: '100%',
                  height: '100%',
                }}
              >
                {tab.content}
              </div>
            ))}
          </Flex>
        </Flex>
      </div>
    </>
  );
}
