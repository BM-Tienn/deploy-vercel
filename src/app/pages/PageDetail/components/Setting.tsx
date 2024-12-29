import { Button, Collapse, Flex, Form } from 'antd';
import { FormImage } from 'app/components/FormImage';
import { FormInput } from 'app/components/FormInput';
import { FormSelect } from 'app/components/FormSelect';
import { PermissionItem } from 'app/components/Permission/constant';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSetting } from '../slice';

import {
  pageGetController,
  pageGetDocumentType,
  pageGetTemplates,
  pagePostDetailApi,
} from 'services/pagesApi';

export interface SettingProps {
  loading?: boolean;
  dataForm?: any;
  permission?: PermissionItem;
  isAdmin?: boolean;
}

export function Setting({
  loading,
  dataForm,
  permission,
  isAdmin,
}: SettingProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [templateConfig, setTemplateConfig] = useState();
  const [controllerConfig, setControllerConfig] = useState();
  const [documentConfig, setDocumentConfig] = useState();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const dispatch = useDispatch();

  useEffect(() => {
    if (dataForm) {
      form.setFieldsValue(dataForm);
    }
  }, [dataForm, form]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await pageGetController();
        if (data.data) {
          setControllerConfig(data.data?.data);
        }
      } catch ({ response }: any) {}
      try {
        const { data } = await pageGetTemplates();
        if (data.data) {
          setTemplateConfig(data.data?.data);
        }
      } catch ({ response }: any) {}
      try {
        const { data } = await pageGetDocumentType(id);
        if (data.data) {
          setDocumentConfig(data.data?.data);
        }
      } catch ({ response }: any) {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveSetting = async () => {
    try {
      const formData = new FormData();
      formData.append('setting', JSON.stringify(form.getFieldsValue(true)));
      const { data } = await pagePostDetailApi(id, formData);
      getMessage(data);

      dispatch(setSetting(form.getFieldsValue(true)));
    } catch (response) {
      getMessage(response);
    }
  };
  return (
    <>
      {/* {data && ( */}
      <Form form={form} onFinish={saveSetting}>
        <Flex vertical gap={8}>
          <Collapse
            defaultActiveKey={['1']}
            items={[
              {
                key: '1',
                label: 'Title & Description & Image ',
                children: (
                  <Flex vertical gap={8}>
                    <FormInput name={'title'} label="Title" />
                    <FormInput
                      name={'description'}
                      label="Description"
                      type="textarea"
                    />
                    <FormImage title="Image" form={form} name={'image'} />
                  </Flex>
                ),
              },
              {
                key: '2',
                label: 'Pretty URL / URL Slug',
                children: (
                  <Flex vertical gap={8}>
                    <FormInput name={'prettyUrl'} />
                  </Flex>
                ),
              },
              {
                key: '3',
                label: 'Controller, Action & Template',
                children: (
                  <Flex vertical gap={8}>
                    <FormSelect
                      option={documentConfig}
                      name={'documentType'}
                      label="Predefined Document Type"
                    />
                    <FormSelect
                      option={controllerConfig}
                      name={'controller'}
                      label="Controller"
                    />
                    <FormSelect
                      option={templateConfig}
                      name={'template'}
                      label="Template"
                    />
                  </Flex>
                ),
              },
            ]}
          />
        </Flex>

        {(isAdmin || permission?.setting) && (
          <Button className="mt-5 mb-5" htmlType="submit" type="primary">
            {t('pages.save_setting')}
          </Button>
        )}
      </Form>
      {/* )} */}
    </>
  );
}
