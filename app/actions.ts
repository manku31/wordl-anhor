"use server";

import { prisma } from "@/lib/prisma";

export async function getData() {
  // Example: fetch a count of users using Prisma
  const count = await prisma.user.count();
  return { userCount: count };
}
