import { Status } from "@prisma/client";
import { SessionPayload } from "./auth";

export function isManager(session: SessionPayload | null): boolean {
  return session?.role === "MANAGER";
}

export function isTechnical(session: SessionPayload | null): boolean {
  return session?.role === "TECHNICAL";
}

export function isEmployee(session: SessionPayload | null): boolean {
  return session?.role === "EMPLOYEE";
}

/**
 * Validates whether a user session can perform a given status transition.
 */
export function canTransitionStatus(
  session: SessionPayload | null,
  currentStatus: Status,
  targetStatus: Status,
  createdById: string,
  assignedToId?: string | null
): boolean {
  if (!session) return false;

  // Manager override capability for any valid status state change
  if (session.role === "MANAGER") {
    return currentStatus !== targetStatus;
  }

  // Technical staff status workflow
  if (session.role === "TECHNICAL") {
    if (assignedToId !== session.userId) return false;
    if (currentStatus === "ASSIGNED" && targetStatus === "IN_PROGRESS") return true;
    if (currentStatus === "IN_PROGRESS" && targetStatus === "RESOLVED") return true;
    return false;
  }

  // Employee status workflow
  if (session.role === "EMPLOYEE") {
    if (createdById !== session.userId) return false;
    if (currentStatus === "RESOLVED" && targetStatus === "CLOSED") return true;
    return false;
  }

  return false;
}
