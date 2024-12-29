import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, FormInstance, Button, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { ChildForm } from './components/ChildForm';
import { BlockConfig, EditItem } from 'app/pages/PageDetail/constant';
import { pageGetOptions } from 'services/pagesApi';
import { useSearchParams } from 'react-router-dom';

export interface FormBlockDocumentProps {
  required?: boolean;
  title?: string;
  fatherForm: FormInstance;
  name: string;
  config?: BlockConfig;
  forceUpdate?: Function;
}

export function FormBlockDocument({
  required,
  title,
  fatherForm,
  name,
  config,
  forceUpdate,
}: FormBlockDocumentProps) {
  const [editables, setEditables] = useState<EditItem[]>([]);
  const [optionsData, setOptionsData] = useState<any>();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    const getOptions = async item => {
      try {
        const formData = new FormData();
        if (id) formData.append('id', id.toString());
        formData.append('config', JSON.stringify(item?.config));
        const response = await pageGetOptions(formData);

        if (response.data?.data)
          setOptionsData(prev => ({
            ...prev,
            [item?.realName]: response.data.data,
          }));
      } catch ({ response }: any) {}
    };

    editables?.forEach((item, index) => {
      if (item.type === 'relation' || item?.type === 'relations')
        getOptions(item);
    });
  }, [editables, id]);

  useEffect(() => {
    if (config?.template?.editables) {
      setEditables(config.template.editables);
    }
  }, [config]);

  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => {
        const newItems = fields.map((field, index) => {
          // const item = fatherForm.getFieldValue(name)?.[index] || {};
          return {
            key: `${field.key}`,
            label: `Index:${index + 1}`,
            children: (
              <div>
                <ChildForm
                  key={field.key}
                  editables={editables}
                  fatherForm={fatherForm}
                  parentName={[name, index.toString()]}
                  forceUpdate={forceUpdate}
                  optionsData={optionsData}
                />
                <Button type="link" onClick={() => remove(field.name)}>
                  Remove
                </Button>
              </div>
            ),
            className: 'mb-4 !rounded-lg !border bg-white !border-[#e5e7eb]',
            style: { border: 'solid 1px #e5e7eb' },
          };
        });

        return (
          <>
            <div className="flex flex-col">
              <span className="text-sm text-slate-400">
                {title}
                {required && (
                  <i className="ml-[4px] fa-solid fa-circle-info"></i>
                )}
              </span>
              <Collapse
                className="px-3 py-2 bg-[rgba(0, 0, 0, 0.02)]"
                bordered={false}
                expandIconPosition="end"
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                items={newItems}
              />
            </div>

            <Form.Item>
              <Button type="dashed" block onClick={() => add({})}>
                + Add Item
              </Button>
            </Form.Item>
          </>
        );
      }}
    </Form.List>
  );
}
