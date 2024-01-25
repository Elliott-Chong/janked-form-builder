import { convertFieldValidatorStringsToZodFormSchema } from "../lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

type Props = {
  formFields: {
    codeName: string | null;
    name: string | null;
    validation: string | null;
    isInput: boolean;
  }[];
};

const useZodForm = ({ formFields }: Props) => {

  const formSchema = convertFieldValidatorStringsToZodFormSchema(
    formFields
      .filter((formField) => formField.isInput)
      .map((formField) => ({
        name: formField.codeName ?? formField.name ?? "",
        validator: formField.validation,
      }))
  );
  const hookForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formFields.filter(field => field.isInput).reduce((acc, formField) => {
      if (!formField.codeName) return acc
      return {
        ...acc,
        [formField.codeName ?? ""]: ""
      }
    }, {})
  });
  return { hookForm, formSchema };
};

export default useZodForm;
