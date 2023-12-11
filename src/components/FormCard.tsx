import type { FormSchema } from "@prisma/client";
import React from "react";

import { CardTitle, CardContent, Card } from "@/components/ui/card";
import axios, { AxiosError } from "axios";
import { Button } from "./ui/button";
import {
  Archive,
  Loader2,
  MoreHorizontal,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
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
import { useDropzone } from "react-dropzone";
import Image from "next/image";
type Props = {
  form: FormSchema;
};
const FormCard = ({ form }: Props) => {
  const deleteForm = api.form.deleteForm.useMutation();
  const archiveForm = api.form.archiveForm.useMutation();
  const uploadImage = api.form.uploadImage.useMutation();
  const router = useRouter();
  const [isUploading, setIsUploading] = React.useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted: (files) => {
      (async () => {
        setIsUploading(true);
        const file = files[0];
        if (!file) return;
        const fileType = encodeURIComponent(file.type);
        const { data } = await axios.post<{ url: string }>("/api/signS3Url", {
          ContentType: fileType,
        });
        await axios.put(data.url, file, {
          headers: {
            "Content-Type": fileType,
          },
        });
        const publicUrl = data.url.split("?")[0];
        await uploadImage.mutateAsync({
          formSchemaId: form.id,
          imageUrl: publicUrl!,
        });
      })()
        .catch((err) => {
          if (err instanceof AxiosError) {
            console.log(err.response?.data);
          }
        })
        .finally(() => {
          setIsUploading(false);
          router.reload();
        });
    },
  });
  return (
    <div className="overflow-hidden rounded-lg border p-0 shadow-lg">
      {form.imageUrl ? (
        <div className="relative h-32 w-full">
          <Image
            src={form.imageUrl}
            alt="image"
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <>
          <div
            className="flex h-32 cursor-pointer items-center justify-center bg-gray-200 shadow-inner"
            {...getRootProps()}
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            ) : (
              <Upload className="h-8 w-8 text-gray-500" />
            )}
            <input {...getInputProps()} />
          </div>
        </>
      )}
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
    </div>
  );
};

export default FormCard;
