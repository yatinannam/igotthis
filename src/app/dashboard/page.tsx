import Link from "next/link";
import { redirect } from "next/navigation";
import { TaskCadence } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireSignedInUser, signOutAction } from "@/actions/auth";
import {
  createHouseholdAction,
  joinHouseholdAction,
} from "@/actions/households";
import {
  claimTaskAction,
  completeTaskAction,
  createTaskAction,
  requestHelpAction,
} from "@/actions/tasks";
import { HouseholdForm } from "@/components/household-form";
import { PendingButton } from "@/components/pending-button";
import { TaskActions } from "@/components/task-actions";
import { TaskForm } from "@/components/task-form";
import { formatRelativeDayCount, formatShortDate } from "@/lib/dates";

type DashboardPageProps = {
  searchParams?: {
    householdId?: string | string[];
  };
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const user = await requireSignedInUser();

  const memberships = await prisma.householdMember.findMany({
    where: { userId: user.id },
    orderBy: { joinedAt: "desc" },
    include: {
      household: {
        select: {
          id: true,
          name: true,
          inviteCode: true,
          createdAt: true,
        },
      },
    },
  });

  if (memberships.length === 0) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_28%),linear-gradient(180deg,_#07111f_0%,_#020617_100%)] px-6 py-10 text-white">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center gap-8">
          <section className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
              I Got This
            </p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Set up your first household.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300">
              Create a space for your roommates, family, or partner so tasks can
              be claimed without the reminder loop.
            </p>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <HouseholdForm mode="create" action={createHouseholdAction} />
            <HouseholdForm mode="join" action={joinHouseholdAction} />
          </div>
        </div>
      </main>
    );
  }

  const requestedHouseholdId = Array.isArray(searchParams?.householdId)
    ? searchParams?.householdId[0]
    : searchParams?.householdId;
  const selectedMembership =
    memberships.find(
      (membership) => membership.householdId === requestedHouseholdId,
    ) ?? memberships[0];

  if (!selectedMembership) {
    redirect("/login");
  }

  const selectedHousehold = await prisma.household.findUnique({
    where: { id: selectedMembership.householdId },
    include: {
      members: {
        orderBy: { joinedAt: "asc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      tasks: {
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        include: {
          claimedBy: {
            select: {
              id: true,
              name: true,
            },
          },
          activities: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: {
              actor: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!selectedHousehold) {
    redirect("/dashboard");
  }

  const recentActivities = await prisma.taskActivity.findMany({
    where: {
      task: {
        householdId: selectedHousehold.id,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: {
      actor: {
        select: {
          name: true,
        },
      },
      task: {
        select: {
          title: true,
        },
      },
    },
  });

  const now = new Date();
  const activeTasks = selectedHousehold.tasks.filter((task) =>
    isTaskActionable(task, now),
  );
  const quietTasks = selectedHousehold.tasks.filter(
    (task) => !isTaskActionable(task, now),
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_28%),linear-gradient(180deg,_#07111f_0%,_#020617_100%)] px-4 py-4 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_30px_120px_rgba(15,23,42,0.35)] backdrop-blur md:p-6">
        <header className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
              I Got This
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              {selectedHousehold.name}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Invite code {selectedHousehold.inviteCode} ·{" "}
              {selectedHousehold.members.length} member
              {selectedHousehold.members.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              Home
            </Link>
            <form action={signOutAction}>
              <PendingButton
                pendingLabel="Signing out..."
                className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Sign out
              </PendingButton>
            </form>
          </div>
        </header>

        <section className="flex flex-wrap gap-3">
          {memberships.map((membership) => (
            <Link
              key={membership.householdId}
              href={`/dashboard?householdId=${membership.householdId}`}
              className={[
                "rounded-full px-4 py-2 text-sm font-medium transition",
                membership.householdId === selectedHousehold.id
                  ? "bg-cyan-300 text-slate-950"
                  : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
              ].join(" ")}
            >
              {membership.household.name}
            </Link>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/50 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
                  Household pulse
                </p>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <p>
                    Created {formatShortDate(selectedHousehold.createdAt)} by{" "}
                    {selectedMembership.role === "OWNER"
                      ? "you"
                      : "someone in the household"}
                    .
                  </p>
                  <p>
                    {activeTasks.length} task
                    {activeTasks.length === 1 ? "" : "s"} need attention right
                    now.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedHousehold.members.map((member) => (
                    <span
                      key={member.id}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                    >
                      {member.user.name}
                    </span>
                  ))}
                </div>
              </article>

              <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/50 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
                  Invite flow
                </p>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <p>
                    Share the invite code with anyone who needs to join this
                    household.
                  </p>
                  <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base font-semibold tracking-[0.25em] text-white">
                    {selectedHousehold.inviteCode}
                  </p>
                </div>
              </article>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <article className="space-y-4 rounded-[1.75rem] border border-white/10 bg-slate-950/50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
                      Tasks
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      Visible and claimable
                    </h2>
                  </div>
                  <p className="text-sm text-slate-400">
                    {selectedHousehold.tasks.length} total
                  </p>
                </div>

                <div className="space-y-4">
                  {selectedHousehold.tasks.map((task) => {
                    const state = getTaskState(task, user.id, now);

                    return (
                      <article
                        key={task.id}
                        className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={state.badgeClass}>
                                {state.badge}
                              </span>
                              <span className="text-xs uppercase tracking-[0.22em] text-slate-500">
                                {task.cadence === TaskCadence.RECURRING
                                  ? "Recurring"
                                  : "One-time"}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                              {task.title}
                            </h3>
                            {task.details ? (
                              <p className="max-w-2xl text-sm leading-6 text-slate-300">
                                {task.details}
                              </p>
                            ) : null}
                            <p className="text-xs text-slate-400">
                              {state.detail}
                            </p>
                          </div>

                          <TaskActions
                            taskId={task.id}
                            canClaim={state.canClaim}
                            canComplete={state.canComplete}
                            canAskForHelp={state.canAskForHelp}
                            claimAction={claimTaskAction}
                            completeAction={completeTaskAction}
                            requestHelpAction={requestHelpAction}
                          />
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          {task.claimedBy ? (
                            <span>Claimed by {task.claimedBy.name}</span>
                          ) : (
                            <span>Open to the household</span>
                          )}
                          {task.helpRequestedAt ? (
                            <span>Help requested</span>
                          ) : null}
                          {task.cadence === TaskCadence.RECURRING &&
                          task.dueAt ? (
                            <span>
                              Next due {formatRelativeDayCount(task.dueAt, now)}
                            </span>
                          ) : null}
                          {task.activities[0] ? (
                            <span>
                              Latest activity by {task.activities[0].actor.name}
                            </span>
                          ) : null}
                        </div>
                      </article>
                    );
                  })}

                  {selectedHousehold.tasks.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-300">
                      No tasks yet. Add the first one and make the invisible
                      stuff visible.
                    </div>
                  ) : null}
                </div>
              </article>

              <div className="space-y-6">
                <TaskForm
                  householdId={selectedHousehold.id}
                  action={createTaskAction}
                />

                <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/50 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
                    Recent activity
                  </p>
                  <div className="mt-4 space-y-3">
                    {recentActivities.length === 0 ? (
                      <p className="text-sm text-slate-400">
                        No activity yet. Claim or complete a task to start the
                        history.
                      </p>
                    ) : null}
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                      >
                        <p className="font-medium text-white">
                          {describeActivity(activity.type)}
                        </p>
                        <p className="mt-1 text-slate-400">
                          {activity.actor.name} · {activity.task.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/50 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
                People
              </p>
              <div className="mt-4 space-y-3">
                {selectedHousehold.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-white">
                        {member.user.name}
                      </p>
                      <p className="text-slate-400">{member.user.email}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
                      {member.userId === user.id
                        ? "You"
                        : member.role.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/50 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
                Add another household
              </p>
              <div className="mt-4 space-y-4">
                <HouseholdForm mode="create" action={createHouseholdAction} />
                <HouseholdForm mode="join" action={joinHouseholdAction} />
              </div>
            </article>

            {quietTasks.length > 0 ? (
              <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/50 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
                  Quiet tasks
                </p>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  {quietTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <p className="font-medium text-white">{task.title}</p>
                      <p className="mt-1 text-slate-400">
                        {getQuietTaskLabel(task, now)}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ) : null}
          </aside>
        </section>
      </div>
    </main>
  );
}

function isTaskActionable(
  task: {
    cadence: TaskCadence;
    completedAt: Date | null;
    dueAt: Date | null;
    claimedById: string | null;
    helpRequestedAt: Date | null;
  },
  now: Date,
) {
  if (task.cadence === TaskCadence.RECURRING) {
    return !task.dueAt || task.dueAt <= now;
  }

  return !task.completedAt;
}

function getQuietTaskLabel(
  task: {
    cadence: TaskCadence;
    completedAt: Date | null;
    dueAt: Date | null;
    claimedById: string | null;
    helpRequestedAt: Date | null;
  },
  now: Date,
) {
  if (
    task.cadence === TaskCadence.RECURRING &&
    task.dueAt &&
    task.dueAt > now
  ) {
    return `Resting until ${formatShortDate(task.dueAt)}`;
  }

  if (task.completedAt) {
    return `Completed ${formatShortDate(task.completedAt)}`;
  }

  return task.claimedById ? "Claimed" : "Open";
}

function getTaskState(
  task: {
    cadence: TaskCadence;
    completedAt: Date | null;
    dueAt: Date | null;
    claimedById: string | null;
    helpRequestedAt: Date | null;
  },
  userId: string,
  now: Date,
) {
  const isRecurring = task.cadence === TaskCadence.RECURRING;
  const isResting = isRecurring && !!task.dueAt && task.dueAt > now;
  const isClaimedByMe = task.claimedById === userId;
  const isClaimedBySomeoneElse = Boolean(task.claimedById && !isClaimedByMe);

  if (isResting) {
    return {
      badge: "Resting",
      badgeClass:
        "rounded-full bg-cyan-300 px-3 py-1 text-xs font-semibold text-slate-950",
      detail: `Next cycle opens ${formatShortDate(task.dueAt as Date)}.`,
      canClaim: false,
      canComplete: false,
      canAskForHelp: false,
    };
  }

  if (task.helpRequestedAt) {
    return {
      badge: "Needs help",
      badgeClass:
        "rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-slate-950",
      detail: isClaimedByMe
        ? "You marked this as needing help."
        : isClaimedBySomeoneElse
          ? "Someone asked for help on this task."
          : "Help is visible to the household.",
      canClaim: !isClaimedBySomeoneElse,
      canComplete: isClaimedByMe,
      canAskForHelp: isClaimedByMe,
    };
  }

  if (task.completedAt && !isRecurring) {
    return {
      badge: "Done",
      badgeClass:
        "rounded-full bg-emerald-300 px-3 py-1 text-xs font-semibold text-slate-950",
      detail: `Completed ${formatShortDate(task.completedAt)}.`,
      canClaim: false,
      canComplete: false,
      canAskForHelp: false,
    };
  }

  if (isClaimedByMe) {
    return {
      badge: "With you",
      badgeClass:
        "rounded-full bg-cyan-300 px-3 py-1 text-xs font-semibold text-slate-950",
      detail:
        task.completedAt && isRecurring
          ? `Last completed ${formatShortDate(task.completedAt)}.`
          : "You have this one.",
      canClaim: false,
      canComplete: true,
      canAskForHelp: true,
    };
  }

  if (isClaimedBySomeoneElse) {
    return {
      badge: "Claimed",
      badgeClass:
        "rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-950",
      detail: "Another household member already grabbed this one.",
      canClaim: false,
      canComplete: false,
      canAskForHelp: false,
    };
  }

  return {
    badge: "Open",
    badgeClass:
      "rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-950",
    detail: isRecurring
      ? "Ready for the next round."
      : "Anyone in the household can claim this.",
    canClaim: true,
    canComplete: false,
    canAskForHelp: false,
  };
}

function describeActivity(type: string) {
  switch (type) {
    case "CREATED":
      return "Task created";
    case "CLAIMED":
      return "Task claimed";
    case "COMPLETED":
      return "Task completed";
    case "HELP_REQUESTED":
      return "Help requested";
    case "UNCLAIMED":
      return "Task unclaimed";
    default:
      return "Task update";
  }
}
