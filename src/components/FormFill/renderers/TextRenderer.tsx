import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormField, FormValue } from "@prisma/client";
import React from "react";

type Props = {
  formValue: FormValue & {
    formField: FormField;
  };
};

const TextRenderer = ({ formValue, ...props }: Props) => {
  return (
    <>
      <div>
        <Label>
          {formValue.formField.name}
          {formValue.formField.required && (
            <span className="text-red-600">*</span>
          )}
        </Label>
        <p className="text-xs text-gray-500">
          {formValue.formField.description}
        </p>
        <div className="h-2"></div>
        <Input
          required={formValue.formField.required}
          placeholder="Enter your answer here..."
          onChange={(e) => {
            formValue.value = e.target.value;
          }}
          {...props}
        />
      </div>
    </>
  );
};

export default TextRenderer;
