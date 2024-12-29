import { SettingOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Flex, Form, Row, Space } from 'antd';
import { permissionDefault } from 'app/components/Permission/components/LayoutTables';
import { PermissionItem } from 'app/components/Permission/constant';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { siteMapGetSetting, siteMapPostSetting } from 'services/sitemapApi';

export interface SettingProps {
  permission?: PermissionItem;
  isAdmin?: boolean;
}

export function Setting({
  permission = permissionDefault,
  isAdmin,
}: SettingProps) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [checkAllClasses, setCheckAllClasses] = useState(false);
  const [checkAllDocuments, setCheckAllDocuments] = useState(false);

  const checkIfAllChecked = useCallback(
    (fieldKey: string | string[], itemName: 'check' | 'generateSitemap') => {
      const checkAll = form.getFieldValue(fieldKey) || [];
      return checkAll.every((item: any) => item?.[itemName] === true);
    },
    [form],
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await siteMapGetSetting();
        if (data?.data) {
          form.setFieldsValue(data);
          const allCheckedClasses = checkIfAllChecked(
            ['data', 'classes'],
            'check',
          );
          setCheckAllClasses(allCheckedClasses);

          const allCheckedDocuments = checkIfAllChecked(
            ['data', 'documents'],
            'generateSitemap',
          );
          setCheckAllDocuments(allCheckedDocuments);
        }
      } catch ({ response }) {
        getMessage(response?.data);
      }
    })();
  }, [checkIfAllChecked, form]);

  const toggleCheckAll = (
    fieldKey: string | string[],
    itemName: 'check' | 'generateSitemap',
    checked: boolean,
  ) => {
    if (itemName === 'check') {
      setCheckAllClasses(checked);
    } else {
      setCheckAllDocuments(checked);
    }
    const newData = form.getFieldValue(fieldKey).map((item: any) => ({
      ...item,
      [itemName]: checked,
    }));
    form.setFieldValue(fieldKey, newData);
  };

  const handleSubmit = async () => {
    if (isAdmin || permission?.save) {
      try {
        const formData = new FormData();
        formData.append(
          'classes',
          JSON.stringify(form.getFieldValue(['data', 'classes'])),
        );
        formData.append(
          'documents',
          JSON.stringify(form.getFieldValue(['data', 'documents'])),
        );
        const { data } = await siteMapPostSetting(formData);
        getMessage(data);
      } catch ({ response }) {
        getMessage(response?.data);
      }
    }
  };

  return (
    <Card style={{ marginTop: 20 }}>
      <Row>
        <Col span={24}>
          <Form form={form} onFinish={handleSubmit}>
            <h2>{t('sitemap.setting.object')}</h2>
            <Form.List name={['data', 'classes']}>
              {fields => (
                <Flex wrap>
                  <Checkbox
                    style={{
                      marginBottom: 8,
                      margin: '5px',
                    }}
                    checked={checkAllClasses}
                    onChange={e =>
                      toggleCheckAll(
                        ['data', 'classes'],
                        'check',
                        e.target.checked,
                      )
                    }
                  >
                    {checkAllClasses
                      ? t('sitemap.setting.uncheckAll')
                      : t('sitemap.setting.checkAll')}
                  </Checkbox>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                      key={key}
                      style={{
                        display: 'flex',
                        marginBottom: 8,
                        margin: '5px',
                      }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'check']}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox
                          onChange={() => {
                            const allChecked = checkIfAllChecked(
                              ['data', 'classes'],
                              'check',
                            );
                            setCheckAllClasses(allChecked);
                          }}
                          checked={form.getFieldValue([
                            'data',
                            'classes',
                            name,
                            'check',
                          ])}
                        >
                          {form.getFieldValue([
                            'data',
                            'classes',
                            name,
                            'name',
                          ])}
                        </Checkbox>
                      </Form.Item>
                    </Space>
                  ))}
                </Flex>
              )}
            </Form.List>

            <h2>{t('sitemap.setting.document')}</h2>
            <Form.List name={['data', 'documents']}>
              {fields => (
                <Flex wrap>
                  <Checkbox
                    style={{
                      marginBottom: 8,
                      margin: '5px',
                    }}
                    checked={checkAllDocuments}
                    onChange={e =>
                      toggleCheckAll(
                        ['data', 'documents'],
                        'generateSitemap',
                        e.target.checked,
                      )
                    }
                  >
                    {checkAllDocuments
                      ? t('sitemap.setting.uncheckAll')
                      : t('sitemap.setting.checkAll')}
                  </Checkbox>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                      key={key}
                      style={{
                        display: 'flex',
                        marginBottom: 8,
                        margin: '5px',
                      }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'generateSitemap']}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox
                          onChange={() => {
                            const allChecked = checkIfAllChecked(
                              ['data', 'documents'],
                              'generateSitemap',
                            );
                            setCheckAllDocuments(allChecked);
                          }}
                          checked={form.getFieldValue([
                            'data',
                            'documents',
                            name,
                            'generateSitemap',
                          ])}
                        >
                          {form.getFieldValue([
                            'data',
                            'documents',
                            name,
                            'key',
                          ])}
                        </Checkbox>
                      </Form.Item>
                    </Space>
                  ))}
                </Flex>
              )}
            </Form.List>
            {(isAdmin || permission?.save) && (
              <Button
                icon={<SettingOutlined />}
                type="primary"
                htmlType="submit"
                style={{ marginTop: 20 }}
              >
                {t('sitemap.setting.save')}
              </Button>
            )}
          </Form>
        </Col>
      </Row>
    </Card>
  );
}
