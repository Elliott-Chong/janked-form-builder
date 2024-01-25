import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function convertZodStringToValidator(parserString: string) {
  // const parserString = `z.object({
  //   hello: z.string(),
  // })`;
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const createValidator = new Function(
    "z",
    `
return ${parserString};
`
  );
  const dynamicValidator = createValidator(z);

  return dynamicValidator as z.ZodObject<any, any>;
}



export function convertFieldValidatorStringsToZodFormSchema(
  validators: {
    name: string;
    validator: string | null;
  }[]
) {
  // convert to something like below
  // const formSchema = z.object({
  //   "How much are you looking to borrow?": z.coerce
  //     .number({ invalid_type_error: "Please enter a number" })
  //     .min(1000, { message: "Minimum loan amount is $1,000" })
  //     .max(2000, { message: "Maximum loan amount is $2,000" }),
  //   "What are you seeking funding for?": z
  //     .string()
  //     .refine((value) => !/^\d+$/.test(value), {
  //       message: "Field cannot only contain numbers",
  //     }),
  //   "What is your email address?": z.string().email(),
  //   "When did you establish your business?": z.string(),
  // });
  const formSchema = z.object({});
  validators.forEach((validator) => {
    if (!validator.validator) {
      validator.validator = 'z.any()'
    };
    const dynamicValidator = convertZodStringToValidator(validator.validator);
    formSchema.shape[validator.name] = dynamicValidator;
  });

  return formSchema;
}