import type { FormField, FormValue } from "@prisma/client";
import React from "react";

type Props = {
  formValue: FormValue & {
    formField: FormField;
  };
};

const HeadingRenderer = ({ formValue }: Props) => {
  return (
    <>
      <h1 className="leadning-none text-2xl font-semibold">
        {formValue.formField.name}
      </h1>
    </>
  );
};

export default HeadingRenderer;
