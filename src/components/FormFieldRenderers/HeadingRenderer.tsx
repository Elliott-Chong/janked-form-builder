import type { FormField } from "@prisma/client";
import { Heading1, Pencil, Trash2 } from "lucide-react";
import React from "react";
import { Label } from "../ui/label";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { Input } from "../ui/input";

type Props = { formField: FormField };

const HeadingRenderer = ({ formField }: Props) => {
  const utils = api.useUtils();
  const labelRef = React.useRef<HTMLLabelElement>(null);
  const saveField = api.form.saveField.useMutation();
  const deleteField = api.form.deleteField.useMutation();
  return (
    <>
      <div className="rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-700">
        <div className="flex items-center">
          <span className="mr-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500/10">
            <Heading1 className="mr-1 h-4 w-4" />
            Heading
          </span>
        </div>
        <div className="h-4"></div>
        <div className="flex items-center">
          <Label
            className="text-3xl font-semibold"
            ref={labelRef}
            onBlur={(e) => {
              saveField
                .mutateAsync({
                  description: "",
                  fieldId: formField.id,
                  name: e.currentTarget.textContent ?? "",
                  required: false,
                })
                .catch(console.error);
            }}
            suppressContentEditableWarning
            contentEditable
          >
            {formField.name}
          </Label>
          <Pencil
            onClick={() => {
              labelRef.current?.focus();
            }}
            className="ml-2 h-4 w-4 cursor-pointer"
          />
          <Trash2
            className="ml-1 h-4 w-4 cursor-pointer text-red-600"
            onClick={() => {
              const confirm = window.confirm(
                "Are you sure you want to delete this field?",
              );
              if (!confirm) return;
              toast.promise(
                deleteField.mutateAsync({ fieldId: formField.id }),
                {
                  loading: "Deleting field...",
                  success: () => {
                    utils.form.getAllFormFields
                      .refetch({
                        formSchemaId: formField.formSchemaId,
                      })
                      .catch(console.error);
                    return "Field deleted!";
                  },
                  error: "Failed to delete field",
                },
              );
            }}
          />
        </div>
        <div className="h-2"></div>
      </div>
    </>
  );
};

export default HeadingRenderer;
