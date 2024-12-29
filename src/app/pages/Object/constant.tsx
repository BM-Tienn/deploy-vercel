import { Flex, Switch, Tag } from 'antd';

export const columnTypes = {
  id: 'number',
  key: 'string',
  published: 'published',
  modificationDate: 'date',
  creationDate: 'date',
};

export const renderConfig: Record<
  string,
  (
    value: any,
    record: any,
    index: number,
    callback?: (record: any) => void,
  ) => JSX.Element
> = {
  system: (_, record, index, callback) => (
    <span onClick={() => callback?.(record)}>{record}</span>
  ),
  image: (_, record, index, callback) =>
    Array.isArray(record) && record[0]?.path ? (
      <img
        onClick={() => callback?.(record[0])}
        alt=""
        src={record[0].path}
        className="w-full h-full object-contain"
      />
    ) : (
      <></>
    ),
  imageGallery: (_, record, index, callback) =>
    Array.isArray(record) ? (
      <Flex className="image-grid" vertical>
        {record
          .filter(item => item?.path)
          .map((item, i) => (
            <img
              key={i}
              onClick={() => callback?.(item)}
              alt=""
              src={item.path}
              className="w-full h-full object-contain"
            />
          ))}
      </Flex>
    ) : (
      <></>
    ),
  published: (_, record, index, callback) => (
    <Tag
      onClick={() => callback?.(record)}
      className="capitalize"
      color={record === 'Publish' ? 'green' : 'volcano'}
      key={record}
    >
      {record}
    </Tag>
  ),
  textarea: (_, record, index, callback) => (
    <article
      onClick={() => callback?.(record)}
      style={{ maxHeight: 200, overflow: 'auto' }}
    >
      {record}
    </article>
  ),
  default: (_, record, index, callback) => (
    <span onClick={() => callback?.(record)}>{record}</span>
  ),
  numeric: (_, record, index, callback) => (
    <span onClick={() => callback?.(record)}>{record}</span>
  ),
  date: (_, record, index, callback) => (
    <span onClick={() => callback?.(record)}>{record}</span>
  ),
  checkbox: (_, record, index, callback) => (
    <Switch disabled onClick={() => callback?.(record)} value={record} />
  ),
  input: (_, record, index, callback) => (
    <span onClick={() => callback?.(record)}>{record}</span>
  ),
  select: (_, record, index, callback) => (
    <span onClick={() => callback?.(record)}>{record}</span>
  ),
  manyToOneRelation: (_, record, index, callback) => (
    <Tag
      onClick={() => callback?.(record)}
      className="capitalize"
      key={record?.key + index}
    >
      {record?.key}
    </Tag>
  ),
  manyToManyRelation: (_, record, index, callback) =>
    Array.isArray(record) ? (
      <Flex className="ralation" vertical>
        {record
          .filter(item => item?.path)
          .map((item, i) => (
            <Tag
              onClick={() => callback?.(record)}
              className="capitalize"
              key={item?.key + i}
            >
              {item?.key}
            </Tag>
          ))}
      </Flex>
    ) : (
      <></>
    ),
  manyToManyObjectRelation: (_, record, index, callback) =>
    Array.isArray(record) ? (
      <Flex className="ralation" vertical>
        {record
          .filter(item => item?.path)
          .map((item, i) => (
            <Tag
              onClick={() => callback?.(record)}
              className="capitalize"
              key={item?.key + i}
            >
              {item?.key}
            </Tag>
          ))}
      </Flex>
    ) : (
      <></>
    ),
  wysiwyg: (_, record, index, callback) => (
    <article
      onClick={() => callback?.(record)}
      dangerouslySetInnerHTML={{ __html: record }}
      style={{ maxHeight: 200, overflow: 'auto' }}
    />
  ),
  link: (_, record, index, callback) => (
    <span onClick={() => callback?.(record)}>{record?.path}</span>
  ),
  firstname: (_, record, index, callback) => (
    <span onClick={() => callback?.(record)}>{record}</span>
  ),
  lastname: (_, record, index, callback) => (
    <span onClick={() => callback?.(record)}>{record}</span>
  ),
  gender: (_, record, index, callback) => (
    <span onClick={() => callback?.(record)}>{record}</span>
  ),
  email: (_, record, index, callback) => (
    <span onClick={() => callback?.(record)}>{record}</span>
  ),
  urlSlug: (_, record, index, callback) => (
    <span onClick={() => callback?.(record)}>{record}</span>
  ),
  datetime: (_, record, index, callback) => (
    <span onClick={() => callback?.(record)}>{record}</span>
  ),
  video: (_, record, index, callback) => {
    const type = record?.type;
    if (type) {
      const srcFilter = (type: any) => {
        switch (type) {
          case 'vimeo':
            return 'https://player.vimeo.com/video/' + record?.path;
          case 'youtube':
            return 'https://www.youtube.com/embed/' + record?.path;

          case 'dailymotion':
            return 'https://www.dailymotion.com/embed/video/' + record?.path;

          default:
            return '';
        }
      };

      if (type !== 'asset') {
        return (
          <iframe
            width="320"
            height="200"
            src={srcFilter(type)}
            title="Preview Asset"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        );
      }

      return (
        <video
          onClick={() => callback?.(record)}
          className="w-full h-full"
          src={record.path}
          controls
        ></video>
      );
    }
    return <></>;
  },
  hotspotimage: (_, record, index, callback) => (
    <span onClick={() => callback?.(record)}>{record}</span>
  ),
  externalImage: (_, record, index, callback) => (
    <span onClick={() => callback?.(record)}>{record}</span>
  ),
  rgbaColor: (_, record, index, callback) => (
    <span onClick={() => callback?.(record)}>{record}</span>
  ),
};
