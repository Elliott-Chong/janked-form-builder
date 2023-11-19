import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Switch } from "./ui/switch";
import type { FormSchema } from "@prisma/client";
import { api } from "@/utils/api";
import Link from "next/link";

type Props = { formScehma: FormSchema };

const FormBuilderTopCard = ({ formScehma }: Props) => {
  const [published, setPublished] = React.useState(formScehma.published);
  const publishForm = api.form.publishForm.useMutation();
  React.useEffect(() => {
    publishForm
      .mutateAsync({ formSchemaId: formScehma.id, published })
      .catch(console.error);
  }, [published]);
  return (
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
            <Button>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </Link>
          <Button variant="outline">Responses</Button>
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
  );
};

export default FormBuilderTopCard;
