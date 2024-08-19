import { FormSubmission, PrismaClient } from "@prisma/client";
import { Context } from "hono";
import OpenAI from "openai";
import { prisma } from "../../../utils/utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateDocument = async (c: Context) => {
  try {
    let submissionData: FormSubmission[] = [];
    try {
      const mostRecentDocument = await prisma.generatedDocuments.findFirst({
        orderBy: { createdAt: "desc" },
      });

      if (mostRecentDocument) {
        submissionData = await prisma.formSubmission.findMany({
          where: {
            createdAt: { gt: mostRecentDocument.createdAt },
          },
        });
        console.log(submissionData);
      } else {
        console.log("No submissions found");
      }
    } catch (error) {
      console.error("Error fetching submission data:", error);
    }

    if (submissionData.length === 0) {
      return c.json({ error: "No data found" }, 404);
    }

    const formattedData = submissionData
      .map(
        (submission) =>
          `Email: ${submission.email}\nSubmission: ${submission.content}`
      )
      .join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates documents that sorts submissions by email. You summarize the days total submissions, and point out people who are more interested in property.",
        },
        {
          role: "user",
          content: `Here are the form submissions:\n\n${formattedData}\n\nPlease sort these submissions by email and provide a daily summary with a highlight on who to follow up with.`,
        },
      ],
    });

    const generatedText = completion.choices[0].message.content;

    if (generatedText === null) {
      throw new Error("Failed to generate text");
    }

    await prisma.generatedDocuments.create({
      data: {
        content: generatedText,
      },
    });

    return c.json({
      message: "Document generated successfully",
      document: generatedText,
    });
  } catch (error) {
    console.error("Error:", error);
    return c.json(
      { error: "An error occurred while generating the document" },
      500
    );
  }
};
