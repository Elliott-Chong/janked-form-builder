import type { FormSchema, User } from "@prisma/client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "sonner";

type Props = {
  formSchema: FormSchema & {
    createdBy: User;
  };
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setSubmissionId: React.Dispatch<React.SetStateAction<string>>;
};

const EmailInput = ({ formSchema, setStep, setSubmissionId }: Props) => {
  const createFormSubmission = api.form.createFormSubmission.useMutation();
  const [email, setEmail] = React.useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.promise(
      createFormSubmission.mutateAsync({
        email,
        formSchemaId: formSchema.id,
      }),
      {
        loading: "Creating form submission...",
        success: ({ id }) => {
          setStep(1);
          setSubmissionId(id);
          return "Form submission created successfully";
        },
        error: "Failed to create form submission",
      },
    );
  };
  return (
    <>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="font-normal">
              You have been welcomed by{" "}
              <span className="font-semibold">{formSchema.createdBy.name}</span>{" "}
              to fill up{" "}
              <span className="font-semibold">{formSchema.name}</span>
            </CardTitle>
            <CardDescription>
              Please enter your email address to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <form onSubmit={handleSubmit}>
              <Input
                type="email"
                required
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                className="mt-4"
                variant="outline"
                isLoading={createFormSubmission.isLoading}
              >
                Let&apos;s go <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EmailInput;
