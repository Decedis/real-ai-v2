import { Context } from "hono";
import { prisma } from "../../utils/utils";
import { Agent } from "@prisma/client";

export const getAgents = async (c: Context) => {
  try {
    const agents = await prisma.agent.findMany();
    return c.json({ agents: agents });
  } catch (error) {
    console.error("Error:", error);
    return c.json({ error: "An error occurred while fetching agents" }, 500);
  }
};

export const postAgents = async (c: Context) => {
  try {
    const body: Agent = await c.req.json();
    const agent = await prisma.agent.create({
      data: {
        name: body.name,
        email: body.email,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
      },
    });
    return c.json({ agent: agent });
  } catch (error) {
    console.error("Error:", error);
    return c.json({ error: "An error occurred while creating an agent" }, 500);
  }
};
