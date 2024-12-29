import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { LoginWrapper } from './styled';
import { Button, Form, Space, Flex } from 'antd';
import { FormInput } from 'app/components/FormInput';
import { useForm } from 'antd/es/form/Form';
import { loginAPI } from 'services/accountApi';
import openNotificationWithIcon, {
  getMessage,
} from 'app/functions/openNotificationWithIcon';
import { useGlobalFunctions } from 'utils/hooks/useGlobalFuncion';

export function Login() {
  const [form] = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const { onLogin } = useGlobalFunctions();
  const loginHandler = async value => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(value).forEach(([key, value]) => {
      if (typeof value === 'string') formData.append(key, value);
    });
    try {
      const { data } = await loginAPI(formData);
      if (data) {
        onLogin(data?.data);
        openNotificationWithIcon('success', '', 'Login success!');
      }
    } catch ({ response }: any) {
      getMessage(response?.data);

      form.setFields([
        {
          name: response?.data?.errors?.key,
          errors: [response?.data?.errors?.message],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Corepluse login" />
      </Helmet>
      <LoginWrapper className="flex h-screen w-screen">
        <div className="w-2/3 p-[8px]">
          <img
            className="w-full h-full object-cover rounded-xl"
            alt=""
            src={process.env.REACT_APP_SUB_DIR + '/static/images/login-bg.png'}
          />
        </div>
        <Flex vertical justify="between" gap={42} className="w-1/3 px-12 py-6">
          <div className="appLogo w-[80px] h-auto">
            <img
              src={process.env.REACT_APP_SUB_DIR + '/static/images/logo.png'}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
          <Flex vertical gap={16} className="flex-1">
            <h1 className="font-semibold text-2xl">Welcome to CorePulse</h1>
            <Flex vertical gap={8}>
              <Form
                onFinish={value => loginHandler(value)}
                form={form}
                layout="vertical"
                className="w-full"
              >
                <FormInput
                  rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                  required
                  label="User name"
                  name="username"
                />
                <FormInput
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  ]}
                  required
                  label="Password"
                  name="password"
                  type="password"
                />
                <Form.Item>
                  <Button
                    loading={loading}
                    disabled={loading}
                    htmlType="submit"
                    className="w-full"
                    type="primary"
                    size="large"
                  >
                    Login
                  </Button>
                </Form.Item>
              </Form>
              <Space
                direction="vertical"
                size={8}
                className="w-full rounded-xl bg-orange-50 p-4"
              >
                <span className="font-semibold">Demo Account</span>
                <span>
                  Username: <strong>admin</strong>
                  <br />
                  Password: <strong>12345</strong>
                </span>
              </Space>
            </Flex>
          </Flex>
          <span className="appCopyright w-full p-4 rounded-xl bg-slate-100">
            ©2024 Developed by CorePulse Team with ❤️
          </span>
        </Flex>
      </LoginWrapper>
    </>
  );
}
