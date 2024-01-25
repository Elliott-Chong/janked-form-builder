import { Label } from "@/components/ui/label";
import type { FormField, FormValue } from "@prisma/client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  formValue: FormValue & {
    formField: FormField;
  };
};

const SelectRenderer = ({ formValue, ...props }: Props) => {
  const options = JSON.parse(
    formValue.formField.options! ?? '[""]',
  ) as string[];
  return (
    <div>
      <Label>
        {formValue.formField.name}
        {formValue.formField.required && (
          <span className="text-red-600">*</span>
        )}
      </Label>
      <p className="text-xs text-gray-500">{formValue.formField.description}</p>
      <div className="h-2"></div>
      <Select
        required={formValue.formField.required}
        onValueChange={(e) => {
          formValue.value = e;
        }}
        {...props}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an answer" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            return (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectRenderer;
