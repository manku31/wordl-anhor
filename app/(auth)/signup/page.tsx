"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { AnchorIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { signup } from "@/app/actions/auth";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, formAction, isPending] = useActionState(signup, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <span className="flex items-center justify-center rounded-xl bg-neutral-900 p-2.5 text-white ring-1 ring-neutral-800">
            <AnchorIcon className="h-6 w-6" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Create an account
          </h1>
          <p className="text-sm text-neutral-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-white underline underline-offset-4 hover:text-neutral-200"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 shadow-2xl backdrop-blur-sm">
          <form action={formAction} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-neutral-200"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="your_username"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20"
              />
              {state?.errors?.username && (
                <p className="text-xs text-red-400">
                  {state.errors.username[0]}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-200"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20"
              />
              {state?.errors?.email && (
                <p className="text-xs text-red-400">{state.errors.email[0]}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-200"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {state?.errors?.password ? (
                <p className="text-xs text-red-400">
                  {state.errors.password[0]}
                </p>
              ) : (
                <p className="text-xs text-neutral-500">
                  Min 8 chars, at least one letter and one number.
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-neutral-200"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {state?.errors?.confirmPassword && (
                <p className="text-xs text-red-400">
                  {state.errors.confirmPassword[0]}
                </p>
              )}
            </div>

            {/* Global error */}
            {state?.message && (
              <p className="text-xs text-red-400">{state.message}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 disabled:opacity-60"
            >
              {isPending ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
