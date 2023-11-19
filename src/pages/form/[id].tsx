import EmailInput from "@/components/FormFill/EmailInput";
import FormFill from "@/components/FormFill/FormFill";
import ThankYou from "@/components/ThankYou";
import { db } from "@/server/db";
import type { FormSchema, FormField, User } from "@prisma/client";
import type { GetServerSideProps } from "next";
import React from "react";
type Props = {
  formSchema: FormSchema & {
    formFields: FormField[];
    createdBy: User;
  };
};

const FormFillPage = ({ formSchema }: Props) => {
  const [step, setStep] = React.useState(0);
  const [submissionId, setSubmissionId] = React.useState("");
  return (
    <>
      <div className="mx-auto max-w-xl py-20">
        {step == 0 && (
          <EmailInput
            setStep={setStep}
            formSchema={formSchema}
            setSubmissionId={setSubmissionId}
          />
        )}
        {step == 1 && (
          <FormFill
            formSchema={formSchema}
            submissionId={submissionId}
            setStep={setStep}
          />
        )}
        {step === 2 && <ThankYou formSchema={formSchema} />}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  if (!id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const formSchema = await db.formSchema.findFirst({
    where: { id: id as string, published: true },
    include: {
      formFields: {
        orderBy: { order: "asc" },
      },
      createdBy: true,
    },
  });
  if (!formSchema) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      formSchema: JSON.parse(JSON.stringify(formSchema)) as FormSchema,
    },
  };
};

export default FormFillPage;
