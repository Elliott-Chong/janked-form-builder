import type { FormSchema } from "@prisma/client";
import React from "react";

import { CardTitle, CardContent, Card } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Archive, MoreHorizontal, Trash2 } from "lucide-react";
import { api } from "@/utils/api";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/router";
import Link from "next/link";
type Props = {
  form: FormSchema;
};
const FormCard = ({ form }: Props) => {
  const deleteForm = api.form.deleteForm.useMutation();
  const archiveForm = api.form.archiveForm.useMutation();
  const router = useRouter();
  return (
    <Card className="overflow-hidden rounded-lg shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-semibold">{form.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="rounded-sm bg-gray-100 p-0.5">
                <MoreHorizontal className="h-4 w-4 " />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  const confirm = window.confirm(
                    "Are you sure you want to delete this form?",
                  );
                  if (!confirm) return;
                  toast.promise(deleteForm.mutateAsync({ formId: form.id }), {
                    loading: "Deleting...",
                    success: () => {
                      router.replace(router.asPath).catch(console.error);
                      return "Deleted!";
                    },
                    error: "Something went wrong!",
                  });
                }}
              >
                <Trash2 className="mr-1 h-4 w-4 text-red-600" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast.promise(archiveForm.mutateAsync({ formId: form.id }), {
                    loading: "Archiving...",
                    success: () => {
                      router.replace(router.asPath).catch(console.error);
                      return "Archived!";
                    },
                    error: "Something went wrong!",
                  });
                }}
              >
                <Archive className="mr-1 h-4 w-4" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="mt-2 text-sm text-zinc-500">{form.description}</p>
        <p className="mt-4 text-xs text-zinc-400">
          Last modified: {new Date(form.updatedAt).toLocaleDateString()}
        </p>
        <Link href={`/builder/${form.id}`}>
          <Button className="mt-4" variant="outline">
            Edit Form
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default FormCard;
