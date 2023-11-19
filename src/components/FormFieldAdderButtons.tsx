import type { FormFieldType } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { Button } from "./ui/button";
import {
  AlignVerticalSpaceBetween,
  ChevronRightCircle,
  FormInput,
  Heading1,
  Pilcrow,
  Plus,
  TextCursorInput,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { api } from "@/utils/api";
import { toast } from "sonner";

type Props = {
  formSchemaId: string;
};

const FormFieldAdderButtons = ({ formSchemaId }: Props) => {
  const addFormField = api.form.addFormField.useMutation();
  const utils = api.useUtils();

  const handleAdd = (fieldType: FormFieldType) => {
    toast.promise(addFormField.mutateAsync({ fieldType, formSchemaId }), {
      loading: "Adding field...",
      success: () => {
        utils.form.getAllFormFields
          .refetch({
            formSchemaId,
          })
          .catch(console.error);
        return "Field added!";
      },
      error: "Error adding field",
    });
  };
  return (
    <>
      <div className="flex items-center gap-8">
        <Separator className="flex-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button isLoading={addFormField.isLoading}>
              <Plus className="mr-1 h-4 w-4" />
              Add Field
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select a field</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAdd("TEXT")}>
              <TextCursorInput className="mr-2 h-4 w-4" strokeWidth={2.3} />
              Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAdd("TEXTAREA")}>
              <FormInput className="mr-2 h-4 w-4" strokeWidth={2.3} />
              Text Area
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAdd("SELECT")}>
              <ChevronRightCircle className="mr-2 h-4 w-4" strokeWidth={2.3} />{" "}
              Select
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAdd("HEADING")}>
              <Heading1 className="mr-2 h-4 w-4" strokeWidth={2.3} />
              Heading
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAdd("PARAGRAPH")}>
              <Pilcrow className="mr-2 h-4 w-4" strokeWidth={2.3} /> Paragraph
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => handleAdd("SPACER")}>
              <AlignVerticalSpaceBetween
                className="w-4 h-4 mr-2"
                strokeWidth={2.3}
              />
              Spacer
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator className="flex-1" />
      </div>
    </>
  );
};

export default FormFieldAdderButtons;
