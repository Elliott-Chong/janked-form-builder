import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Share } from "lucide-react";
import { Switch } from "./ui/switch";
import type { FormSchema } from "@prisma/client";
import { api } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";
import Modal from "./Modal";
import { Input } from "./ui/input";
import { toast } from "sonner";

type Props = { formScehma: FormSchema };

const FormBuilderTopCard = ({ formScehma }: Props) => {
  const [published, setPublished] = React.useState(formScehma.published);
  const publishForm = api.form.publishForm.useMutation();
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    publishForm
      .mutateAsync({ formSchemaId: formScehma.id, published })
      .catch(console.error);
  }, [published]);
  return (
    <>
      <Modal open={open} setOpen={setOpen}>
        <h1 className="text-xl font-semibold text-gray-800">
          Invite people to fill up the form
        </h1>
        <p className="text-sm text-gray-500">
          Ask them to copy and paste this link into their browser:
        </p>
        <Input
          className="mt-4"
          readOnly
          onClick={() => {
            navigator.clipboard
              .writeText(`${process.env.NEXT_PUBLIC_URL}/form/${formScehma.id}`)
              .catch(console.error);
            toast.success("Copied to clipboard!");
          }}
          value={`${process.env.NEXT_PUBLIC_URL}/form/${formScehma.id}`}
        />
      </Modal>
      <div className="rounded-lg border border-t-8 border-t-gray-800 px-6 py-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold">
              Form Builder - {formScehma.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Drag and drop the form elements below to build your form.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/preview/${formScehma.id}`}>
              <Button variant={"outline"}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </Link>
            <Button onClick={() => setOpen(true)}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <div className="flex items-center">
              <Switch
                checked={published}
                onCheckedChange={() => setPublished(!published)}
              />
              <span className="ml-2 text-xs">Published</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormBuilderTopCard;
