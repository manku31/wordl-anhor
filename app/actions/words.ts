"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/lib/session";

export type AddWordState =
  | { success: true; wordId: number }
  | { success: false; error: string }
  | undefined;

// ── Add a word ──────────────────────────────────────────────────────────────
export async function addWord(
  word: string,
  details?: string,
): Promise<AddWordState> {
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, error: "Not authenticated." };
  }

  if (!word.trim()) {
    return { success: false, error: "Word is required." };
  }

  const created = await prisma.word.create({
    data: {
      word: word.trim(),
      details: details?.trim() || null,
      userId: session.userId,
    },
  });

  return { success: true, wordId: created.id };
}

// ── Get all words for the current user ─────────────────────────────────────
export async function getWords() {
  const session = await getSession();
  if (!session?.userId) return [];

  return prisma.word.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });
}
