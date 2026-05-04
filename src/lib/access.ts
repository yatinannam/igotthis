import { prisma } from "@/lib/db";

export async function assertHouseholdMembership(userId: string, householdId: string) {
  const member = await prisma.householdMember.findUnique({
    where: {
      userId_householdId: {
        userId,
        householdId,
      },
    },
    select: {
      id: true,
      role: true,
      householdId: true,
      userId: true,
    },
  });

  if (!member) {
    throw new Error("You do not belong to this household.");
  }

  return member;
}

export async function assertTaskAccess(userId: string, taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { householdId: true },
  });

  if (!task) {
    throw new Error("Task not found.");
  }

  await assertHouseholdMembership(userId, task.householdId);

  return task;
}