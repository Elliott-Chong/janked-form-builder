import type { FormField } from "@prisma/client";
import React from "react";
import TextRenderer from "./FormFieldRenderers/TextRenderer";
import TextAreaRenderer from "./FormFieldRenderers/TextAreaRenderer";
import SelectRenderer from "./FormFieldRenderers/SelectRenderer";
import HeadingRenderer from "./FormFieldRenderers/HeadingRenderer";
import ParagraphRenderer from "./FormFieldRenderers/ParagraphRenderer";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  formField: FormField;
};

const FormFieldRow = ({ formField }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: formField.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
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
    </div>
  );
};

export default FormFieldRow;
