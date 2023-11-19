import CreateFormEmptyState from "@/components/CreateFormEmptyState";
import Navbar from "@/components/Navbar";
import { FormCards } from "@/components/form-cards";
import { getServerAuthSession } from "@/server/auth";
import type { GetServerSideProps } from "next";
import { User } from "next-auth";
import React from "react";

type Props = {
  user: User;
};

const DashboardPage = ({ user }: Props) => {
  return (
    <>
      <Navbar user={user} />
      <div className="mx-auto max-w-6xl">
        <FormCards />
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
  return {
    props: { user: session.user },
  };
};

export default DashboardPage;
