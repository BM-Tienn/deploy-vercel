import React, { useRef, useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import AceEditor from 'react-ace';

export interface PreviewProps {
  data?: {
    creationDate: string;
    fileSize: string;
    fileType: string;
    filename: string;
    id: number;
    mimetype: string;
    modificationDate: string;
    path: string;
    publicURL: string;
    type: string;
    height?: number;
    width?: number;
    thumbnail: string;
  };
}

export function Preview({ data }: PreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Video player setup
    if (data?.type === 'video' && videoRef.current && !playerRef.current) {
      const videoElement = videoRef.current;
      const validMimeTypes = ['video/mp4', 'video/webm', 'video/ogg'];

      if (!validMimeTypes.includes(data.mimetype)) {
        setIsSupported(false);
      } else {
        const canPlay = videoElement.canPlayType(data.mimetype);

        if (canPlay === '') {
          setIsSupported(false);
        } else {
          setIsSupported(true);
          playerRef.current = videojs(videoRef.current, {
            controls: true,
            autoplay: false,
            preload: 'auto',
            sources: [{ src: data.publicURL, type: data.mimetype }],
          });
        }
      }
    }

    // For text-based files (.txt, .sql, .html)
    if (data?.type === 'text') {
      fetch(data.publicURL)
        .then(response => response.text())
        .then(text => setFileContent(text))
        .catch(() => setFileContent(null));
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [data]);

  const handleContentChange = (newContent: string) => {
    setFileContent(newContent);
  };

  const renderFilePreview = () => {
    if (data?.type === 'image') {
      return (
        <Flex className="p-5">
          <img
            src={data?.thumbnail}
            alt={data?.filename}
            className="max-w-full"
            style={{ maxHeight: '750px' }}
          />
        </Flex>
      );
    }

    if (data?.type === 'video' && !isSupported) {
      return (
        <Flex className="p-5 text-center">
          <p>{t('media_library.detail.video_not_support')}</p>
        </Flex>
      );
    }

    if (data?.type === 'video' && isSupported) {
      return (
        <Flex className="p-5">
          <div data-vjs-player>
            <video
              ref={videoRef}
              className="video-js vjs-big-play-centered"
              width="640"
              height="360"
              controls
            ></video>
          </div>
        </Flex>
      );
    }

    if (data?.mimetype === 'application/pdf') {
      return (
        <Flex className="p-5">
          <embed
            src={data?.publicURL}
            width="100%"
            height="780px"
            type="application/pdf"
          />
        </Flex>
      );
    }

    if (
      data?.mimetype === 'application/msword' ||
      data?.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return (
        <Flex className="p-5">
          <iframe
            title={data?.filename}
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${data?.publicURL}`}
            width="100%"
            height="780px"
          />
        </Flex>
      );
    }

    if (
      data?.mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      data?.mimetype === 'application/vnd.ms-excel'
    ) {
      return (
        <Flex className="p-5">
          <iframe
            title={data?.filename}
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${data?.publicURL}`}
            width="100%"
            height="780px"
          />
        </Flex>
      );
    }

    if (data?.mimetype === 'text/plain') {
      return (
        <Flex className="p-5">
          <iframe
            title={data?.filename}
            src={data?.publicURL}
            width="100%"
            height="780px"
          />
        </Flex>
      );
    }

    if (
      data?.mimetype ===
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ) {
      return (
        <Flex className="p-5">
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${data?.publicURL}`}
            width="100%"
            height="780px"
            title={data?.filename}
          />
        </Flex>
      );
    }

    // Handle text files (e.g., .txt, .sql, .html)
    if (data?.type === 'text') {
      return (
        <Flex className="p-5">
          <AceEditor
            mode="text" // Can be set to other modes like sql, html, etc.
            theme="chrome"
            value={fileContent || ''}
            onChange={handleContentChange}
            name="editor"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="780px"
            setOptions={{
              wrap: true,
              showPrintMargin: false,
            }}
          />
        </Flex>
      );
    }

    return null;
  };

  return <>{renderFilePreview()}</>;
}
