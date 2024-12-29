import { Button, Form, Modal, Flex } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FormInput } from 'app/components/FormInput';
import React, { useState } from 'react';
import QueryString from 'qs';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { createNewFolder } from 'services/mediaApi';
import { useTranslation } from 'react-i18next';

// import { pagesActions } from '../slice';

export interface CreateFolderProps {
  selectedFolder: number;
  onLoadData: Function;
}

export function CreateFolder({
  selectedFolder,
  onLoadData,
}: CreateFolderProps) {
  const { t } = useTranslation();
  const [form] = useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const createHandler = async value => {
    const params = { nameFolder: value.nameFolder, parentId: selectedFolder };
    setLoading(true);

    try {
      const { data: res } = await createNewFolder(
        QueryString.stringify(params),
      );
      if (res) {
        onLoadData();
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
      form.resetFields();
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <Button onClick={() => setOpen(true)} type="primary" className="w-max">
        {t('media_library.new_folder')}
      </Button>
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
          <span className="pt-4 pb-0 px-5 font-semibold text-lg">
            {t('media_library.new_folder')}
          </span>
          <Flex vertical gap={8} className="px-5 pt-4 pb-2">
            <FormInput required name="nameFolder" label="Folder Name" />
          </Flex>
          <Flex justify="end" gap={8} className="px-5 py-3 bg-slate-100">
            <Button loading={loading} htmlType="submit" type="primary">
              {t('media_library.create')}
            </Button>

            <Button
              loading={loading}
              onClick={() => {
                setOpen(false);
              }}
              type="default"
            >
              {t('media_library.close')}
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
}
