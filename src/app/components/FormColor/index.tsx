import React, { useEffect, useState } from 'react';
import { ColorPicker, Flex } from 'antd';
import Form, { FormInstance, Rule } from 'antd/es/form';
import type { ColorPickerProps, GetProp } from 'antd';

type Color = GetProp<ColorPickerProps, 'value'>;

export interface FormColorProps {
  required?: boolean;
  placeholder?: string;
  rules?: Rule[];
  name: string | string[];
  label: string;
  readOnly?: boolean;
  fatherForm: FormInstance;
}

// Helper to convert color to hex string
function colorToHexString(color: Color): string {
  if (typeof color === 'string') return color; // If already hex
  if (typeof color === 'object' && 'toRgb' in color) {
    const { r, g, b } = color.toRgb();
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
  return '#000000'; // Fallback to black if color format is not as expected
}

export function FormColor({
  required,
  rules,
  name,
  label,
  readOnly,
  fatherForm,
}: FormColorProps) {
  const [color, setColor] = useState<string>(fatherForm.getFieldValue(name));

  useEffect(() => {
    // Cập nhật giá trị của color khi form cha thay đổi
    setColor(fatherForm.getFieldValue(name));
  }, [fatherForm, name]);

  const handleColorChange = (value: Color) => {
    const hexColor = colorToHexString(value); // Convert to hex format
    setColor(hexColor);
    fatherForm.setFieldValue(name, hexColor); // Update form with hex color
  };

  return (
    <Flex vertical align="start">
      <span className="text-sm text-slate-400">
        {label}
        {required && <i className="ml-[4px] fa-solid fa-circle-info"></i>}
      </span>
      <ColorPicker
        value={color}
        onChange={handleColorChange}
        showText
        disabled={readOnly} // Disable if readOnly is true
      />
      <Form.Item
        name={name}
        className="mb-0"
        rules={rules}
        required={required}
      />
    </Flex>
  );
}
