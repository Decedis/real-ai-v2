import { Context } from "hono";
import { prisma } from "../../utils/utils";
import { Listing } from "../../utils/types";

export const postListings = async (c: Context) => {
  try {
    const body: Listing = await c.req.json();
    const listing = await prisma.listing.create({
      data: {
        address: body.address,
        price: body.price,
        description: body.description,
        size: body.size,
        beds: body.beds,
        baths: body.baths,
      },
    });
    return c.json({ listing: listing }, 201);
  } catch (error) {
    console.error("Error:", error);
    return c.json({ error: "An error occurred while creating a listing" }, 500);
  }
};
export const getListings = async (c: Context) => {
  try {
    const listings = await prisma.listing.findMany();
    return c.json({ listings: listings });
  } catch (error) {
    console.error("Error:", error);
    return c.json({ error: "An error occurred while fetching listings" }, 500);
  }
};
