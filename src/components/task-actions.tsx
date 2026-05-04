"use client";

import { useActionState } from "react";
import type { TaskActionState } from "@/actions/tasks";
import { PendingButton } from "@/components/pending-button";

type TaskActionsProps = {
  taskId: string;
  canClaim: boolean;
  canComplete: boolean;
  canAskForHelp: boolean;
  claimAction: (
    state: TaskActionState,
    formData: FormData,
  ) => Promise<TaskActionState>;
  completeAction: (
    state: TaskActionState,
    formData: FormData,
  ) => Promise<TaskActionState>;
  requestHelpAction: (
    state: TaskActionState,
    formData: FormData,
  ) => Promise<TaskActionState>;
};

const initialState: TaskActionState = { error: null };

export function TaskActions({
  taskId,
  canClaim,
  canComplete,
  canAskForHelp,
  claimAction,
  completeAction,
  requestHelpAction,
}: TaskActionsProps) {
  const [claimState, claimFormAction] = useActionState(
    claimAction,
    initialState,
  );
  const [completeState, completeFormAction] = useActionState(
    completeAction,
    initialState,
  );
  const [helpState, helpFormAction] = useActionState(
    requestHelpAction,
    initialState,
  );

  return (
    <div className="flex shrink-0 flex-wrap gap-2 lg:flex-col lg:items-end">
      {canClaim ? (
        <form action={claimFormAction}>
          <input type="hidden" name="taskId" value={taskId} />
          <PendingButton
            pendingLabel="Claiming..."
            className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            I got this
          </PendingButton>
          {claimState.error ? (
            <p className="mt-2 text-xs text-rose-200">{claimState.error}</p>
          ) : null}
        </form>
      ) : null}

      {canComplete ? (
        <form action={completeFormAction}>
          <input type="hidden" name="taskId" value={taskId} />
          <PendingButton
            pendingLabel="Completing..."
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Mark complete
          </PendingButton>
          {completeState.error ? (
            <p className="mt-2 text-xs text-rose-200">{completeState.error}</p>
          ) : null}
        </form>
      ) : null}

      {canAskForHelp ? (
        <form
          action={helpFormAction}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <input type="hidden" name="taskId" value={taskId} />
          <input
            name="helpNote"
            placeholder="Need a quick hand?"
            className="w-full rounded-full border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
          />
          <PendingButton
            pendingLabel="Sending..."
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            I need help
          </PendingButton>
          {helpState.error ? (
            <p className="mt-2 text-xs text-rose-200">{helpState.error}</p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
