import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import OpenAI from "openai";

import {
  routeGetSubmissions,
  routePostSubmissions,
} from "./Routes/DB/route-submissions";
import { generateDocument } from "./Routes/API/AI/generate-document";
import { getDocuments } from "./Routes/DB/route-documents";
import { getListings, postListings } from "./Routes/DB/route-listings";
import { getAgents, postAgents } from "./Routes/DB/route-agent";
import {
  getClients,
  postClients,
  routeGetClientSubmission,
} from "./Routes/DB/route-client";
import { tagClient } from "./Routes/API/AI/tag-client";
import { generateEmail } from "./Routes/API/AI/generate-email";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = new Hono();

app.use(logger(), prettyJSON());

app.use(
  "/api/*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);
app.use("*", async (c, next) => {
  console.log(`Request received: ${c.req.method} ${c.req.url}`);
  await next();
});

//Inquiry Form
app.post("/api/submissions", routePostSubmissions);
app.get("/api/submissions", routeGetSubmissions);

//Agents
app.post("/api/agents", postAgents);
app.get("/api/agents", getAgents);

//Clients
app.post("/api/clients", postClients);
app.get("/api/clients", getClients);
app.get("/api/client-submissions/:id", routeGetClientSubmission);

//AI Stuff
// generate inquiry summary
app.post("/api/generate-document", generateDocument);
app.get("/api/documents", getDocuments);

// generate client tags
app.post("/api/tag-client", tagClient);

// generate email for specific clients
app.post("/api/generate-email", generateEmail);

//Listings
app.post("/api/listings", postListings);
app.get("/api/listings", getListings);

export default app;
