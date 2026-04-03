"use server";

export interface SessionPayload {
  userId: number;
  username: string;
  expiresAt: string;
}

export async function createSession(_userId: number, _username: string) {
  throw new Error("Not implemented");
}

export async function getSession(): Promise<SessionPayload | null> {
  return null;
}

export async function deleteSession() {
  throw new Error("Not implemented");
}
