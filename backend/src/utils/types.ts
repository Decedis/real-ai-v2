import { z } from "zod";

export const Form = z.object({
  name: z.string(),
  content: z.string(),
  email: z.string(),
  createdAt: z.string().datetime(),
});

export type Form = z.infer<typeof Form>;

//User
export const Client = z.object({
  name: z.string(),
  email: z.string(),
  agentId: z.number(),
  agent: z.string(),
  tag: z.enum(["selling", "buying", "renting"]),
});

export type User = z.infer<typeof Client>;

export const Listing = z.object({
  createdAt: z.string().date(),
  updatedAt: z.string().date(),
  address: z.string(),
  price: z.number(),
  description: z.string(),
  size: z.number(),
  beds: z.number(),
  baths: z.number(),
  agentId: z.number(),
  //agent: z.string(),
});

export type Listing = z.infer<typeof Listing>;

export const NoteOnClient = z.object({
  note: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  client: z.string(),
  clientId: z.number(),
  //agent: z.string(),
  agentId: z.number(),
});

export type NoteOnClient = z.infer<typeof NoteOnClient>;

export const Agent = z.object({
  name: z.string(),
  email: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  clients: z.array(Client),
  listings: z.array(Listing),
  NotesOnClients: z.array(NoteOnClient),
});

//check if prisma or hono has builtin types that interface with Zod/requests/responses
//check if the paths work in Bruno and if the types are correct
