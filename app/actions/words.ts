"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/lib/session";

const AddWordSchema = z.object({
  word: z
    .string()
    .min(1, "Word is required")
    .max(100, "Word must be at most 100 characters"),
  details: z
    .string()
    .max(500, "Details must be at most 500 characters")
    .optional(),
});

export type AddWordState =
  | { success: true; wordId: number }
  | { success: false; error: string }
  | undefined;

export async function addWord(
  word: string,
  details?: string,
): Promise<AddWordState> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const parsed = AddWordSchema.safeParse({
    word: word.trim(),
    details: details?.trim() || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const created = await prisma.word.create({
    data: {
      word: parsed.data.word,
      details: parsed.data.details ?? null,
      userId: session.userId,
    },
  });

  // revalidatePath("/words");
  return { success: true, wordId: created.wordId };
}

export type WordRow = {
  id: number;
  word: string;
  details: string | null;
  meaning: string | null;
  example: string | null;
  isFavorite: boolean;
  isMastered: boolean;
  createdAt: string;
};

export async function getWords(): Promise<WordRow[]> {
  const session = await getSession();
  if (!session) return [];

  const words = await prisma.word.findMany({
    where: { userId: session.userId, isDeleted: false },
    orderBy: { createdAt: "desc" },
    select: {
      wordId: true,
      word: true,
      details: true,
      meaning: true,
      example: true,
      isFavorite: true,
      isMastered: true,
      createdAt: true,
    },
  });

  return words.map((w) => ({
    id: w.wordId,
    word: w.word,
    details: w.details,
    meaning: w.meaning,
    example: w.example,
    isFavorite: w.isFavorite,
    isMastered: w.isMastered,
    createdAt: w.createdAt.toISOString(),
  }));
}
