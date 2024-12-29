import { ObjectDataType } from '../constant';
import { FormInstance } from 'antd';
import { Fieldcollections } from 'app/components/Fieldcollections';
import { ApiOptions } from 'app/slice/types';

export interface FieldcollectionsFormProps {
  data: ObjectDataType | ObjectDataType[];

  fatherForm: FormInstance;
}

export function FieldcollectionsForm({
  data,

  fatherForm,
}: FieldcollectionsFormProps) {
  return (
    <div className="flex flex-col">
      {Array.isArray(data) ? (
        data.map(field => (
          <Fieldcollections
            fatherForm={fatherForm}
            name={field.name ?? ''}
            title={field.title}
            layoutData={field.layouts}
            apiOptions={field?.api_options as ApiOptions}
          />
        ))
      ) : (
        <Fieldcollections
          fatherForm={fatherForm}
          name={data.name ?? ''}
          title={data.title}
          layoutData={data.layouts}
          apiOptions={data?.api_options as ApiOptions}
        />
      )}
    </div>
  );
}
