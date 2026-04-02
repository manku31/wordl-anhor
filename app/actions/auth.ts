"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import {
  SignupFormSchema,
  SignupFormState,
  LoginFormSchema,
  LoginFormState,
} from "@/app/lib/definitions";
import { createSession, deleteSession } from "@/app/lib/session";
import { prisma } from "@/lib/prisma";

// ── Signup ──────────────────────────────────────────────────────────────────
export async function signup(
  state: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const raw = {
    username: formData.get("username"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validated = SignupFormSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { username, password } = validated.data;
  const hashedPassword = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { errors: { username: ["Username is already taken."] } };
  }

  const user = await prisma.user.create({
    data: { username, password: hashedPassword },
  });

  await createSession(user.id, username);
  redirect("/");
}

// ── Login ───────────────────────────────────────────────────────────────────
export async function login(
  state: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const raw = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  const validated = LoginFormSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { username, password } = validated.data;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return { message: "Invalid username or password." };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return { message: "Invalid username or password." };
  }

  await createSession(user.id, username);
  redirect("/");
}

// ── Logout ──────────────────────────────────────────────────────────────────
export async function logout() {
  await deleteSession();
  redirect("/login");
}
