import React from "react";
import Modal from "./Modal";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { Textarea } from "./ui/textarea";
import { BookX } from "lucide-react";

const CreateFormEmptyState = () => {
  const [open, setOpen] = React.useState(false);
  const [formName, setFormName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const router = useRouter();
  const createForm = api.form.createForm.useMutation();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.promise(createForm.mutateAsync({ name: formName, description }), {
      loading: "Creating form...",
      success: ({ id }) => {
        router.push(`/builder/${id}`).catch(console.error);
        return "Form created!";
      },
      error: "Failed to create form",
    });
  };
  return (
    <>
      <Modal open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit}>
          <h1 className="text-xl font-semibold text-gray-800">
            Create a new Form
          </h1>
          <p className="text-sm text-gray-500">
            Begin the form by entering a name
          </p>
          <div className="h-2"></div>
          <Input
            placeholder="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <div className="h-2"></div>
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="h-2"></div>
          <Button
            isLoading={createForm.isLoading}
            onClick={() => {
              setOpen(false);
            }}
          >
            Submit
          </Button>
        </form>
      </Modal>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <BookX className="mx-auto h-12 w-12 text-gray-400" />
        <span className="mt-2 block text-sm font-semibold text-gray-900">
          Create a new form
        </span>
      </button>
    </>
  );
};

export default CreateFormEmptyState;
