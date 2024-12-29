import * as React from 'react';
import { ObjectDataType } from '../constant';
import { FormInstance } from 'antd/es/form';
import { FormBlock } from 'app/components/FormBlock';
import { ApiOptions } from 'app/slice/types';

export interface BlockFormProps {
  data: ObjectDataType | ObjectDataType[];
  fatherForm: FormInstance;
  parentName?: [];
}

export function BlockForm({ data, fatherForm, parentName }: BlockFormProps) {
  return (
    <div className="flex flex-col">
      {Array.isArray(data) ? (
        data.map(field => (
          <FormBlock
            fatherForm={fatherForm}
            name={field.name ?? ''}
            title={field.title}
            layoutData={field.children}
            apiOptions={field?.api_options as ApiOptions}
          />
        ))
      ) : (
        <FormBlock
          fatherForm={fatherForm}
          name={data.name ?? ''}
          title={data.title}
          layoutData={data.children}
          apiOptions={data?.api_options as ApiOptions}
        />
      )}
    </div>
  );
}
