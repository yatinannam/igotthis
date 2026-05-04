"use client";

import { useActionState } from "react";
import type { TaskActionState } from "@/actions/tasks";
import { PendingButton } from "@/components/pending-button";

type TaskFormProps = {
  householdId: string;
  action: (
    state: TaskActionState,
    formData: FormData,
  ) => Promise<TaskActionState>;
};

const initialState: TaskActionState = { error: null };

export function TaskForm({ householdId, action }: TaskFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
          Add task
        </p>
        <h3 className="mt-2 text-lg font-semibold text-white">
          Make the next thing obvious
        </h3>
      </div>

      <input type="hidden" name="householdId" value={householdId} />

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-200">Task title</span>
        <input
          name="title"
          placeholder="Take the bins out"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-slate-950/60"
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-200">Details</span>
        <textarea
          name="details"
          rows={3}
          placeholder="Optional context, like where the bags are or what needs to happen."
          className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-slate-950/60"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">Cadence</span>
          <select
            name="cadence"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300 focus:bg-slate-950/60"
            defaultValue="ONE_TIME"
          >
            <option value="ONE_TIME">One-time</option>
            <option value="RECURRING">Recurring</option>
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">
            Repeat every days
          </span>
          <input
            name="repeatEveryDays"
            type="number"
            min="1"
            defaultValue="7"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-slate-950/60"
            placeholder="7"
          />
        </label>
      </div>

      {state.error ? (
        <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {state.error}
        </p>
      ) : null}

      <PendingButton
        pendingLabel="Saving task..."
        className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
      >
        Create task
      </PendingButton>
    </form>
  );
}
