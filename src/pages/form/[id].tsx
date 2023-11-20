import EmailInput from "@/components/FormFill/EmailInput";
import FormFill from "@/components/FormFill/FormFill";
import ThankYou from "@/components/ThankYou";
import { Button } from "@/components/ui/button";
import { db } from "@/server/db";
import type { FormSchema, FormField, User } from "@prisma/client";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import React from "react";
type Props = {
  published: boolean;
  formSchema?: FormSchema & {
    formFields: FormField[];
    createdBy: User;
  };
};

const FormFillPage = ({ formSchema, published }: Props) => {
  const [step, setStep] = React.useState(0);
  const [submissionId, setSubmissionId] = React.useState("");
  if (!published) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="rounded-lg border p-6 shadow">
          <h1 className="text-xl font-semibold">
            This form is not published yet!
          </h1>
          <p className="text-sm text-gray-500">
            You may contact the creator of this form to publish it.
          </p>
          <Link href="/">
            <Button className="mt-2" variant={"outline"}>
              Interested in creating your own form?
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  if (formSchema) {
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
  }
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
    where: { id: id as string },
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
  if (!formSchema.published) {
    return {
      props: {
        formSchema: null,
        published: false,
      },
    };
  }
  return {
    props: {
      formSchema: JSON.parse(JSON.stringify(formSchema)) as FormSchema,
      published: true,
    },
  };
};

export default FormFillPage;
