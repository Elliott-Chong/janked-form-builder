import type { FormField, FormValue } from "@prisma/client";
import React from "react";

type Props = {
  formValue: FormValue & {
    formField: FormField;
  };
};

const ParagraphRenderer = ({ formValue }: Props) => {
  return (
    <>
      <p
        className="text-sm text-gray-600"
        dangerouslySetInnerHTML={{ __html: formValue.formField.name }}
      ></p>
    </>
  );
};

export default ParagraphRenderer;
