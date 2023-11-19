import type { FormField } from "@prisma/client";
import React from "react";
import TextRenderer from "./FormFieldRenderers/TextRenderer";
import TextAreaRenderer from "./FormFieldRenderers/TextAreaRenderer";
import SelectRenderer from "./FormFieldRenderers/SelectRenderer";
import HeadingRenderer from "./FormFieldRenderers/HeadingRenderer";
import ParagraphRenderer from "./FormFieldRenderers/ParagraphRenderer";

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
      {formField.formFieldType === "HEADING" && (
        <HeadingRenderer formField={formField} />
      )}
      {formField.formFieldType === "PARAGRAPH" && (
        <ParagraphRenderer formField={formField} />
      )}
    </>
  );
};

export default FormFieldRow;
