import { MiniForm } from 'app/pages/ObjectDetail/components/LinkForm/component/MiniForm';
import { FormInstance } from 'antd';

export interface FormLinkProps {
  data: any;
  required?: boolean;
  globalForm: FormInstance;
  parentName?: string | string[];
  customItem?: string;
  isBlock?: boolean;
}

export function FormLink({
  data,
  required,
  globalForm,
  parentName,
  customItem = 'name',
  isBlock = false,
}: FormLinkProps) {
  const name = parentName
    ? [...parentName, data?.[customItem] ?? '']
    : data?.[customItem] ?? '';

  //custom name với block document
  if (isBlock && Array.isArray(name)) {
    name?.splice(0, 1);
  }

  return (
    <>
      <div className="flex flex-col">
        <span className="text-sm text-slate-400">
          {data.title}
          {required && <i className="ml-[4px] fa-solid fa-circle-info"></i>}
        </span>
        <MiniForm globalForm={globalForm} name={name} />
      </div>
    </>
  );
}
