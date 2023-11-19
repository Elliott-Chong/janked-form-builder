import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

type Props = { name: string };

const FormBuilderTopCard = ({ name }: Props) => {
  return (
    <div className="rounded-lg border border-t-8 border-t-gray-800 px-6 py-8 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold">Form Builder - {name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag and drop the form elements below to build your form.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline">Responses</Button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilderTopCard;
