import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { FormFieldType } from "@prisma/client";

export const formRouter = createTRPCRouter({
  createForm: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const form = await ctx.db.formSchema.create({
        data: {
          name: input.name,
          createdById: ctx.session.user.id,
        },
      });
      return { id: form.id };
    }),
  addFormField: protectedProcedure
    .input(
      z.object({
        fieldType: z.nativeEnum(FormFieldType),
        formSchemaId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const allFormFieldsLength = await ctx.db.formField.count({
        where: { formSchemaId: input.formSchemaId },
      });
      const formField = await ctx.db.formField.create({
        data: {
          formFieldType: input.fieldType,
          order: allFormFieldsLength,
          required: false,
          name: "New Field",
          formSchemaId: input.formSchemaId,
        },
      });
      return { id: formField.id };
    }),
  saveField: protectedProcedure
    .input(
      z.object({
        fieldId: z.string(),
        name: z.string(),
        description: z.string(),
        options: z.array(z.string()).optional(),
        required: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const formField = await ctx.db.formField.update({
        where: { id: input.fieldId },
        data: {
          name: input.name,
          description: input.description,
          required: input.required,
          options: JSON.stringify(input.options),
        },
      });
      return { id: formField.id };
    }),
  deleteField: protectedProcedure
    .input(
      z.object({
        fieldId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.formField.delete({
        where: { id: input.fieldId },
      });
      return { success: true };
    }),
  getAllFormFields: protectedProcedure
    .input(
      z.object({
        formSchemaId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const formFields = await ctx.db.formField.findMany({
        where: { formSchemaId: input.formSchemaId },
        orderBy: { order: "asc" },
      });
      return formFields;
    }),
  rearrangeFields: protectedProcedure
    .input(
      z.object({
        formSchemaId: z.string(),
        fieldIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await Promise.all(
        input.fieldIds.map(async (fieldId, index) => {
          await ctx.db.formField.update({
            where: { id: fieldId },
            data: {
              order: index,
            },
          });
        }),
      );
    }),
  publishForm: protectedProcedure
    .input(
      z.object({
        formSchemaId: z.string(),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.formSchema.update({
        where: { id: input.formSchemaId },
        data: {
          published: input.published,
        },
      });
    }),
});
