"use client";

import { useActionState } from "react";
import type { HouseholdActionState } from "@/actions/households";
import { PendingButton } from "@/components/pending-button";

type HouseholdFormProps = {
  mode: "create" | "join";
  action: (
    state: HouseholdActionState,
    formData: FormData,
  ) => Promise<HouseholdActionState>;
};

const initialState: HouseholdActionState = { error: null };

export function HouseholdForm({ mode, action }: HouseholdFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
          {mode === "create" ? "Create household" : "Join household"}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-white">
          {mode === "create" ? "Start a new space" : "Bring your invite code"}
        </h3>
      </div>

      {mode === "create" ? (
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">
            Household name
          </span>
          <input
            name="name"
            placeholder="The Ridge Crew"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-slate-950/60"
            required
          />
        </label>
      ) : (
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">
            Invite code
          </span>
          <input
            name="inviteCode"
            placeholder="A1B2C3"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-slate-950/60"
            required
          />
        </label>
      )}

      {state.error ? (
        <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {state.error}
        </p>
      ) : null}

      <PendingButton
        pendingLabel={mode === "create" ? "Creating..." : "Joining..."}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {mode === "create" ? "Create household" : "Join household"}
      </PendingButton>
    </form>
  );
}
