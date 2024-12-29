// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Form, Skeleton } from 'antd';
import { FormImage } from 'app/components/FormImage';
import { FormInstance } from 'antd';
import { FormInput } from 'app/components/FormInput';
import { FormColor } from 'app/components/FormColor';
import {
  getListAppearance,
  updateSettingAppearance,
} from 'services/settingApi';
import openNotificationWithIcon from 'app/functions/openNotificationWithIcon';

export interface AppearanceProps {
  parentForm?: FormInstance;
  activeTab: string;
  setActiveTab: (key: string) => void;
}

export function Appearance({
  parentForm,
  activeTab,
  setActiveTab,
}: AppearanceProps) {
  const [form] = Form.useForm();
  const [active, setActive] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      const { data } = await getListAppearance();
      if (data) {
        const config = data?.data?.config;
        Object.keys(config).forEach(key => {
          form.setFieldValue(key, config[key]);
        });
        setActive(true);
      }
    })();
  }, [form, parentForm]);

  const save = async () => {
    try {
      const formData = new FormData();
      formData.append('params', JSON.stringify(form.getFieldsValue(true)));

      const { data } = await updateSettingAppearance(formData);

      openNotificationWithIcon(
        data?.data?.success ? 'success' : 'error',
        '',
        data?.data?.message,
      );
    } catch ({ response }: any) {
      openNotificationWithIcon(
        'error',
        '',
        response.data.errors ? response.data.errors?.message : '',
      );
    }
  };

  return (
    <Card>
      <Card.Meta
        title="General Style"
        description={
          <Form
            form={form}
            onValuesChange={value => {
              const fieldName = Object.keys(value)[0];
              form.setFieldValue(fieldName, value[fieldName]);
            }}
          >
            <Row justify="start" gutter={24}>
              <Col span={8}>
                {active ? (
                  <div className="w-[200px]">
                    <FormImage form={form} title="Logo" name="logo" />
                  </div>
                ) : (
                  <Skeleton.Image active={active} />
                )}
              </Col>
              <Col span={8}>
                {active ? (
                  <div className="w-[200px]">
                    <FormImage
                      form={form}
                      title="Login Featured Image"
                      name="background"
                    />
                  </div>
                ) : (
                  <Skeleton.Image active={active} />
                )}
              </Col>
            </Row>
            <Row justify="start" gutter={24}>
              <Col span={8}>
                {active ? (
                  <FormInput name="metaTitle" label="Meta Title" />
                ) : (
                  <Skeleton.Input active={active} />
                )}
              </Col>
              <Col span={8}>
                {active ? (
                  <FormInput name="title" label="Login Title" />
                ) : (
                  <Skeleton.Input active={active} />
                )}
              </Col>
              <Col span={8}>
                {active ? (
                  <FormInput name="footer" label="Login footer" />
                ) : (
                  <Skeleton.Input active={active} />
                )}
              </Col>
            </Row>
            <Row justify="start" gutter={24}>
              <Col span={8}>
                {active ? (
                  <FormColor label="Color" name="color" fatherForm={form} />
                ) : (
                  <Skeleton.Node active={active} />
                )}
              </Col>
              <Col span={8}>
                {active ? (
                  <FormColor
                    label="Color light"
                    name="colorLight"
                    fatherForm={form}
                  />
                ) : (
                  <Skeleton.Node active={active} />
                )}
              </Col>
            </Row>
            {active ? (
              <Button type="primary" onClick={save} className="w-max">
                Save
              </Button>
            ) : (
              <Skeleton.Button active={active} size="large" shape="square" />
            )}
          </Form>
        }
      />
    </Card>
  );
}
