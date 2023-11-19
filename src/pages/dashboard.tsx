import CreateFormEmptyState from "@/components/CreateFormEmptyState";
import Navbar from "@/components/Navbar";
import { FormCards } from "@/components/form-cards";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import type { FormSchema } from "@prisma/client";
import type { GetServerSideProps } from "next";
import type { User } from "next-auth";
import React from "react";

type Props = {
  user: User;
  forms: FormSchema[];
};

const DashboardPage = ({ user, forms }: Props) => {
  return (
    <>
      <Navbar user={user} />
      <div className="mx-auto max-w-6xl">
        <FormCards forms={forms} />
        <div className="h-8"></div>
        <CreateFormEmptyState />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const allFormCards = await db.formSchema.findMany({
    where: { createdById: session.user.id, archived: false },
    orderBy: {
      createdAt: "desc",
    },
  });
  return {
    props: {
      user: session.user,
      forms: JSON.parse(JSON.stringify(allFormCards)) as FormSchema[],
    },
  };
};

export default DashboardPage;
