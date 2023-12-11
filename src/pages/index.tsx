import SignInButton from "@/components/SignInButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import type { FormSchema } from "@prisma/client";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const forms = await db.formSchema.findMany({});
  return {
    props: { forms: JSON.parse(JSON.stringify(forms)) as FormSchema[] },
  };
  const session = await getServerAuthSession(ctx);
  if (session?.user) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Home({ forms }: Props) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <pre>{JSON.stringify(forms, null, 2)}</pre>
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>Welcome to INC Form 🔥!</CardTitle>
          <CardDescription>
            INC Form is a simple form builder that allows you to create forms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton text="Sign In with Google" />
        </CardContent>
      </Card>
    </div>
  );
}
