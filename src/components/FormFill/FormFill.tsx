import { api } from "@/utils/api";
import type { FormSchema } from "@prisma/client";
import React from "react";
import TextRenderer from "./renderers/TextRenderer";
import TextAreaRenderer from "./renderers/TextAreaRenderer";
import SelectRenderer from "./renderers/SelectRenderer";
import HeadingRenderer from "./renderers/HeadingRenderer";
import ParagraphRenderer from "./renderers/ParagraphRenderer";
import { Button } from "../ui/button";
import { toast } from "sonner";

type Props = {
  submissionId: string;
  formSchema: FormSchema;
  setStep: (step: number) => void;
};

const FormFill = ({ submissionId, formSchema, setStep }: Props) => {
  const { data: formValues } = api.form.getSubmissionFields.useQuery(
    {
      formSubmissionId: submissionId,
    },
    {
      staleTime: Infinity,
    },
  );
  const submitForm = api.form.submitForm.useMutation();
  const sortedFormValues = React.useMemo(() => {
    if (!formValues) return [];
    return formValues.sort((a, b) => {
      return a.formField.order - b.formField.order;
    });
  }, [formValues]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(
      sortedFormValues.filter((e) => e.formField.isInput).map((e) => e.value),
    );
    toast.promise(
      submitForm.mutateAsync({
        formSubmissionId: submissionId,
        values: sortedFormValues,
      }),
      {
        loading: "Submitting...",
        success: () => {
          setStep(2);
          return "Submitted!";
        },
        error: "Something went wrong!",
      },
    );
  };
  return (
    <>
      <div className="rounded-lg border border-t-8 border-t-gray-800 px-6 py-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold">{formSchema.name}</h2>
            <p className="text-sm text-gray-500">{formSchema.description}</p>
          </div>
        </div>
      </div>
      <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
        {sortedFormValues.map((formValue) => {
          return (
            <>
              {formValue.formField.formFieldType === "TEXT" && (
                <TextRenderer key={formValue.id} formValue={formValue} />
              )}
              {formValue.formField.formFieldType === "TEXTAREA" && (
                <TextAreaRenderer key={formValue.id} formValue={formValue} />
              )}
              {formValue.formField.formFieldType === "SELECT" && (
                <SelectRenderer key={formValue.id} formValue={formValue} />
              )}
              {formValue.formField.formFieldType === "HEADING" && (
                <HeadingRenderer key={formValue.id} formValue={formValue} />
              )}
              {formValue.formField.formFieldType === "PARAGRAPH" && (
                <ParagraphRenderer key={formValue.id} formValue={formValue} />
              )}
            </>
          );
        })}
        <Button isLoading={submitForm.isLoading}>Submit</Button>
      </form>
    </>
  );
};

export default FormFill;
