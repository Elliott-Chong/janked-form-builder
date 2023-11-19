import type { FormSchema, User } from "@prisma/client";
import React from "react";
import Confetti from "react-confetti";
import { Button } from "./ui/button";
import Link from "next/link";

type Props = {
  formSchema: FormSchema & {
    createdBy: User;
  };
};
const ThankYou = ({ formSchema }: Props) => {
  return (
    <>
      <Confetti width={window?.innerHeight} height={window?.innerWidth} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="rounded-lg border p-6 shadow">
          <h1 className="text-xl font-semibold">
            Thank you for filling out the form! 🔮
          </h1>
          <p className="text-sm text-gray-500">
            {formSchema.createdBy.name} will be in touch with you shortly.
          </p>
          <Link href="/">
            <Button className="mt-2" variant={"outline"}>
              Interested in creating your own form?
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ThankYou;
