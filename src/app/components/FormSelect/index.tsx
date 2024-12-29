import { Select } from 'antd';
import Form, { Rule } from 'antd/es/form';

export interface FormSelectProps {
  required?: boolean;
  placeholder?: string;
  rules?: Rule[];
  name: string | string[];
  label?: string;
  readOnly?: boolean;
  option?: ItemProps[];
  multi?: boolean;
}
export interface ItemProps {
  label?: string;
  value: string;
  children?: ItemProps[];
  key?: string;
}
export function FormSelect({
  required,
  placeholder,
  rules,
  name,
  label,
  readOnly,
  option,
  multi = false,
}: FormSelectProps) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-slate-400">
        {label}
        {required && <i className="ml-[4px] fa-solid fa-circle-info"></i>}
      </span>
      <Form.Item name={name} rules={rules} required={required}>
        <Select
          mode={multi ? 'tags' : undefined}
          className="h-[40px]"
          disabled={readOnly}
          placeholder={placeholder}
          optionFilterProp="label"
          options={option?.map(item => ({
            ...item,
            label: item.label || item.key,
          }))}
        />
      </Form.Item>
    </div>
  );
}
