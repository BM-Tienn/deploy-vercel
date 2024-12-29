import React, { useEffect, useState } from 'react';
import { Tabs, Skeleton, Space } from 'antd';
import XMLViewer from 'react-xml-viewer';
import { PermissionItem } from 'app/components/Permission/constant';
import { useTranslation } from 'react-i18next';

export interface PreviewProps {
  permission?: PermissionItem;
  isAdmin?: boolean;
}

export function Preview({ permission, isAdmin }: PreviewProps) {
  const { t } = useTranslation();
  const [sitemapLinks, setSitemapLinks] = useState<string[]>([]);
  const [xmlRootContent, setXmlRootContent] = useState<Document | null>(null);
  const [sitemapContents, setSitemapContents] = useState<
    Record<string, string>
  >({}); // Store XML content for each link
  const [subLinks, setSubLinks] = useState<string[]>([]);
  const [xmlSubLinkContent, setXmlSubLinkContent] = useState<Document | null>(
    null,
  );
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/sitemap.xml`,
          {
            headers: { 'Content-Type': 'application/xml' },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');

        if (xml.querySelector('parsererror')) {
          throw new Error('Error parsing XML');
        }

        const locElements = Array.from(xml.querySelectorAll('loc')).map(
          loc => loc.textContent || '',
        );
        setXmlRootContent(xml);
        setSitemapLinks(locElements);

        const contents: Record<string, string> = {};
        for (const link of locElements) {
          try {
            const res = await fetch(link, {
              mode: 'no-cors',
            });
            const content = await res.text();
            contents[link] = content;
          } catch (err) {
            console.error(`Failed to fetch content for ${link}:`, err);
          }
        }
        setSitemapContents(contents);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSitemap();
  }, []);

  const handleRootClick = (link: string) => {
    const content = sitemapContents[link];
    const parser = new DOMParser();
    const xml = parser.parseFromString(content, 'application/xml');
    const locElements = Array.from(xml.querySelectorAll('loc')).map(
      loc => loc.textContent || '',
    );
    setXmlSubLinkContent(xml);
    setSubLinks(locElements);
    setIframeSrc('');
  };

  const handleSubClick = (link: string) => {
    setIframeSrc(link);
  };

  const renderRootXml = [
    {
      key: 'root',
      label: t('sitemap.preview.root_label'),
      children: (
        <div
          style={{
            background: '#f8f9fa',
            padding: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            maxHeight: '200px',
            overflowY: 'auto',
            width: '100%',
          }}
        >
          <h3>
            {t('sitemap.preview.root_title')}:{' '}
            {`${process.env.REACT_APP_API_URL}/sitemap.xml`}
          </h3>
          <ul>
            {sitemapLinks.map((link, index) => (
              <li key={index}>
                <a
                  href="?"
                  onClick={e => {
                    e.preventDefault();
                    handleRootClick(link);
                  }}
                  style={{ color: '#007bff', textDecoration: 'none' }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      key: 'root_xml',
      label: t('sitemap.preview.root_xml'),
      children: (
        <div
          style={{
            background: '#f8f9fa',
            padding: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            maxHeight: '400px',
            overflowY: 'auto',
            width: '100%',
          }}
        >
          <XMLViewer
            xml={
              xmlRootContent
                ? new XMLSerializer().serializeToString(xmlRootContent)
                : '<error>Failed to load content</error>'
            }
          />
        </div>
      ),
    },
  ];

  const renderSubLinkXml = [
    {
      key: 'sub',
      label: t('sitemap.preview.sub_label'),
      children: (
        <div
          style={{
            background: '#f8f9fa',
            padding: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            maxHeight: '200px',
            overflowY: 'auto',
            width: '100%',
          }}
        >
          <h3>{t('sitemap.preview.sub_title')}:</h3>
          <ul>
            {subLinks.map((link, index) => (
              <li key={index}>
                <a
                  href="?"
                  onClick={e => {
                    e.preventDefault();
                    handleSubClick(link);
                  }}
                  style={{ color: '#007bff', textDecoration: 'none' }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      key: 'sub_xml',
      label: t('sitemap.preview.sub_xml'),
      children: (
        <div
          style={{
            background: '#f8f9fa',
            padding: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            maxHeight: '400px',
            overflowY: 'auto',
            width: '100%',
          }}
        >
          <XMLViewer
            xml={
              xmlSubLinkContent
                ? new XMLSerializer().serializeToString(xmlSubLinkContent)
                : '<error>Failed to load content</error>'
            }
          />
        </div>
      ),
    },
  ];

  const renderIframe = [
    {
      key: 'iframe',
      label: t('sitemap.preview.iframe'),
      children: (
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            height: '400px',
            width: '100%',
          }}
        >
          <iframe
            src={iframeSrc || undefined}
            title={t('sitemap.preview.iframe')}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <Tabs defaultActiveKey="root" items={renderRootXml} />

          {subLinks.length > 0 && (
            <Tabs defaultActiveKey="sub" items={renderSubLinkXml} />
          )}

          {iframeSrc && <Tabs defaultActiveKey="iframe" items={renderIframe} />}
        </>
      )}
    </Space>
  );
}
