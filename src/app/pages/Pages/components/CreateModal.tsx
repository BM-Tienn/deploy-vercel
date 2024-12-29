import { Button, Form, Modal, Flex } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FormInput } from 'app/components/FormInput';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { pageCreate } from 'services/pagesApi';
import { addPropsToChildren } from 'utils/hooks/appPropsTochild';
import QueryString from 'qs';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { pagesActions } from '../slice';
import { useTranslation } from 'react-i18next';

export interface CreateModalProps {
  children: React.ReactNode;
  parentId?: number;
  modalTitle?: string;
  type: 'Snippet' | 'Link' | 'Email' | 'Hardlink' | 'Folder' | 'Page';
}

export function CreateModal({
  children,
  parentId,
  modalTitle,
  type,
}: CreateModalProps) {
  const [form] = useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const createHandler = async value => {
    const params = { ...value, type, key: value.title, parentId };

    try {
      const { data } = await pageCreate(QueryString.stringify(params));
      if (data) {
        dispatch(pagesActions.createPage(data.data));
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
        getMessage(response);
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
              rules={[
                { required: true, message: t('pages.rules.key_required') },
              ]}
              name="title"
              label={t('pages.key')}
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
              {t('pages.create')}
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              {t('pages.close')}
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
}
