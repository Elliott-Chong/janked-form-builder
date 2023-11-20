import FormPreview from "@/components/FormPreview";
import Navbar from "@/components/Navbar";
import { FormBuilder } from "@/components/form-builder";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import type { FormSchema, FormField } from "@prisma/client";
import type { GetServerSideProps } from "next";
import type { User } from "next-auth";
import React from "react";
type Props = {
  user: User;
  formSchema: FormSchema & {
    formFields: FormField[];
  };
};

const FormPreviewPage = ({ user, formSchema }: Props) => {
  return (
    <>
      <Navbar user={user} />
      <div className="mx-auto max-w-xl py-10">
        <FormPreview formSchema={formSchema} />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  const { id } = ctx.query;
  if (!session?.user || !id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const formSchema = await db.formSchema.findFirstOrThrow({
    where: { id: id as string, createdById: session.user.id },
    include: {
      formFields: {
        orderBy: { order: "asc" },
      },
    },
  });
  if (!formSchema) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      user: session.user,
      formSchema: JSON.parse(JSON.stringify(formSchema)) as FormSchema,
    },
  };
};

export default FormPreviewPage;
