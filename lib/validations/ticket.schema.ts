import { z } from "zod";

export const createTicketSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(120, "Title must not exceed 120 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  category: z.enum(["IT_SUPPORT", "FACILITIES", "HR", "OTHER"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
});

export const updateStatusSchema = z.object({
  ticketId: z.string().min(1),
  status: z.enum(["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});

export const assignTicketSchema = z.object({
  ticketId: z.string().min(1),
  assignedToId: z.string().min(1, "Please select a technical staff member"),
});

export const updatePrioritySchema = z.object({
  ticketId: z.string().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
});

export const commentSchema = z.object({
  ticketId: z.string().min(1),
  message: z
    .string()
    .min(1, "Comment message cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type AssignTicketInput = z.infer<typeof assignTicketSchema>;
export type UpdatePriorityInput = z.infer<typeof updatePrioritySchema>;
export type CommentInput = z.infer<typeof commentSchema>;
