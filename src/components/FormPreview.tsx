import type { FormField, FormSchema } from "@prisma/client";
import React from "react";
import TextRenderer from "./FormFill/renderers/TextRenderer";
import TextAreaRenderer from "./FormFill/renderers/TextAreaRenderer";
import SelectRenderer from "./FormFill/renderers/SelectRenderer";
import HeadingRenderer from "./FormFill/renderers/HeadingRenderer";
import ParagraphRenderer from "./FormFill/renderers/ParagraphRenderer";
import { Button } from "./ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";

type Props = {
  formSchema: FormSchema & {
    formFields: FormField[];
  };
};

const FormPreview = ({ formSchema }: Props) => {
  return (
    <>
      <div className="rounded-lg border-l-4 border-indigo-400 bg-indigo-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Eye className="h-5 w-5 text-indigo-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-indigo-700">
              You are viewing a preview of this form.
            </p>
          </div>
        </div>
      </div>
      <div className="h-4"></div>
      <Link href={`/builder/${formSchema.id}`}>
        <Button variant={"outline"}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
      </Link>
      <div className="h-4"></div>
      <div className="rounded-lg border border-t-8 border-t-gray-800 px-6 py-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold">{formSchema.name}</h2>
            <p className="text-sm text-gray-500">{formSchema.description}</p>
          </div>
        </div>
      </div>
      <div className="h-4"></div>
      <div className="flex flex-col gap-4">
        {formSchema.formFields
          .sort((a, b) => a.order - b.order)
          .map((formField) => {
            return (
              <>
                {formField.formFieldType === "TEXT" && (
                  <TextRenderer
                    key={formField.id}
                    formValue={{
                      formField,
                      value: "",
                    }}
                  />
                )}
                {formField.formFieldType === "TEXTAREA" && (
                  <TextAreaRenderer
                    key={formField.id}
                    formValue={{ formField, value: "" }}
                  />
                )}
                {formField.formFieldType === "SELECT" && (
                  <SelectRenderer
                    key={formField.id}
                    formValue={{ formField, value: "" }}
                  />
                )}
                {formField.formFieldType === "HEADING" && (
                  <HeadingRenderer
                    key={formField.id}
                    formValue={{ formField, value: "" }}
                  />
                )}
                {formField.formFieldType === "PARAGRAPH" && (
                  <ParagraphRenderer
                    key={formField.id}
                    formValue={{ formField, value: "" }}
                  />
                )}
              </>
            );
          })}
      </div>
    </>
  );
};

export default FormPreview;
