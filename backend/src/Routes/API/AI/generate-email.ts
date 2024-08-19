import { Context } from "hono";
import { prisma } from "../../../utils/utils";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateEmail = async (c: Context) => {
  const body = await c.req.json();
  const clientId = body.clientId;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: { formSubmissions: true },
  });

  if (!client) {
    return c.json({ error: "Client not found" }, 404);
  }

  const clientInfo = `
      Name: ${client.name}
      Email: ${client.email}
      Recent submissions: ${client.formSubmissions
        .map((fs) => fs.content)
        .join(", ")}
    `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a professional and courteous assistant. Your task is to generate a warm, welcoming, and professional email response to a client's submission. Greet the client by name and address their specific concerns or inquiries.",
      },
      {
        role: "user",
        content: `Generate a professional email response for the following client:\n
               Name: ${client.name}\n
               Email: ${client.email}\n
               Submission: ${client.formSubmissions
                 .map((fs) => fs.content)
                 .join(", ")}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 300,
  });

  return c.json({ email: completion.choices[0].message.content });
};
