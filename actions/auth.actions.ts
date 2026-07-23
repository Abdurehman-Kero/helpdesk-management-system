"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/auth";
import {
  loginSchema,
  registerSchema,
  LoginInput,
  RegisterInput,
} from "@/lib/validations/auth.schema";

export async function registerUser(input: RegisterInput) {
  const result = registerSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || "Invalid input" };
  }

  const { name, email, password, role } = result.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { success: false, error: "An account with this email already exists." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role,
      },
    });

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return { success: true };
  } catch (error) {
    console.error("Register Error:", error);
    return { success: false, error: "Registration failed. Please try again." };
  }
}

export async function loginUser(input: LoginInput) {
  const result = loginSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || "Invalid input" };
  }

  const { email, password } = result.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordsMatch) {
      return { success: false, error: "Invalid email or password." };
    }

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return { success: true };
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, error: "Login failed. Please try again." };
  }
}

export async function logoutUser() {
  await destroySession();
  redirect("/login");
}
