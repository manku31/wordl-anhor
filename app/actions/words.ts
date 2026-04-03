"use server";

export type AddWordState =
  | { success: true; wordId: number }
  | { success: false; error: string }
  | undefined;

export async function addWord(
  _word: string,
  _details?: string,
): Promise<AddWordState> {
  throw new Error("Not implemented");
}

export async function getWords() {
  return [];
}
