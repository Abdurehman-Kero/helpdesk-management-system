"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTicketSchema, CreateTicketInput } from "@/lib/validations/ticket.schema";
import { createTicket } from "@/actions/ticket.actions";
import { Button } from "@/components/ui/Button";

export function TicketForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "IT_SUPPORT",
      priority: "MEDIUM",
    },
  });

  const onSubmit = async (data: CreateTicketInput) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const res = await createTicket(data);
      if (res.success && res.ticketId) {
        router.push(`/tickets/${res.ticketId}`);
        router.refresh();
      } else {
        setServerError(res.error || "Failed to submit ticket.");
      }
    } catch {
      setServerError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="p-3 text-xs font-medium text-red-800 bg-red-50 border border-red-200 rounded-md">
          {serverError}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Ticket Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("title")}
          placeholder="Brief summary of the issue (e.g. Printer offline on floor 2)"
          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        {errors.title && (
          <p className="text-[11px] text-red-600 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            {...register("category")}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="IT_SUPPORT">IT Support (Hardware, Software, Network)</option>
            <option value="FACILITIES">Facilities (Desk, AC, Office Maintenance)</option>
            <option value="HR">HR (Benefits, Payroll, Onboarding)</option>
            <option value="OTHER">Other Requests</option>
          </select>
          {errors.category && (
            <p className="text-[11px] text-red-600 mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Urgency / Priority <span className="text-red-500">*</span>
          </label>
          <select
            {...register("priority")}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="LOW">Low (Minor inconvenience)</option>
            <option value="MEDIUM">Medium (Normal operational request)</option>
            <option value="HIGH">High (Important work disruption)</option>
            <option value="CRITICAL">Critical (System or office outage)</option>
          </select>
          {errors.priority && (
            <p className="text-[11px] text-red-600 mt-1">{errors.priority.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Detailed Description <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          {...register("description")}
          placeholder="Provide complete details, error messages, computer names, or room numbers to help technical staff resolve your request quickly..."
          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        {errors.description && (
          <p className="text-[11px] text-red-600 mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
        <Link href="/tickets">
          <Button type="button" variant="outline" size="md">
            Cancel
          </Button>
        </Link>
        <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
          {isSubmitting ? "Submitting Ticket..." : "Submit Ticket"}
        </Button>
      </div>
    </form>
  );
}
