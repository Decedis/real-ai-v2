import { PrismaClient } from "@prisma/client";
import { Context } from "hono";
import OpenAI from "openai";
import { prisma } from "../../../utils/utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const tagClient = async (c: Context) => {
  try {
    const { clientId } = await c.req.json();

    if (clientId) {
      // Tag a single client
      return await tagSingleClient(c, clientId);
    } else {
      // Tag all untagged clients
      return await tagAllUntaggedClients(c);
    }
  } catch (error) {
    console.error("Error:", error);
    return c.json(
      { error: "An error occurred while tagging the client(s)" },
      500
    );
  }
};

async function tagSingleClient(c: Context, clientId: number) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: { formSubmissions: true },
  });

  if (!client) {
    return c.json({ error: "Client not found" }, 404);
  }

  const tag = await determineTag(client.formSubmissions);

  await prisma.client.update({
    where: { id: clientId },
    data: { tag },
  });

  return c.json({
    message: "Client tagged successfully",
    tag,
  });
}

async function tagAllUntaggedClients(c: Context) {
  const untaggedClients = await prisma.client.findMany({
    where: { tag: null },
    include: { formSubmissions: true },
  });

  const taggedClients = await Promise.all(
    untaggedClients.map(async (client) => {
      const tag = await determineTag(client.formSubmissions);
      await prisma.client.update({
        where: { id: client.id },
        data: { tag },
      });
      return { id: client.id, tag };
    })
  );

  return c.json({
    message: "All untagged clients have been tagged",
    taggedClients,
  });
}

async function determineTag(formSubmissions: any[]) {
  const formContent = formSubmissions
    .map((submission) => submission.content)
    .join("\n\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are an assistant that categorizes real estate client interests. Based on the client's submissions, determine if they are primarily interested in buying a home, selling a home, or if their interest is unclear or mixed (other). Respond with only one word: 'buying', 'selling', or 'other'.",
      },
      {
        role: "user",
        content: `Here are the client's submissions:\n\n${formContent}\n\nPlease categorize this client's interest.`,
      },
    ],
  });

  const tag = completion.choices[0].message.content?.toLowerCase();

  if (tag !== "buying" && tag !== "selling" && tag !== "other") {
    throw new Error("Invalid tag generated");
  }

  return tag;
}
