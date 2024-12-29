import { Button, Form, Modal, Flex } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FormInput } from 'app/components/FormInput';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPropsToChildren } from 'utils/hooks/appPropsTochild';
import QueryString from 'qs';
import openNotificationWithIcon from 'app/functions/openNotificationWithIcon';
import { objectCreate } from 'services/objectApi';
import { objectAdd } from '../slice';
import { useTranslation } from 'react-i18next';

export interface CreateModalProps {
  children: React.ReactNode;
  modalTitle?: string;
  type?: string;
}

export function CreateModal({ children, modalTitle, type }: CreateModalProps) {
  const [form] = useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const createHandler = async value => {
    const params = { key: value.title, classId: type };
    setLoading(true);
    try {
      const { data } = await objectCreate(QueryString.stringify(params));
      if (data) {
        dispatch(objectAdd(data.data.data));
      }
    } catch ({ response }: any) {
      if (response.data.errors) {
        form.setFields([
          {
            name: response?.data?.errors?.key,
            errors: [response?.data?.errors?.message],
          },
        ]);
      } else {
        openNotificationWithIcon(
          'error',
          '',
          response.data.error ? response.data.error?.message : '',
        );
      }
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      {addPropsToChildren(children, { onClick: () => setOpen(true) })}
      <Modal
        className="[&_*.ant-modal-content]:p-0 [&_*.ant-modal-content]:overflow-hidden"
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        destroyOnClose={true}
        centered
        width="fit-content"
        closable={false}
        footer={null}
        title={null}
      >
        <Form
          form={form}
          onFinish={value => createHandler(value)}
          className="w-[500px] flex flex-col gap-0"
        >
          <span className="px-5 py-3 font-semibold text-lg">{modalTitle}</span>
          <Flex vertical className="px-5 py-3">
            <FormInput
              required
              rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
              name="title"
              label="Title"
            />
            {/* {type === 'Page' && (
              <>
                <FormInput
                  required
                  rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                  name="navigation"
                  label="Navigation"
                />
                <FormInput
                  required
                  rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                  name="key"
                  label="Key"
                />
              </>
            )} */}
          </Flex>
          <Flex justify="end" gap={8} className="px-5 py-3 bg-slate-100">
            <Button loading={loading} htmlType="submit" type="primary">
              {t('object.create')}
            </Button>
            <Button
              loading={loading}
              onClick={() => {
                setOpen(false);
              }}
            >
              {t('object.cancel')}
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
}
