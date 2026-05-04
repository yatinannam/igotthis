import { randomBytes } from "crypto";

export function generateInviteCode() {
  return randomBytes(3).toString("hex").toUpperCase();
}