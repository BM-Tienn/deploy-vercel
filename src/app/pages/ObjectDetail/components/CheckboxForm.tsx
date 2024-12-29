import * as React from 'react';
import { ObjectDataType } from '../constant';
import { FormCheckbox } from 'app/components/FormCheckbox';
import { Flex } from 'antd';

export interface CheckboxFormProps {
  data: ObjectDataType | ObjectDataType[];
  readOnly?: boolean;
  required?: boolean;
  parentName?: [];
  customItem?: string;
}

export function CheckboxForm({
  data,
  readOnly,
  required,
  parentName,
  customItem = 'name',
}: CheckboxFormProps) {
  return (
    <Flex vertical gap={4}>
      <span className="text-sm text-slate-400">Checkboxes</span>
      {Array.isArray(data) ? (
        data.map(field => (
          <FormCheckbox
            required={required}
            readOnly={readOnly}
            label={field?.title ?? ''}
            name={
              parentName
                ? [...parentName, field?.[customItem] ?? '']
                : field?.[customItem] ?? ''
            }
          ></FormCheckbox>
        ))
      ) : (
        <FormCheckbox
          required={required}
          readOnly={readOnly}
          label={data?.title ?? ''}
          name={
            parentName
              ? [...parentName, data?.[customItem] ?? '']
              : data?.[customItem] ?? ''
          }
        ></FormCheckbox>
      )}
    </Flex>
  );
}
