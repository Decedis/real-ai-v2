import { Context } from "hono";
import { prisma } from "../../utils/utils";

export const getDocuments = async (c: Context) => {
  try {
    const documents = await prisma.generatedDocuments.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return c.json({ documents: documents });
  } catch (error) {
    console.error("Error:", error);
    return c.json({ error: "An error occurred while fetching documents" }, 500);
  }
};
