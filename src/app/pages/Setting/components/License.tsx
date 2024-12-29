// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { Card, Space, Button, Flex, Tag } from 'antd';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';

export interface LicenseProps {
  activeTab: string;
  setActiveTab: (key: string) => void;
}

export function License({ setActiveTab }: LicenseProps) {
  return (
    <Card>
      <Card.Meta
        title="License Status"
        description={
          <>
            <Flex vertical gap={16}>
              <Space direction="vertical" size={4}>
                <Space>
                  <span>Current Plan</span>
                  <Tag color="gold">Free</Tag>
                </Space>
                <Space>
                  <span>End of plan</span>
                  <div className="font-semibold">∞</div>
                </Space>
              </Space>
              <Space>
                <Button
                  type="primary"
                  onClick={event => window.open('/', '_blank')}
                  icon={<HomeOutlined />}
                >
                  Go to CMS
                </Button>
                <Button
                  icon={<SettingOutlined />}
                  onClick={event => setActiveTab('data')}
                >
                  Configure
                </Button>
              </Space>
            </Flex>
          </>
        }
      />
    </Card>
  );
}
