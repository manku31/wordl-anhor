"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/lib/session";
import { getWordDefinition } from "@/lib/openai";

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

  // Enrich with AI-generated meaning + example (best-effort, non-blocking)
  const definition = await getWordDefinition(
    parsed.data.word,
    parsed.data.details,
  );
  if (definition) {
    await prisma.word.update({
      where: { wordId: created.wordId },
      data: { meaning: definition.meaning, example: definition.example },
    });
  }

  revalidatePath("/words");
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

export async function toggleFavorite(
  wordId: number,
  value: boolean,
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  await prisma.word.update({
    where: { wordId, userId: session.userId },
    data: { isFavorite: value },
  });

  return { success: true };
}

export async function toggleMastered(
  wordId: number,
  value: boolean,
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  await prisma.word.update({
    where: { wordId, userId: session.userId },
    data: { isMastered: value },
  });

  return { success: true };
}

export type UpdateWordState =
  | { success: true; changed: boolean }
  | { success: false; error: string }
  | undefined;

export async function updateWord(
  wordId: number,
  word: string,
  details?: string,
): Promise<UpdateWordState> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const parsed = AddWordSchema.safeParse({
    word: word.trim(),
    details: details?.trim() || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  // Server-side no-change check — avoids a pointless DB write
  const existing = await prisma.word.findUnique({
    where: { wordId, userId: session.userId },
    select: { word: true, details: true },
  });

  if (!existing) return { success: false, error: "Word not found" };

  const newWord = parsed.data.word;
  const newDetails = parsed.data.details ?? null;

  if (existing.word === newWord && existing.details === newDetails) {
    return { success: true, changed: false };
  }

  const wordTextChanged = existing.word !== newWord;

  // Re-generate meaning/example only when the word itself changes
  let aiUpdate: { meaning?: string; example?: string } = {};
  if (wordTextChanged) {
    const definition = await getWordDefinition(newWord, newDetails);
    if (definition) {
      aiUpdate = { meaning: definition.meaning, example: definition.example };
    }
  }

  await prisma.word.update({
    where: { wordId, userId: session.userId },
    data: { word: newWord, details: newDetails, ...aiUpdate },
  });

  revalidatePath("/words");
  return { success: true, changed: true };
}

export async function deleteWord(
  wordId: number,
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  await prisma.word.update({
    where: { wordId, userId: session.userId },
    data: { isDeleted: true },
  });

  revalidatePath("/words");
  return { success: true };
}
