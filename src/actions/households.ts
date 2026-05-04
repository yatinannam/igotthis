"use server";

import { redirect } from "next/navigation";
import { HouseholdRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { generateInviteCode } from "@/lib/codes";
import { readString } from "@/lib/forms";
import { createHouseholdSchema, joinHouseholdSchema } from "@/lib/validators";
import { requireSignedInUser } from "@/actions/auth";

export type HouseholdActionState = {
  error: string | null;
};

async function createUniqueInviteCode() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const inviteCode = generateInviteCode();
    const existingHousehold = await prisma.household.findUnique({
      where: { inviteCode },
      select: { id: true },
    });

    if (!existingHousehold) {
      return inviteCode;
    }
  }

  throw new Error("Could not generate a unique invite code.");
}

export async function createHouseholdAction(
  _previousState: HouseholdActionState,
  formData: FormData,
): Promise<HouseholdActionState> {
  const user = await requireSignedInUser();
  const parsed = createHouseholdSchema.safeParse({
    name: readString(formData, "name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a household name." };
  }

  const inviteCode = await createUniqueInviteCode();

  const household = await prisma.household.create({
    data: {
      name: parsed.data.name,
      inviteCode,
      createdById: user.id,
      members: {
        create: {
          userId: user.id,
          role: HouseholdRole.OWNER,
        },
      },
    },
  });

  redirect(`/dashboard?householdId=${household.id}`);
}

export async function joinHouseholdAction(
  _previousState: HouseholdActionState,
  formData: FormData,
): Promise<HouseholdActionState> {
  const user = await requireSignedInUser();
  const parsed = joinHouseholdSchema.safeParse({
    inviteCode: readString(formData, "inviteCode"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid invite code." };
  }

  const household = await prisma.household.findUnique({
    where: { inviteCode: parsed.data.inviteCode },
    select: { id: true },
  });

  if (!household) {
    return { error: "No household matches that invite code." };
  }

  await prisma.householdMember.upsert({
    where: {
      userId_householdId: {
        userId: user.id,
        householdId: household.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      householdId: household.id,
      role: HouseholdRole.MEMBER,
    },
  });

  redirect(`/dashboard?householdId=${household.id}`);
}