import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, FormInstance, Button, Form } from 'antd';
import { ObjectDataType } from 'app/pages/ObjectDetail/constant';
import React, { useEffect, useState } from 'react';
import { ChildForm } from './components/ChildForm';
import { fixData } from 'app/pages/ObjectDetail';
import { objectGetOptionsApi } from 'services/objectApi';
import QueryString from 'qs';
import { ApiOptions } from 'app/slice/types';

export interface FormBlockProps {
  required?: boolean;
  title?: string;
  fatherForm: FormInstance;
  name: string;
  layoutData?: ObjectDataType[];
  apiOptions?: ApiOptions;
}

export function FormBlock({
  required,
  title,
  fatherForm,
  name,
  layoutData,
  apiOptions,
}: FormBlockProps) {
  const panelStyle: React.CSSProperties = {
    border: 'solid 1px #e5e7eb',
  };

  const [optionData, setOptionData] = useState({});

  useEffect(() => {
    const options = [];
    if (apiOptions?.value) {
      const defaultParams = {
        id: apiOptions?.id,
        class: apiOptions?.class,
        type: 'block',
      };

      Object.entries(apiOptions.value).forEach(([key, value]) => {
        if (value) {
          const params = {
            ...defaultParams,
            ...value,
            ...{ typeId: key },
          };
          (async () => {
            try {
              const { data: res } = await objectGetOptionsApi(
                QueryString.stringify(params),
              );
              if (res) {
                if (!options[key]) options[key] = [];

                if (Array.isArray(res.data) && res.data.length > 0) {
                  options[key] = res.data.map(item => fixData(item));
                } else {
                  options[key] = [res.data].map(item => fixData(item));
                }
              }
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          })();
        }
      });
    }
    setOptionData(options);
  }, [apiOptions]);

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
                  data={layoutData}
                  fatherForm={fatherForm}
                  parentName={[index.toString()]}
                  options={optionData}
                  optionName={[name, index.toString()]}
                />
                <Button type="link" onClick={() => remove(field.name)}>
                  Remove
                </Button>
              </div>
            ),
            className: 'mb-4 !rounded-lg !border bg-white !border-[#e5e7eb]',
            style: panelStyle,
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
              <Button type="dashed" block onClick={() => add()}>
                + Add Item
              </Button>
            </Form.Item>
          </>
        );
      }}
    </Form.List>
  );
}
