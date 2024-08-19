import { z } from "zod";

export const FormData = z.object({
  name: z.string(),
  content: z.string(),
  email: z.string(),
  createdAt: z.string().datetime(),
});

export type FormData = z.infer<typeof FormData>;

export type GeneratedDocuments = {
  id: number;
  content: string;
  createdAt: Date;
};

export const ClientData = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  agentId: z.number().nullable(),
  agent: z
    .object({
      id: z.number(),
      name: z.string().email(),
    })
    .nullable(),
  formData: FormData,
  tag: z.enum(["selling", "buying", "other"]), // 'selling', 'buying', or 'other'
});

export type ClientData = z.infer<typeof ClientData>;
