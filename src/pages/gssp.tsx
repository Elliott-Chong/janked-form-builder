import { db } from "@/server/db";
import type { User } from "@prisma/client";
import type { GetServerSideProps } from "next";
import React from "react";

type Props = {
  user: User;
};

const FuckGSSP = ({ user }: Props) => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const users = await db.user.findMany({
    select: {
      id: true,
    },
  });
  return {
    props: {
      user: JSON.parse(JSON.stringify(users[0])) as User,
    },
  };
};

export default FuckGSSP;
