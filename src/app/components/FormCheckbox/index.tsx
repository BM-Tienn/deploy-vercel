import { Checkbox, Form } from 'antd';
import { Rule } from 'antd/es/form';
import * as React from 'react';

export interface FormCheckboxProps {
  rules?: Rule[];
  name: string | string[];
  label: string;
  required?: boolean;
  readOnly?: boolean;
}

export function FormCheckbox({
  rules,
  name,
  label,
  required,
  readOnly,
}: FormCheckboxProps) {
  return (
    <Form.Item
      name={name}
      rules={rules}
      required={required}
      valuePropName="checked"
      className="
      w-1/2"
    >
      <Checkbox>{label}</Checkbox>
    </Form.Item>
  );
}
