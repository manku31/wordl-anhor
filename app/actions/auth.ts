"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  SignupSchema,
  LoginSchema,
  type SignupFormState,
  type LoginFormState,
} from "@/app/lib/definitions";
import { createSession, deleteSession } from "@/app/lib/session";

export async function signup(
  prevState: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const raw = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = SignupSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      errors: {
        username: fieldErrors.username,
        email: fieldErrors.email,
        password: fieldErrors.password,
        confirmPassword: fieldErrors.confirmPassword,
      },
    };
  }

  const { username, email, password } = result.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
    select: { username: true, email: true },
  });

  if (existing) {
    if (existing.username === username) {
      return { errors: { username: ["Username is already taken"] } };
    }
    return { errors: { email: ["Email is already in use"] } };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { username, email, password: hashedPassword },
    select: { userId: true, username: true },
  });

  await createSession(user.userId, user.username);
  redirect("/");
}

export async function login(
  prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const raw = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  const result = LoginSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      errors: {
        username: fieldErrors.username,
        password: fieldErrors.password,
      },
    };
  }

  const { username, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { username },
    select: { userId: true, username: true, password: true, isActive: true },
  });

  if (!user || !user.isActive) {
    return { message: "Invalid username or password" };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return { message: "Invalid username or password" };
  }

  await createSession(user.userId, user.username);
  redirect("/");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
