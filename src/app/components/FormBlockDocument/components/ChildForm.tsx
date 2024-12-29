import React, { useEffect, useState } from 'react';
import { objectType } from 'utils/types/const';
import { FormInstance } from 'antd';
import { CheckboxForm } from 'app/pages/ObjectDetail/components/CheckboxForm';
import { MapForm } from 'app/pages/ObjectDetail/components/MapForm';
import { VideoForm } from 'app/pages/ObjectDetail/components/VideoForm';
import { EditItem } from 'app/pages/PageDetail/constant';
import { FormLink } from 'app/components/FormLink';
import { FormImage } from 'app/components/FormImage';
import { FormCascader } from 'app/components/FormCascader';
import { FormInput } from 'app/components/FormInput';
import { FormDate } from 'app/components/FormDate';
import { FormSelect } from 'app/components/FormSelect';
import Wysiwyg from 'app/components/Wysiwyg';
import { FormGallery } from 'app/components/FormGallery';

export interface ChildFormProps {
  fatherForm: FormInstance;
  parentName?: any;
  optionsData?: any;
  editables?: EditItem[];
  forceUpdate?: Function;
}

const fieldComponents = {
  input: FormInput,
  textarea: FormInput,
  numeric: FormInput,
  checkbox: CheckboxForm,
  link: FormLink,
  video: VideoForm,
  image: FormImage,
  geopoint: MapForm,
};

const cascaderTypes = ['relation', 'relations'];

export function ChildForm({
  fatherForm,
  parentName = [],
  optionsData = {},
  editables = [],
  forceUpdate,
}: ChildFormProps) {
  const [dataObj, setDataObj] = useState<objectType | undefined>();

  useEffect(() => {
    setDataObj(editables);
  }, [editables]);

  return (
    <div className="flex flex-col bg-[#ffffff] rounded-2xl">
      {dataObj?.map((item, index) => {
        const name = [...parentName, item.realName ?? ''];

        // Handle cascader separately
        if (cascaderTypes.includes(item.type)) {
          return (
            <FormCascader
              key={index}
              type={item.type}
              name={name}
              fatherForm={fatherForm}
              option={optionsData[item.realName]}
              isBlock={true}
              multiple={item.type === 'relations'}
            />
          );
        }

        if (item.type === 'imageGallery') {
          return (
            <FormGallery
              key={index}
              name={name}
              supportedTypes={item.supportedTypes}
              form={fatherForm}
            />
          );
        }

        if (item.type === 'wysiwyg') {
          return (
            <Wysiwyg
              key={index}
              content=""
              label={item.title}
              name={name}
              form={fatherForm}
            />
          );
        }

        if (item.type === 'select') {
          return (
            <FormSelect
              key={index}
              option={optionsData[item.realName]}
              label={item.title}
              name={name}
            />
          );
        }

        if (item.type === 'date') {
          return (
            <FormDate
              key={index}
              fatherForm={fatherForm}
              label={item.title}
              name={name}
            />
          );
        }

        // Handle field components dynamically
        const FieldComponent = fieldComponents[item.type];
        if (FieldComponent) {
          return (
            <FieldComponent
              key={index}
              name={name}
              form={fatherForm}
              data={item}
              isBlock={true}
              forceUpdate={forceUpdate}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
