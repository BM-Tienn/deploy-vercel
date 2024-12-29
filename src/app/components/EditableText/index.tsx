import { Input } from 'antd';
import React, { useEffect, useState } from 'react';

export interface EditableTextProps {
  initialValue: string | undefined;
  onSave?: (newValue: string) => void;
}

export function EditableText({ initialValue, onSave }: EditableTextProps) {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setValue(e.target.value);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);

    if (onSave && value) onSave(value);
  };

  return (
    <span>
      {isEditing ? (
        <Input
          className="font-semibold text-lg border p-1"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <span
          className="font-semibold text-lg cursor-pointer min-x-10"
          onClick={() => setIsEditing(true)}
        >
          {value}
        </span>
      )}
    </span>
  );
}
