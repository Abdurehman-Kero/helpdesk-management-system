"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TicketFiltersProps {
  technicalStaff?: { id: string; name: string }[];
  isManager?: boolean;
}

export function TicketFilters({ technicalStaff = [], isManager = false }: TicketFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentStatus = searchParams.get("status") || "";
  const currentPriority = searchParams.get("priority") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentAssignedTo = searchParams.get("assignedTo") || "";
  const currentQuery = searchParams.get("q") || "";
  const currentSort = searchParams.get("sort") || "updated_desc";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const resetFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters = Boolean(
    currentStatus || currentPriority || currentCategory || currentAssignedTo || currentQuery
  );

  return (
    <div className="bg-white p-3.5 sm:p-4 border border-slate-200 rounded-lg space-y-3 shadow-xs">
      <div className="flex items-center justify-between md:hidden pb-2 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span>Filters & Search</span>
        </span>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-[11px] font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {/* Search Query Input */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            defaultValue={currentQuery}
            onChange={(e) => updateFilter("q", e.target.value)}
            className="w-full pl-9 pr-3 py-2 sm:py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-900"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={currentStatus}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="w-full px-3 py-2 sm:py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-900"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={currentPriority}
            onChange={(e) => updateFilter("priority", e.target.value)}
            className="w-full px-3 py-2 sm:py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-900"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={currentCategory}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="w-full px-3 py-2 sm:py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-900"
          >
            <option value="">All Categories</option>
            <option value="IT_SUPPORT">IT Support</option>
            <option value="FACILITIES">Facilities</option>
            <option value="HR">HR</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Assigned To Filter (Manager only) */}
        {isManager && (
          <div>
            <select
              value={currentAssignedTo}
              onChange={(e) => updateFilter("assignedTo", e.target.value)}
              className="w-full px-3 py-2 sm:py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-900"
            >
              <option value="">All Assignees</option>
              <option value="unassigned">Unassigned</option>
              {technicalStaff.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 pt-2 gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-500">
          <span className="whitespace-nowrap">Sort by:</span>
          <select
            value={currentSort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="w-full sm:w-auto px-2.5 py-1 text-xs bg-transparent border border-slate-200 rounded text-slate-700 font-medium"
          >
            <option value="updated_desc">Recently Updated</option>
            <option value="created_desc">Newest First</option>
            <option value="created_asc">Oldest First</option>
            <option value="priority_desc">Priority (High to Low)</option>
          </select>
          {isPending && <span className="text-slate-400 italic text-[11px]">Updating...</span>}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="hidden md:inline-flex gap-1 text-slate-500 hover:text-slate-900"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </Button>
        )}
      </div>
    </div>
  );
}
