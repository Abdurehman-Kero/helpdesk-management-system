"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema, RegisterInput } from "@/lib/validations/auth.schema";
import { registerUser } from "@/actions/auth.actions";
import { Button } from "@/components/ui/Button";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "EMPLOYEE",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const res = await registerUser(data);
      if (res.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setServerError(res.error || "Failed to register.");
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
        <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
        <input
          type="text"
          {...register("name")}
          placeholder="Jane Doe"
          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        {errors.name && (
          <p className="text-[11px] text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Work Email</label>
        <input
          type="email"
          {...register("email")}
          placeholder="jane@company.com"
          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        {errors.email && (
          <p className="text-[11px] text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
        <input
          type="password"
          {...register("password")}
          placeholder="At least 6 characters"
          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        {errors.password && (
          <p className="text-[11px] text-red-600 mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Role</label>
        <select
          {...register("role")}
          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="EMPLOYEE">Employee (Create & track tickets)</option>
          <option value="TECHNICAL">Technical Staff (Resolve tickets)</option>
          <option value="MANAGER">Manager (Assign & oversee system)</option>
        </select>
        {errors.role && (
          <p className="text-[11px] text-red-600 mt-1">{errors.role.message}</p>
        )}
      </div>

      <Button type="submit" variant="primary" size="md" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>

      <div className="pt-2 text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="text-slate-900 font-medium hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  );
}
