import type { FormField } from "@prisma/client";
import React from "react";
import TextRenderer from "./FormFieldRenderers/TextRenderer";
import TextAreaRenderer from "./FormFieldRenderers/TextAreaRenderer";
import SelectRenderer from "./FormFieldRenderers/SelectRenderer";

type Props = {
  formField: FormField;
};

const FormFieldRow = ({ formField }: Props) => {
  return (
    <>
      {formField.formFieldType === "TEXT" && (
        <TextRenderer formField={formField} />
      )}
      {formField.formFieldType === "TEXTAREA" && (
        <TextAreaRenderer formField={formField} />
      )}
      {formField.formFieldType === "SELECT" && (
        <SelectRenderer formField={formField} />
      )}
    </>
  );
};

export default FormFieldRow;
