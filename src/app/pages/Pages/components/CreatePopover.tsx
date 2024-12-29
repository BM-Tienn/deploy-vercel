import { Button, Popover } from 'antd';
import React, { useState } from 'react';
import Icon from '@mdi/react';
import {
  mdiFileDocumentPlusOutline,
  mdiFileCodeOutline,
  mdiLink,
  mdiLinkVariant,
} from '@mdi/js';
import { CreateModal } from './CreateModal';
import { useTranslation } from 'react-i18next';
export interface CreatePopoverProps {
  parentId?: number;
}

export function CreatePopover({ parentId }: CreatePopoverProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  return (
    <Popover
      placement="bottom"
      overlayInnerStyle={{ padding: 0 }}
      open={open}
      onOpenChange={(newOpen: boolean) => {
        setOpen(newOpen);
      }}
      content={
        <div className="p-2 flex flex-col gap-1">
          <CreateModal
            parentId={parentId}
            type="Page"
            modalTitle={t('pages.modal.title.page')}
          >
            <Button
              type="text"
              className="w-full justify-start capitalize flex py-2 px-3 items-center rounded-[0.5rem] gap-2"
            >
              <Icon path={mdiFileDocumentPlusOutline} size={0.75} />
              {t('pages.modal.add.page')}
            </Button>
          </CreateModal>
          <CreateModal
            parentId={parentId}
            type="Snippet"
            modalTitle={t('pages.modal.title.snippet')}
          >
            <Button
              type="text"
              className="w-full justify-start capitalize flex py-2 px-3 items-center rounded-[0.5rem] gap-2"
            >
              <Icon path={mdiFileCodeOutline} size={0.75} />
              {t('pages.modal.add.snippet')}
            </Button>
          </CreateModal>

          <CreateModal
            parentId={parentId}
            type="Link"
            modalTitle={t('pages.modal.title.link')}
          >
            <Button
              type="text"
              className="w-full justify-start capitalize flex py-2 px-3 items-center rounded-[0.5rem] gap-2"
            >
              <Icon path={mdiLink} size={0.75} />
              {t('pages.modal.add.link')}
            </Button>
          </CreateModal>

          <CreateModal
            parentId={parentId}
            type="Hardlink"
            modalTitle={t('pages.modal.title.hard_link')}
          >
            <Button
              type="text"
              className="w-full justify-start capitalize flex py-2 px-3 items-center rounded-[0.5rem] gap-2"
            >
              <Icon path={mdiLinkVariant} size={0.75} />
              {t('pages.modal.add.hard_link')}
            </Button>
          </CreateModal>
        </div>
      }
      trigger="click"
    >
      <Button type="primary" className="flex h-9 items-center px-[20px] gap-3">
        <i className="fa-solid fa-plus"></i>
        {t('pages.modal.submit')}
      </Button>
    </Popover>
  );
}
