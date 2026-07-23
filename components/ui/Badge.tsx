import React from "react";
import { Status, Priority, Category } from "@prisma/client";

type BadgeType = "status" | "priority" | "category" | "role";

interface BadgeProps {
  type: BadgeType;
  value: string;
  className?: string;
}

export function Badge({ type, value, className = "" }: BadgeProps) {
  let badgeStyles = "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded border";
  let dotColor = "bg-slate-400";
  let label = value.replace("_", " ");

  if (type === "status") {
    switch (value as Status) {
      case "OPEN":
        badgeStyles += " bg-slate-50 text-slate-700 border-slate-300";
        dotColor = "bg-slate-500";
        break;
      case "ASSIGNED":
        badgeStyles += " bg-blue-50 text-blue-800 border-blue-200";
        dotColor = "bg-blue-600";
        break;
      case "IN_PROGRESS":
        badgeStyles += " bg-amber-50 text-amber-800 border-amber-200";
        dotColor = "bg-amber-600";
        break;
      case "RESOLVED":
        badgeStyles += " bg-emerald-50 text-emerald-800 border-emerald-200";
        dotColor = "bg-emerald-600";
        break;
      case "CLOSED":
        badgeStyles += " bg-gray-100 text-gray-600 border-gray-300";
        dotColor = "bg-gray-500";
        break;
      default:
        badgeStyles += " bg-slate-50 text-slate-700 border-slate-200";
    }
  } else if (type === "priority") {
    switch (value as Priority) {
      case "LOW":
        badgeStyles += " bg-slate-50 text-slate-600 border-slate-200";
        dotColor = "bg-slate-400";
        break;
      case "MEDIUM":
        badgeStyles += " bg-blue-50 text-blue-700 border-blue-200";
        dotColor = "bg-blue-500";
        break;
      case "HIGH":
        badgeStyles += " bg-orange-50 text-orange-800 border-orange-200";
        dotColor = "bg-orange-600";
        break;
      case "CRITICAL":
        badgeStyles += " bg-red-50 text-red-800 border-red-200 font-semibold";
        dotColor = "bg-red-600";
        break;
    }
  } else if (type === "category") {
    badgeStyles += " bg-slate-100 text-slate-700 border-slate-200";
    dotColor = "bg-slate-400";
    if (value === "IT_SUPPORT") label = "IT Support";
    if (value === "FACILITIES") label = "Facilities";
    if (value === "HR") label = "HR";
    if (value === "OTHER") label = "Other";
  } else if (type === "role") {
    badgeStyles += " bg-slate-100 text-slate-800 border-slate-300 font-mono text-[11px]";
    dotColor = "bg-slate-600";
  }

  return (
    <span className={`${badgeStyles} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{label}</span>
    </span>
  );
}
