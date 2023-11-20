import type { FormSchema } from "@prisma/client";
import React from "react";
import { Input } from "./ui/input";

type Props = {
  setForms: React.Dispatch<React.SetStateAction<FormSchema[]>>;
  forms: FormSchema[];
};

const SearchForms = ({ setForms, forms }: Props) => {
  const [input, setInput] = React.useState("");
  React.useEffect(() => {
    if (input === "") {
      setForms(forms);
      return;
    }
    setForms((forms) =>
      forms.filter((form) =>
        form.name.toLowerCase().includes(input.toLowerCase()),
      ),
    );
  }, [input, setForms]);
  return (
    <Input
      className="h-12 w-fit"
      placeholder="Search form..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
  );
};

export default SearchForms;
