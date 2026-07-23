"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { canTransitionStatus, isManager } from "@/lib/permissions";
import {
  createTicketSchema,
  assignTicketSchema,
  updateStatusSchema,
  updatePrioritySchema,
  commentSchema,
  CreateTicketInput,
  AssignTicketInput,
  UpdateStatusInput,
  UpdatePriorityInput,
  CommentInput,
} from "@/lib/validations/ticket.schema";

export async function createTicket(input: CreateTicketInput) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  const result = createTicketSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || "Invalid ticket data" };
  }

  const { title, description, category, priority } = result.data;

  try {
    const totalCount = await prisma.ticket.count();
    const ticketNumber = `TKT-${String(totalCount + 1).padStart(3, "0")}`;

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        title,
        description,
        category,
        priority,
        status: "OPEN",
        createdById: session.userId,
        activities: {
          create: {
            userId: session.userId,
            type: "STATUS_CHANGE",
            message: "Ticket created",
          },
        },
      },
    });

    revalidatePath("/tickets");
    revalidatePath("/dashboard");

    return { success: true, ticketId: ticket.id };
  } catch (error) {
    console.error("Create Ticket Error:", error);
    return { success: false, error: "Failed to create ticket. Please try again." };
  }
}

export async function assignTicket(input: AssignTicketInput) {
  const session = await getSession();
  if (!session || !isManager(session)) {
    return { success: false, error: "Only managers can assign tickets." };
  }

  const result = assignTicketSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || "Invalid assignment data" };
  }

  const { ticketId, assignedToId } = result.data;

  try {
    const assignee = await prisma.user.findUnique({
      where: { id: assignedToId },
      select: { name: true, role: true },
    });

    if (!assignee || assignee.role !== "TECHNICAL") {
      return { success: false, error: "Selected user is not technical staff." };
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        assignedToId,
        status: "ASSIGNED",
        activities: {
          create: {
            userId: session.userId,
            type: "ASSIGNMENT",
            message: `Assigned to ${assignee.name}`,
          },
        },
      },
    });

    revalidatePath(`/tickets/${ticketId}`);
    revalidatePath("/tickets");
    revalidatePath("/dashboard");

    return { success: true, ticket: updated };
  } catch (error) {
    console.error("Assign Ticket Error:", error);
    return { success: false, error: "Failed to assign ticket." };
  }
}

export async function updateTicketStatus(input: UpdateStatusInput) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized." };
  }

  const result = updateStatusSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || "Invalid status data" };
  }

  const { ticketId, status: newStatus } = result.data;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return { success: false, error: "Ticket not found." };
    }

    const allowed = canTransitionStatus(
      session,
      ticket.status,
      newStatus,
      ticket.createdById,
      ticket.assignedToId
    );

    if (!allowed) {
      return {
        success: false,
        error: `Permission denied: Cannot transition ticket from ${ticket.status} to ${newStatus}.`,
      };
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: newStatus,
        activities: {
          create: {
            userId: session.userId,
            type: "STATUS_CHANGE",
            message: `Status updated from ${ticket.status.replace("_", " ")} to ${newStatus.replace("_", " ")}`,
          },
        },
      },
    });

    revalidatePath(`/tickets/${ticketId}`);
    revalidatePath("/tickets");
    revalidatePath("/dashboard");

    return { success: true, ticket: updated };
  } catch (error) {
    console.error("Update Status Error:", error);
    return { success: false, error: "Failed to update ticket status." };
  }
}

export async function updateTicketPriority(input: UpdatePriorityInput) {
  const session = await getSession();
  if (!session || !isManager(session)) {
    return { success: false, error: "Only managers can update ticket priority." };
  }

  const result = updatePrioritySchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || "Invalid priority data" };
  }

  const { ticketId, priority: newPriority } = result.data;

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return { success: false, error: "Ticket not found." };

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        priority: newPriority,
        activities: {
          create: {
            userId: session.userId,
            type: "PRIORITY_CHANGE",
            message: `Priority changed from ${ticket.priority} to ${newPriority}`,
          },
        },
      },
    });

    revalidatePath(`/tickets/${ticketId}`);
    revalidatePath("/tickets");
    revalidatePath("/dashboard");

    return { success: true, ticket: updated };
  } catch (error) {
    console.error("Update Priority Error:", error);
    return { success: false, error: "Failed to update priority." };
  }
}

export async function addComment(input: CommentInput) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized." };
  }

  const result = commentSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || "Invalid comment" };
  }

  const { ticketId, message } = result.data;

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return { success: false, error: "Ticket not found." };

    const canComment =
      session.role === "MANAGER" ||
      ticket.createdById === session.userId ||
      ticket.assignedToId === session.userId;

    if (!canComment) {
      return { success: false, error: "Permission denied to comment on this ticket." };
    }

    await prisma.ticketActivity.create({
      data: {
        ticketId,
        userId: session.userId,
        type: "COMMENT",
        message,
      },
    });

    revalidatePath(`/tickets/${ticketId}`);

    return { success: true };
  } catch (error) {
    console.error("Add Comment Error:", error);
    return { success: false, error: "Failed to post comment." };
  }
}
