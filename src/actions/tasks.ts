"use server";

import { redirect } from "next/navigation";
import { TaskCadence, TaskActivityType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { readString } from "@/lib/forms";
import { addDays } from "@/lib/dates";
import { assertHouseholdMembership, assertTaskAccess } from "@/lib/access";
import { createTaskSchema, taskActionSchema, taskHelpSchema } from "@/lib/validators";
import { requireSignedInUser } from "@/actions/auth";

export type TaskActionState = {
  error: string | null;
};

export async function createTaskAction(
  _previousState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const user = await requireSignedInUser();
  const parsed = createTaskSchema.safeParse({
    title: readString(formData, "title"),
    details: readString(formData, "details"),
    cadence: readString(formData, "cadence"),
    repeatEveryDays: readString(formData, "repeatEveryDays"),
  });

  const householdId = readString(formData, "householdId");

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the task details and try again." };
  }

  if (!householdId) {
    return { error: "Choose a household before creating a task." };
  }

  await assertHouseholdMembership(user.id, householdId);

  const task = await prisma.task.create({
    data: {
      householdId,
      createdById: user.id,
      title: parsed.data.title,
      details: parsed.data.details || null,
      cadence: parsed.data.cadence as TaskCadence,
      repeatEveryDays:
        parsed.data.cadence === "RECURRING" ? parsed.data.repeatEveryDays ?? 7 : null,
      dueAt: parsed.data.cadence === "RECURRING" ? new Date() : null,
      activities: {
        create: {
          actorId: user.id,
          type: TaskActivityType.CREATED,
        },
      },
    },
    select: { householdId: true },
  });

  redirect(`/dashboard?householdId=${task.householdId}`);
}

export async function claimTaskAction(
  _previousState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const user = await requireSignedInUser();
  const parsed = taskActionSchema.safeParse({
    taskId: readString(formData, "taskId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Pick a task to claim." };
  }

  const task = await prisma.task.findUnique({
    where: { id: parsed.data.taskId },
    select: { id: true, householdId: true, claimedById: true },
  });

  if (!task) {
    return { error: "Task not found." };
  }

  await assertTaskAccess(user.id, task.id);

  if (task.claimedById && task.claimedById !== user.id) {
    return { error: "Someone already claimed this task." };
  }

  await prisma.task.update({
    where: { id: task.id },
    data: {
      claimedById: user.id,
      claimedAt: new Date(),
      helpRequestedAt: null,
      helpNote: null,
    },
  });

  await prisma.taskActivity.create({
    data: {
      taskId: task.id,
      actorId: user.id,
      type: TaskActivityType.CLAIMED,
    },
  });

  redirect(`/dashboard?householdId=${task.householdId}`);
}

export async function completeTaskAction(
  _previousState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const user = await requireSignedInUser();
  const parsed = taskActionSchema.safeParse({
    taskId: readString(formData, "taskId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Pick a task to complete." };
  }

  const task = await prisma.task.findUnique({
    where: { id: parsed.data.taskId },
    select: {
      id: true,
      householdId: true,
      claimedById: true,
      cadence: true,
      repeatEveryDays: true,
    },
  });

  if (!task) {
    return { error: "Task not found." };
  }

  await assertTaskAccess(user.id, task.id);

  if (task.claimedById && task.claimedById !== user.id) {
    return { error: "Only the person who claimed this task can complete it." };
  }

  const completedAt = new Date();

  await prisma.task.update({
    where: { id: task.id },
    data: {
      completedAt,
      claimedById: null,
      claimedAt: null,
      helpRequestedAt: null,
      helpNote: null,
      dueAt:
        task.cadence === TaskCadence.RECURRING
          ? addDays(completedAt, task.repeatEveryDays ?? 7)
          : null,
    },
  });

  await prisma.taskActivity.create({
    data: {
      taskId: task.id,
      actorId: user.id,
      type: TaskActivityType.COMPLETED,
    },
  });

  redirect(`/dashboard?householdId=${task.householdId}`);
}

export async function requestHelpAction(
  _previousState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const user = await requireSignedInUser();
  const parsed = taskActionSchema.safeParse({
    taskId: readString(formData, "taskId"),
  });

  const helpParsed = taskHelpSchema.safeParse({
    helpNote: readString(formData, "helpNote"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Pick a task first." };
  }

  if (!helpParsed.success) {
    return { error: helpParsed.error.issues[0]?.message ?? "Keep the request short." };
  }

  const task = await prisma.task.findUnique({
    where: { id: parsed.data.taskId },
    select: {
      id: true,
      householdId: true,
      claimedById: true,
    },
  });

  if (!task) {
    return { error: "Task not found." };
  }

  await assertTaskAccess(user.id, task.id);

  if (task.claimedById && task.claimedById !== user.id) {
    return { error: "Only the current owner of this task can ask for help." };
  }

  await prisma.task.update({
    where: { id: task.id },
    data: {
      helpRequestedAt: new Date(),
      helpNote: helpParsed.data.helpNote || null,
    },
  });

  await prisma.taskActivity.create({
    data: {
      taskId: task.id,
      actorId: user.id,
      type: TaskActivityType.HELP_REQUESTED,
      note: helpParsed.data.helpNote || null,
    },
  });

  redirect(`/dashboard?householdId=${task.householdId}`);
}