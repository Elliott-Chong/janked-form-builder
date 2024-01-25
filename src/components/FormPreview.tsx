import type { FormField, FormSchema } from "@prisma/client";
import React from "react";
import TextRenderer from "./FormFill/renderers/TextRenderer";
import TextAreaRenderer from "./FormFill/renderers/TextAreaRenderer";
import SelectRenderer from "./FormFill/renderers/SelectRenderer";
import HeadingRenderer from "./FormFill/renderers/HeadingRenderer";
import ParagraphRenderer from "./FormFill/renderers/ParagraphRenderer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField as ShadFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import useZodForm from "./useZodForm";
import { z } from "zod";

type Props = {
  formSchema: FormSchema & {
    formFields: FormField[];
  };
};

const FormPreview = ({ formSchema }: Props) => {
  const { hookForm, formSchema: zodFormSchema } = useZodForm({
    formFields: formSchema.formFields.map(formField => ({
      codeName: formField.name,
      isInput: formField.isInput,
      name: formField.name,
      validation: formField.validation,
    })),
  });
  function onSubmit(values: z.infer<typeof zodFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <>
      <div className="p-4 border-l-4 border-indigo-400 rounded-lg bg-indigo-50">
        <div className="flex">
          <div className="flex-shrink-0">
            <Eye className="w-5 h-5 text-indigo-400" aria-hidden="true" />
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
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      </Link>
      <div className="h-4"></div>
      <div className="px-6 py-8 border border-t-8 rounded-lg shadow-xl border-t-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold">{formSchema.name}</h2>
            <p className="text-sm text-gray-500">{formSchema.description}</p>
          </div>
        </div>
      </div>
      <div className="h-4"></div>
      <Form {...hookForm}>
        <form onSubmit={hookForm.handleSubmit(onSubmit)} className="space-y-8">
          {formSchema.formFields
            .sort((a, b) => a.order - b.order)
            .map((formField) => {
              return (
                <ShadFormField
                  key={formField.id}
                  control={hookForm.control}
                  name={formField.name as never}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <>
                          {formField.formFieldType === "TEXT" && (
                            <TextRenderer
                              key={formField.id}
                              formValue={{
                                formField,
                                value: "",
                              }}
                              {...field}
                            />
                          )}
                          {formField.formFieldType === "SELECT" && (
                            <SelectRenderer
                              key={formField.id}
                              formValue={{ formField, value: "" }}
                              {...field}
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            })}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div className="flex flex-col gap-4">
        {formSchema.formFields
          .sort((a, b) => a.order - b.order)
          .map((formField) => {
            return (
              <div key={formField.id}>

              </div>
            );
          })}
      </div>
    </>
  );
};

export default FormPreview;
