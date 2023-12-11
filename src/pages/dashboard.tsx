import CreateFormEmptyState from "@/components/CreateFormEmptyState";
import Navbar from "@/components/Navbar";
import SearchForms from "@/components/SearchForms";
import { FormCards } from "@/components/form-cards";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import type { FormSchema } from "@prisma/client";
import { Ghost } from "lucide-react";
import type { GetServerSideProps } from "next";
import type { User } from "next-auth";
import React from "react";

type Props = {
  user: User;
  forms: FormSchema[];
};

const DashboardPage = ({ user, forms }: Props) => {
  const [_forms, setForms] = React.useState(forms);
  return (
    <>
      <Navbar user={user} />
      <div className="mx-auto max-w-6xl px-10">
        <SearchForms setForms={setForms} forms={forms} />
        <div className="h-6"></div>
        {_forms.length === 0 && (
          <div className="mx-auto mt-4 flex w-fit flex-col items-center">
            <Ghost className="h-12 w-12" />
            <div className="h-2"></div>
            <h1 className="text-lg font-medium text-gray-600">No forms...</h1>
          </div>
        )}
        <FormCards forms={_forms} />
        <div className="h-6"></div>
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
