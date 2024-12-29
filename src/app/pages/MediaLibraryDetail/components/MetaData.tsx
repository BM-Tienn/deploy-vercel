import React, { useEffect, useState } from 'react';
import { List, Button, Form, Flex, Dropdown } from 'antd';
import { FormInput } from 'app/components/FormInput';
import { FormSelect } from 'app/components/FormSelect';
import { FormCheckbox } from 'app/components/FormCheckbox';
import { FormDate } from 'app/components/FormDate';
import { FormCascader } from 'app/components/FormCascader';
import { ItemProps } from 'app/slice/types';
import { getSearchTreeCascaderApi } from 'services/layoutApi';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useMediaLibraryDetailSlice } from '../slice';

export interface MetaDataProps {
  parentData?: {
    metaData?: MetaItem[];
    customSettings?: any;
    languages?: any;
    sidebar?: any;
  };
}

export interface MetaItem {
  name: string;
  language: string;
  type: string;
  data: any;
}

export function MetaData({ parentData }: MetaDataProps) {
  const [form] = Form.useForm();
  const [languages, setLanguages] = useState();
  const [documentOptions, setDocumentOptions] = useState<ItemProps[]>();
  const [assetOptions, setAssetOptions] = useState<ItemProps[]>();
  const [objectOptions, setObjectOptions] = useState<ItemProps[]>();
  const { t } = useTranslation();
  const { actions } = useMediaLibraryDetailSlice();
  const dispatch = useDispatch();

  const fetchData = async (
    type: string,
    subType?: string,
  ): Promise<ItemProps[]> => {
    const formData = new FormData();

    formData.append('type', type);
    if (subType) formData.append('subType', subType);

    try {
      const { data } = await getSearchTreeCascaderApi(formData);

      if (data?.data) {
        return data.data;
      }
      return [];
    } catch (err) {
      console.error(
        `Error fetching data for type: ${type}, subType: ${subType}`,
        err,
      );
      return [];
    }
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const assets = await fetchData('asset');
        if (assets) {
          setAssetOptions(assets);
        }

        const object = await fetchData('object');
        if (object) {
          setObjectOptions(object);
        }

        const documents = await fetchData('document');
        if (documents) {
          setDocumentOptions(documents);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchDataAsync();
  }, [parentData]);

  useEffect(() => {
    if (parentData) {
      form.setFieldsValue(parentData);
    }
    if (parentData?.languages) {
      const options = parentData?.languages?.map(item => ({
        label: item,
        value: item,
      }));
      options.push({
        label: 'None',
        value: '',
      });
      setLanguages(options);
    }
  }, [form, parentData]);

  const typeOptions = [
    { label: t('media_library.detail.meta_data.create_input'), value: 'input' },
    {
      label: t('media_library.detail.meta_data.create_checkbox'),
      value: 'checkbox',
    },
    {
      label: t('media_library.detail.meta_data.create_textarea'),
      value: 'textarea',
    },
    { label: t('media_library.detail.meta_data.create_date'), value: 'date' },
    {
      label: t('media_library.detail.meta_data.create_object'),
      value: 'object',
    },
    {
      label: t('media_library.detail.meta_data.create_document'),
      value: 'document',
    },
    { label: t('media_library.detail.meta_data.create_asset'), value: 'asset' },
  ];

  const handleAdd = (type: string) => {
    form.setFieldsValue({
      metaData: [
        ...(form.getFieldValue('metaData') || []),
        { name: '', language: '', type: type, data: '' },
      ],
    });
  };

  const menuItems = typeOptions.map(option => ({
    label: option.label,
    key: option.value,
    onClick: () => handleAdd(option.value),
  }));

  const callbackFormCascader = (name, value) => {
    form.setFieldValue(name, value);
    updateMetaData();
  };

  const updateMetaData = () => {
    const updatedMetaData = form.getFieldValue('metaData') || [];
    if (updatedMetaData.length > 0) {
      dispatch(actions.setMetaData(updatedMetaData));
    }
  };

  return (
    <Form name="meta_data_form" form={form} onValuesChange={updateMetaData}>
      <Form.List name="metaData">
        {(fields, { add, remove }) => (
          <>
            <Dropdown
              className="max-w-20 bg-blue-600 text-rose-50 mt-5"
              menu={{ items: menuItems }}
              trigger={['click']}
            >
              <Button type="dashed" block>
                {t('media_library.detail.meta_data.create')}
              </Button>
            </Dropdown>

            {fields.map(({ key, name }, index) => {
              const type = form.getFieldValue([
                'metaData',
                String(name),
                'type',
              ]);

              return (
                <List.Item
                  key={key}
                  actions={[
                    <Button danger onClick={() => remove(name)}>
                      {t('media_library.detail.meta_data.delete')}
                    </Button>,
                  ]}
                >
                  <Flex gap={10} align="center">
                    <FormInput
                      name={[String(name), 'name']}
                      label={t('media_library.detail.meta_data.title_name')}
                      isBlock={false}
                    />
                    <FormSelect
                      name={[String(name), 'language']}
                      label={t('media_library.detail.meta_data.title_language')}
                      option={languages}
                    />
                    <FormInput
                      name={[String(name), 'type']}
                      label={t('media_library.detail.meta_data.title_type')}
                      isBlock={false}
                      readOnly={true}
                    />
                    {type === 'checkbox' && (
                      <FormCheckbox
                        name={[String(name), 'data']}
                        label={t('media_library.detail.meta_data.title_data')}
                      />
                    )}
                    {type === 'textarea' && (
                      <FormInput
                        name={[String(name), 'data']}
                        label={t('media_library.detail.meta_data.title_data')}
                        type="textarea"
                        isBlock={false}
                      />
                    )}
                    {type === 'input' && (
                      <FormInput
                        name={[String(name), 'data']}
                        label={t('media_library.detail.meta_data.title_data')}
                        isBlock={false}
                      />
                    )}
                    {type === 'date' && (
                      <FormDate
                        name={['metaData', String(name), 'data']}
                        label={t('media_library.detail.meta_data.title_data')}
                        fatherForm={form}
                      />
                    )}
                    {type === 'object' && (
                      <FormCascader
                        name={['metaData', String(name), 'data']}
                        title={t('media_library.detail.meta_data.title_data')}
                        isBlock={true}
                        fatherForm={form}
                        option={objectOptions}
                        type="relation"
                        callback={callbackFormCascader}
                      />
                    )}
                    {type === 'document' && (
                      <FormCascader
                        name={['metaData', String(name), 'data']}
                        title={t('media_library.detail.meta_data.title_data')}
                        isBlock={true}
                        fatherForm={form}
                        option={documentOptions}
                        type="relation"
                        callback={callbackFormCascader}
                      />
                    )}
                    {type === 'asset' && (
                      <FormCascader
                        name={['metaData', String(name), 'data']}
                        title={t('media_library.detail.meta_data.title_data')}
                        isBlock={true}
                        fatherForm={form}
                        option={assetOptions}
                        type="relation"
                        callback={callbackFormCascader}
                      />
                    )}
                  </Flex>
                </List.Item>
              );
            })}
          </>
        )}
      </Form.List>
    </Form>
  );
}
