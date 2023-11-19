import { api } from "@/utils/api";
import { Ghost } from "lucide-react";
import React from "react";

type Props = {
  formSchemaId: string;
};

const ResponsesTable = ({ formSchemaId }: Props) => {
  const { data: formSubmissions } = api.form.getResponses.useQuery({
    formSchemaId,
  });

  return (
    <>
      {/* <pre>{JSON.stringify(formSubmissions, null, 2)}</pre> */}
      {formSubmissions?.filter((e) => e.completed).length === 0 ? (
        <>
          <div className="mx-auto mt-4 flex w-fit flex-col items-center">
            <Ghost className="h-12 w-12" />
            <div className="h-2"></div>
            <h1 className="font-miedum text-xl">No submissions yet...</h1>
          </div>
        </>
      ) : (
        <div className="">
          <div className="flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Email
                      </th>
                      {formSubmissions?.[0]?.formSchema.formFields.map(
                        (formField) => (
                          <th
                            key={formField.id}
                            scope="col"
                            className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                          >
                            {formField.name}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {formSubmissions
                      ?.filter((e) => e.completed)
                      .map((formSubmission) => (
                        <tr key={formSubmission.id}>
                          <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                            {formSubmission.userEmail}
                          </td>
                          {formSubmission.formValues.map((formValue) => (
                            <td
                              className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0"
                              key={formValue.id}
                            >
                              {formValue.value}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResponsesTable;
