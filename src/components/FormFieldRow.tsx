import type { FormField } from "@prisma/client";
import React from "react";
import TextRenderer from "./FormFieldRenderers/TextRenderer";
import TextAreaRenderer from "./FormFieldRenderers/TextAreaRenderer";
import SelectRenderer from "./FormFieldRenderers/SelectRenderer";
import HeadingRenderer from "./FormFieldRenderers/HeadingRenderer";
import ParagraphRenderer from "./FormFieldRenderers/ParagraphRenderer";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "./ui/button";
import Modal from "./Modal";
import CustomValidation from "./CustomValidation";

type Props = {
  formField: FormField;
};

const FormFieldRow = ({ formField }: Props) => {
  const [open, setOpen] = React.useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: formField.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <>
      <Modal
        open={open}
        setOpen={setOpen}
      ><CustomValidation formField={formField} setOpen={setOpen} /></Modal>
      <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
        {formField.isInput && (

          <Button size='xs' className="mb-2" onClick={() => setOpen(true)}>Custom Validation</Button>
        )}
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
    </>
  );
};

export default FormFieldRow;
