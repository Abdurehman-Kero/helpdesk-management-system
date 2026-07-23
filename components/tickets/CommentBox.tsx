"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, CommentInput } from "@/lib/validations/ticket.schema";
import { addComment } from "@/actions/ticket.actions";
import { Button } from "@/components/ui/Button";
import { Send } from "lucide-react";

interface CommentBoxProps {
  ticketId: string;
}

export function CommentBox({ ticketId }: CommentBoxProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      ticketId,
      message: "",
    },
  });

  const onSubmit = async (data: CommentInput) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const res = await addComment(data);
      if (res.success) {
        reset({ ticketId, message: "" });
      } else {
        setServerError(res.error || "Failed to post comment.");
      }
    } catch {
      setServerError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {serverError && (
        <div className="p-2.5 text-xs text-red-800 bg-red-50 border border-red-200 rounded-md">
          {serverError}
        </div>
      )}

      <div>
        <textarea
          rows={3}
          {...register("message")}
          placeholder="Add a comment or progress note..."
          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        {errors.message && (
          <p className="text-[11px] text-red-600 mt-1">{errors.message.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" size="sm" className="gap-1.5" disabled={isSubmitting}>
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? "Posting..." : "Post Comment"}</span>
        </Button>
      </div>
    </form>
  );
}
