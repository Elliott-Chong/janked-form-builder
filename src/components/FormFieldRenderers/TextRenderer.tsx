import type { FormField } from "@prisma/client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Pencil, TextCursorInput, Trash2 } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { api } from "@/utils/api";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  formField: FormField;
};

const TextRenderer = ({ formField }: Props) => {
  const labelRef = React.useRef<HTMLLabelElement>(null);
  const [description, setDescription] = React.useState<string>(
    formField.description ?? "",
  );
  const utils = api.useUtils();
  const [required, setRequired] = React.useState<boolean>(formField.required);
  const debouncedDescription = useDebounce(description, 500);
  const saveField = api.form.saveField.useMutation();
  const deleteField = api.form.deleteField.useMutation();

  React.useEffect(() => {
    if (debouncedDescription !== formField.description) {
      saveField
        .mutateAsync({
          description: debouncedDescription,
          fieldId: formField.id,
          name: labelRef.current?.textContent ?? "",
          required,
        })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedDescription,
    formField.description,
    formField.id,
    labelRef,
    required,
  ]);

  return (
    <>
      <div className="rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-700">
        <div className="flex items-center">
          <span className="mr-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500/10">
            <TextCursorInput className="mr-1 h-4 w-4" />
            Text
          </span>
          <div className="ml-auto flex items-center">
            <Switch
              checked={required}
              onCheckedChange={() => {
                setRequired(!required);
                saveField
                  .mutateAsync({
                    description: debouncedDescription,
                    fieldId: formField.id,
                    name: labelRef.current?.textContent ?? "",

                    required: !required,
                  })
                  .catch(console.error);
              }}
            />
            <span
              className={cn("ml-2 text-xs text-gray-500", {
                "text-red-600": required,
              })}
            >
              Required
            </span>
          </div>
        </div>
        <div className="h-4"></div>
        <div className="flex items-center">
          <Label
            ref={labelRef}
            onBlur={(e) => {
              saveField
                .mutateAsync({
                  description: debouncedDescription,
                  fieldId: formField.id,
                  name: e.currentTarget.textContent ?? "",
                  required,
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
            className="ml-2 h-3 w-3 cursor-pointer"
          />
          <Trash2
            className="ml-1 h-3 w-3 cursor-pointer text-red-600"
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
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.currentTarget.value);
          }}
        />
        <div className="h-2"></div>
        <Input placeholder="Enter your answer here" readOnly disabled />
      </div>
    </>
  );
};

export default TextRenderer;
