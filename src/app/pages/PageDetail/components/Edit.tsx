import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { EditModal } from 'app/components/EditModal';
import { FormInput } from 'app/components/FormInput';
import { FormCheckbox } from 'app/components/FormCheckbox';
import { FormImage } from 'app/components/FormImage';
import { Form } from 'antd';
import { FormBlockDocument } from 'app/components/FormBlockDocument';
import { FormLink } from 'app/components/FormLink';
import { FormDate } from 'app/components/FormDate';
import { FormSelect } from 'app/components/FormSelect';
import Wysiwyg from 'app/components/Wysiwyg';
import { FormVideo } from 'app/components/FormVideo/custom';
import { FormCascader } from 'app/components/FormCascader';
import { pageGetOptions } from 'services/pagesApi';
import { EditItem } from '../constant';
import { useDispatch, useSelector } from 'react-redux';
import { pageDetailDataEdit } from '../slice/selector';
import { updateItem } from '../slice';

export interface EditProps {
  id?: string | number;
  editId?: string | number;
  data: EditItem;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  handleUpdate: (updateData: { value: any; id: string | number }) => void;
}

export const Edit = React.memo(function Edit({
  id,
  editId,
  data,
  isModalOpen,
  setIsModalOpen,
  handleUpdate,
}: EditProps) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [initValues, setInitValues] = useState<Record<string, any>>({});
  const [options, setOptions] = useState<any[]>();
  const globalData = useSelector(pageDetailDataEdit);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  useEffect(() => {
    if (editId && (data?.type === 'relation' || data?.type === 'relations')) {
      const fetchOptions = async () => {
        try {
          const formData = new FormData();
          if (id) formData.append('id', id.toString());
          if (data?.config)
            formData.append('config', JSON.stringify(data.config));
          const response = await pageGetOptions(formData);
          if (response.data?.data) setOptions(response.data.data);
        } catch {
          // Handle errors (if necessary)
        }
      };
      fetchOptions();
    }
  }, [data?.config, data?.type, editId, id]);

  useEffect(() => {
    let newInitValues = {};
    if (data?.type === 'block') {
      newInitValues = { [data.name]: data.convertData || [{}] };
    } else if (data?.type === 'image') {
      newInitValues = { [data.name]: data.convertData };
    } else {
      const filterValue = globalData?.find(item => item.name === data.name);
      newInitValues = filterValue
        ? { [filterValue.name]: filterValue.data }
        : {};
    }

    setInitValues(newInitValues);
    if (Object.keys(newInitValues).length > 0) {
      form.setFieldsValue(newInitValues);
    }
  }, [data, globalData, form]);

  const renderFormItem = useCallback(() => {
    switch (data?.type) {
      case 'input':
        return <FormInput name={data.name} label="" />;
      case 'textarea':
        return <FormInput name={data.name} label="" type="textarea" />;
      case 'numeric':
        return <FormInput name={data.name} label="" type="number" />;
      case 'checkbox':
        return <FormCheckbox name={data.name} label="" />;
      case 'image':
        return <FormImage name={data.name} form={form} />;
      case 'date':
        return (
          <FormDate name={data.name} fatherForm={form} forceUpdate={() => {}} />
        );
      case 'select':
      case 'multiselect':
        const storeConfig = data?.config?.store || [];
        const selectOption = storeConfig.map(([value, label]) => ({
          label,
          value,
        }));
        return (
          <FormSelect
            name={data.name}
            option={selectOption}
            multi={data.type === 'multiselect'}
          />
        );
      case 'block':
        return (
          <FormBlockDocument
            name={data.name}
            fatherForm={form}
            config={data?.config}
            forceUpdate={() => {}}
          />
        );
      case 'wysiwyg':
        return <Wysiwyg name={data.name} form={form} content="" />;
      case 'link':
        return <FormLink globalForm={form} data={data} />;
      case 'video':
        return (
          <FormVideo
            globalForm={form}
            name={data.name}
            type="asset"
            supportedTypes={form.getFieldValue(data.name)?.['allowedTypes']}
          />
        );
      case 'relation':
      case 'relations':
        return (
          <FormCascader
            type={data.type}
            name={data.name}
            fatherForm={form}
            option={options}
            isBlock={true}
            multiple={data.type === 'relations'}
            callback={(name, values) => {
              form.setFieldValue(name, values);
            }}
          />
        );
      default:
        return <div>Unsupported type</div>;
    }
  }, [data, form, options]);

  const handleSubmit = (values: any, formCallBack) => {
    if (data.type === 'link') {
      form.setFieldValue(data.name, formCallBack.getFieldValue(data.name));
    }

    const updatedValues = [
      'wysiwyg',
      'image',
      'block',
      'video',
      'link',
      'relation',
      'relations',
      'date',
    ].includes(data.type)
      ? { [data.name]: form.getFieldValue(data.name) }
      : values;

    if (editId !== undefined) {
      console.log(updatedValues, form.getFieldValue(data.name));

      handleUpdate({ value: updatedValues, id: editId });
      dispatch(updateItem({ id: editId.toString(), data: updatedValues }));
    }
    setIsModalOpen(false);
  };

  const formItems = useMemo(() => renderFormItem(), [renderFormItem]);

  return (
    <>
      <EditModal
        modalTitle="Edit"
        open={isModalOpen}
        onClose={handleCancel}
        onSubmit={handleSubmit}
        initValues={initValues}
        formItems={formItems}
        forceUpdate={() => {}}
      />
      <Form
        form={form}
        onValuesChange={() => {
          console.log(form.getFieldsValue(true));
        }}
      />
    </>
  );
});
