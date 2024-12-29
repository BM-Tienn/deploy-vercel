import { Cascader, Form } from 'antd';
import { FormInstance, Rule } from 'antd/es/form';
import { ItemProps } from 'app/slice/types';
import { useState, useEffect } from 'react';

export interface FormCascaderProps {
  multiple?: boolean;
  name?: string | string[];
  title?: string;
  rules?: Rule[];
  required?: boolean;
  option?: ItemProps[];
  fatherForm: FormInstance;
  type?: string;
  isBlock?: boolean;
  callback?: Function; // callback (name, value)
}

export function FormCascader({
  multiple,
  name,
  rules,
  title,
  required,
  option,
  fatherForm,
  type,
  isBlock = false,
  callback,
}: FormCascaderProps) {
  const [value, setValue] = useState<any>([]);

  const convertInt = data =>
    data?.map((item, index, arr) =>
      index === arr.length - 1 && typeof item === 'string'
        ? isNaN(Number(item))
          ? item
          : parseInt(item, 10)
        : item,
    );

  useEffect(() => {
    const initData = fatherForm.getFieldValue(name);

    if (!initData) {
      setValue([]);
      return;
    }

    const formattedValue = (() => {
      switch (type) {
        case 'relation':
        case 'manyToOneRelation':
          const convertValue = initData?.fullpath?.split('/');
          if (isBlock) {
            return convertInt(convertValue);
          }
          return convertValue;
        case 'relations':
        case 'manyToManyRelation':
        case 'manyToManyObjectRelation':
        case 'advancedManyToManyRelation':
          return initData?.map(rel => {
            const convertValue = rel?.fullpath?.split('/');
            if (isBlock) {
              return convertInt(convertValue);
            }
            return convertValue;
          });
        default:
          return initData;
      }
    })();

    setValue(Array.isArray(formattedValue) ? formattedValue : []);
  }, [type, fatherForm, name, isBlock]);

  const customRender = (label: string, publish: boolean) => {
    return publish ? (
      <span>{label}</span>
    ) : (
      <span style={{ textDecoration: 'line-through', color: 'red' }}>
        {label}
      </span>
    );
  };

  const processOptions = (options: any[]) =>
    options.map(option => ({
      ...option,
      label: customRender(option.label, option.publish),
      children: option.children ? processOptions(option.children) : undefined,
    }));

  return (
    <div className="flex flex-col">
      <span className="text-sm text-slate-400">
        {title}
        {required && <i className="ml-[4px] fa-solid fa-circle-info"></i>}
      </span>

      {option?.length && (
        <Cascader
          placeholder={title ?? '-'}
          className="w-full h-fit [&>.ant-select-selector]:min-h-[40px]"
          options={processOptions(option)}
          multiple={multiple}
          value={value}
          onChange={value => {
            setValue(value);
            fatherForm.setFieldValue(name, value);
            if (callback) callback(name, value);
          }}
        />
      )}

      <Form.Item
        className="mb-0"
        // name={name}
        rules={rules}
        required={required}
      ></Form.Item>
    </div>
  );
}
