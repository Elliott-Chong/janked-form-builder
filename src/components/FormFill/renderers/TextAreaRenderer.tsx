import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormField, FormValue } from "@prisma/client";
import React from "react";

type Props = {
  formValue: FormValue & {
    formField: FormField;
  };
};

const TextAreaRenderer = ({ formValue }: Props) => {
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
      <Textarea
        required={formValue.formField.required}
        placeholder="Enter your answer here..."
        onChange={(e) => {
          formValue.value = e.target.value;
        }}
      />
    </div>
  );
};

export default TextAreaRenderer;
