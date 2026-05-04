"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { ActionState } from "@/actions/auth";
import { PendingButton } from "@/components/pending-button";

type AuthFormProps = {
  mode: "login" | "signup";
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
};

const initialState: ActionState = { error: null };

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {mode === "signup" ? (
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">Name</span>
          <input
            name="name"
            autoComplete="name"
            placeholder="Maya"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/10"
            required
          />
        </label>
      ) : null}

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-200">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/10"
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-200">Password</span>
        <input
          name="password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          placeholder={
            mode === "signup" ? "At least 8 characters" : "Your password"
          }
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/10"
          required
        />
      </label>

      {state.error ? (
        <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {state.error}
        </p>
      ) : null}

      <PendingButton
        pendingLabel={
          mode === "signup" ? "Making your account..." : "Signing in..."
        }
        className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {mode === "signup" ? "Create account" : "Sign in"}
      </PendingButton>

      <p className="text-sm text-slate-400">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-200">
              Sign in
            </Link>
          </>
        ) : (
          <>
            Need an account?{" "}
            <Link href="/signup" className="text-cyan-200">
              Create one
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
