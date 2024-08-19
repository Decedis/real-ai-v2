import { Form } from "../../utils/types";
import { z } from "zod";
import { Context } from "hono";
import { prisma } from "../../utils/utils";

export const routePostSubmissions = async (c: Context) => {
  try {
    const body = await c.req.json();
    console.log("Request Body:", body);

    const submission = Form.parse(body);
    const submissionData = {
      ...submission,
      createdAt: new Date(submission.createdAt),
    };

    let client = await prisma.client.findUnique({
      where: { email: submission.email },
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: submission.name,
          email: submission.email,
          createdAt: submission.createdAt,
        },
      });
    }

    const newSubmission = await prisma.formSubmission.create({
      data: {
        ...submissionData,
        clientId: client.id, // Link the submission to the client
      },
    });

    return c.json(newSubmission, 201);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.json({ error: e.errors }, 400);
    } else {
      console.error(e);
      return c.json({ error: "An unexpected error occurred" }, 500);
    }
  }
};

// export const routeGetSubmissions = async (c: Context) => {
//   const submissions = await prisma.formSubmission.findMany({
//     include: { client: true },
//   });
//   return c.json(submissions);
// };
export const routeGetSubmissions = async (c: Context) => {
  const clientId = c.req.query("clientId");

  let submissions;
  if (clientId) {
    submissions = await prisma.formSubmission.findMany({
      where: { clientId: parseInt(clientId) },
      include: { client: true },
    });
  } else {
    submissions = await prisma.formSubmission.findMany({
      include: { client: true },
    });
  }

  return c.json(submissions);
};
