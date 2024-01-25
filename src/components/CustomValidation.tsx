/* eslint-disable @typescript-eslint/no-implied-eval */
import { api } from '@/utils/api';
import type { FormField } from '@prisma/client'
import Link from 'next/link';
import Editor from "@monaco-editor/react";
import React from 'react'
import { z } from 'zod';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

type Props = { formField: FormField, setOpen: React.Dispatch<React.SetStateAction<boolean>> }

const CustomValidation = ({ formField, setOpen }: Props) => {
    const saveValidation = api.form.saveValidation.useMutation();
    const [validatorCode, setValidatorCode] = React.useState<string>(`z.any()`);
    React.useEffect(() => {
        if (formField.validation) setValidatorCode(formField.validation);
    }, [formField.validation]);
    const utils = api.useUtils();
    const handleRunValidation = (validatorCode: string) => {
        let success = false;
        try {
            new Function("z", `return ${validatorCode};`)(z);
            success = true;
        } catch (error) {
            console.error("Validation failed:", error);
            success = false;
        }
        return success;
    };

    return (
        <div>
            <h1 className="text-xl font-semibold">
                Write custom validation for your input <br />
                <span className="text-sm text-blue-600">{formField.name}</span>
            </h1>
            <div className="h-2"></div>
            <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">
                    You may write valid{" "}
                    <Link className="underline" href="https://zod.dev" target="_blank">
                        zod
                    </Link>{" "}
                    validation code here
                </p>
            </div>
            <div className="h-4"></div>
            <Editor
                className="min-h-[200px] scrollbar-hide"
                language="javascript"
                theme="vs-light"
                value={validatorCode}
                options={{ minimap: { enabled: false } }}
                onChange={(value) => setValidatorCode(value ?? "")}
            />

            <div className="h-2"></div>
            <div className="h-4"></div>
            <div className="flex items-center gap-2">
                <Button
                    onClick={() => {
                        const success = handleRunValidation(validatorCode);
                        if (success) {
                            toast.success("Syntax is valid!");
                        } else {
                            toast.error("Syntax error!");
                        }
                    }}
                    size="sm"
                    variant={"outline"}
                >
                    Check Syntax
                </Button>
                {/* {z.number().gte(10000, {message: 'number must be greater than 10,000'}).lte(100000, {message: "number must be less than 100.000"})} */}
                <Button
                    size="sm"
                    isLoading={saveValidation.isLoading}
                    onClick={() => {
                        const success = handleRunValidation(validatorCode);
                        if (!success) {
                            toast.error("Syntax error!");
                            return;
                        }
                        saveValidation.mutate(
                            {
                                formFieldId: formField.id,
                                validation: validatorCode,
                            },
                            {
                                onSuccess: () => {
                                    setOpen(false);
                                    toast.success("Saved validator");
                                    utils.form.getAllFormFields.refetch({
                                        formSchemaId: formField.formSchemaId,
                                    }).catch(console.error);
                                },
                                onError: (error) => {
                                    console.error(error);
                                    toast.error("Failed to save validator");
                                },
                            }
                        );
                    }}
                >
                    Save validator
                    <Save className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}

export default CustomValidation