import * as React from 'react';
import { Link } from 'react-router-dom';

export interface BreadCrumbProps {
  prevName: string;
  pageName: string;
}

export function BreadCrumb({ prevName, pageName }: BreadCrumbProps) {
  return (
    <div className="flex items-center gap-2 ">
      <Link
        to={'/' + prevName}
        className="text-sm font-medium capitalize p-0 text-[#6A1B9A]"
      >
        {prevName}
      </Link>
      <span className="text-[10px] text-[#919EAB]">
        <i className="fa-solid fa-chevron-right"></i>
      </span>
      <span className="text-sm font-medium capitalize text-[#919EAB]">
        {pageName}
      </span>
    </div>
  );
}
