import React, { ReactElement, useState } from 'react';
import { cn } from 'utils/tailwind';

export interface CollapseProps {
  title: string;
  children?: ReactElement;
  bgColor?: string;
}

export function Collapse({ title, children, bgColor }: CollapseProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      className={cn(
        'p-4 flex flex-col gap-4 bg-[#ffffff] rounded-2xl h-[48px] transition-all duration-300 overflow-hidden',

        bgColor && `bg-[${bgColor}] h-[40px] p-3 `,
        open && 'h-fit',
      )}
    >
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          'flex cursor-pointer items-center justify-between',
          bgColor && '[&>*]:text-sm [&>*]:leading-[14px]',
        )}
      >
        <h6 className="text-base font-semibold leading-4">{title}</h6>
        <i
          className={cn(
            'fa-solid fa-chevron-up transition-all duration-300',
            open && 'rotate-180',
          )}
        ></i>
      </div>

      <div className={cn(' flex-col gap-4 flex transition-all duration-300')}>
        {children}
      </div>
    </div>
  );
}
