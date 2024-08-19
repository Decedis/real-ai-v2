import { Context } from "hono";
import { prisma } from "../../utils/utils";
import { Client } from "@prisma/client";

export const getClients = async (c: Context) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        agent: {
          select: {
            id: true,
            name: true,
          },
        },
        formSubmissions: true,
      },
    });
    return c.json({ clients: clients });
  } catch (error) {
    console.error("Error:", error);
    return c.json({ error: "An error occurred while fetching clients" }, 500);
  }
};

export const routeGetClientSubmission = async (c: Context) => {
  const clientId = parseInt(c.req.param("id"));

  const submissions = await prisma.formSubmission.findMany({
    where: { clientId: clientId },
    orderBy: { createdAt: "desc" },
  });

  if (submissions.length === 0) {
    return c.json({ message: "No submissions found for this client" }, 404);
  }

  return c.json({ submissions });
};

export const postClients = async (c: Context) => {
  try {
    const body: Client = await c.req.json();
    const client = await prisma.client.create({
      data: {
        name: body.name,
        email: body.email,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
        agentId: body.agentId,
        tag: body.tag,
      },
    });
    return c.json({ client: client });
  } catch (error) {
    console.error("Error:", error);
    return c.json({ error: "An error occurred while creating a client" }, 500);
  }
};
