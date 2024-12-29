// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { Card, Button, Form, Flex, Skeleton, Space } from 'antd';
import { getListUser, updateSettingUser } from 'services/settingApi';
import openNotificationWithIcon from 'app/functions/openNotificationWithIcon';
import { FormInput } from 'app/components/FormInput';

export interface UserProps {
  activeTab: string;
  setActiveTab: (key: string) => void;
}

export function User({ setActiveTab }: UserProps) {
  const [form] = Form.useForm();
  const [active, setActive] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      const { data } = await getListUser();
      if (data) {
        const config = data?.data;
        Object.keys(config).forEach(key => {
          form.setFieldValue(key, config[key]);
        });
        setActive(true);
      }
    })();
  }, [form]);

  const save = async () => {
    try {
      const formData = new FormData();
      const formValue = form.getFieldsValue(true);
      Object.keys(formValue).forEach(key => {
        formData.append(key, formValue[key]);
      });

      const response = await updateSettingUser(formData);

      openNotificationWithIcon(
        response.data?.data?.success ? 'success' : 'error',
        '',
        response.data?.data?.message,
      );
    } catch ({ response }: any) {
      openNotificationWithIcon(
        'error',
        '',
        response.data.errors
          ? response.data.errors?.key + ' ' + response.data.errors?.message
          : '',
      );
    }
  };

  return (
    <Card>
      <Card.Meta
        title="General Style"
        description={
          active ? (
            <Form
              form={form}
              onFinish={save}
              onValuesChange={value => {
                const fieldName = Object.keys(value)[0];
                form.setFieldValue(fieldName, value[fieldName]);
              }}
            >
              <Flex vertical justify="flex-start">
                <Flex>
                  <FormInput
                    name="username"
                    label="User Name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                  />
                </Flex>
                <Flex>
                  <FormInput
                    name="password"
                    type="password"
                    label="Password"
                    rules={[
                      { required: true, message: 'Vui lòng nhập password!' },
                    ]}
                  />
                </Flex>
                <Flex align="start">
                  <Button type="default" className="mt-5" htmlType="submit">
                    Save
                  </Button>
                </Flex>
              </Flex>
            </Form>
          ) : (
            <Flex gap="middle" vertical>
              <Space>
                <Skeleton.Input active={active} />
              </Space>
              <Space>
                <Skeleton.Input active={active} />
              </Space>
              <Skeleton.Button active={active} />
            </Flex>
          )
        }
      />
    </Card>
  );
}
