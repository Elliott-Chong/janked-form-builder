import type { FormField } from "@prisma/client";
import { Pencil, Pilcrow, Trash2 } from "lucide-react";
import React from "react";
import { Label } from "../ui/label";
import { api } from "@/utils/api";
import { toast } from "sonner";
import Editor from "react-simple-wysiwyg";
import { useDebounce } from "../hooks/useDebounce";

type Props = { formField: FormField };

const ParagraphRenderer = ({ formField }: Props) => {
  const utils = api.useUtils();
  const saveField = api.form.saveField.useMutation();
  const deleteField = api.form.deleteField.useMutation();
  const [html, setHtml] = React.useState<string>(formField.name ?? "");
  const debouncedHtml = useDebounce(html, 500);
  React.useEffect(() => {
    if (debouncedHtml !== formField.description) {
      saveField
        .mutateAsync({
          name: debouncedHtml,
          description: "",
          fieldId: formField.id,
          required: false,
        })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedHtml, formField.description, formField.id]);
  return (
    <>
      <div className="rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-700">
        <div className="flex items-center">
          <span className="mr-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500/10">
            <Pilcrow className="mr-1 h-4 w-4" />
            Paragraph
          </span>
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
        <div className="h-4"></div>
        <Editor
          style={{
            width: "100%",
          }}
          value={html}
          onChange={(e) => {
            setHtml(e.target.value);
          }}
        />
        <div className="h-2"></div>
      </div>
    </>
  );
};

export default ParagraphRenderer;
