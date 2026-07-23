"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Status, Priority } from "@prisma/client";
import { SessionPayload } from "@/lib/auth";
import {
  assignTicket,
  updateTicketStatus,
  updateTicketPriority,
} from "@/actions/ticket.actions";
import { Button } from "@/components/ui/Button";
import { UserPlus, Play, CheckCircle, Lock, Shield } from "lucide-react";

interface StatusActionsProps {
  ticket: {
    id: string;
    status: Status;
    priority: Priority;
    createdById: string;
    assignedToId: string | null;
  };
  session: SessionPayload;
  technicalStaff?: { id: string; name: string }[];
}

export function StatusActions({ ticket, session, technicalStaff = [] }: StatusActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string>(ticket.assignedToId || "");
  const [selectedPriority, setSelectedPriority] = useState<Priority>(ticket.priority);

  useEffect(() => {
    setSelectedStaff(ticket.assignedToId || "");
    setSelectedPriority(ticket.priority);
  }, [ticket.assignedToId, ticket.priority]);

  const handleAssign = () => {
    if (!selectedStaff) return;
    setErrorMsg(null);
    startTransition(async () => {
      const res = await assignTicket({ ticketId: ticket.id, assignedToId: selectedStaff });
      if (!res.success) {
        setErrorMsg(res.error || "Failed to assign staff.");
      }
    });
  };

  const handleStatusChange = (newStatus: Status) => {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await updateTicketStatus({ ticketId: ticket.id, status: newStatus });
      if (!res.success) {
        setErrorMsg(res.error || "Failed to update status.");
      }
    });
  };

  const handlePriorityChange = (newPriority: Priority) => {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await updateTicketPriority({ ticketId: ticket.id, priority: newPriority });
      if (!res.success) {
        setErrorMsg(res.error || "Failed to update priority.");
      }
    });
  };

  const isAssignedToMe = ticket.assignedToId === session.userId;
  const isCreatedByMe = ticket.createdById === session.userId;
  const isManagerUser = session.role === "MANAGER";

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="p-3 text-xs text-red-800 bg-red-50 border border-red-200 rounded-md">
          {errorMsg}
        </div>
      )}

      {/* Role Action Controls */}
      <div className="space-y-3">
        {/* Technical Staff Actions */}
        {session.role === "TECHNICAL" && isAssignedToMe && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {ticket.status === "ASSIGNED" && (
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto gap-1.5"
                disabled={isPending}
                onClick={() => handleStatusChange("IN_PROGRESS")}
              >
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Start Work (In Progress)</span>
              </Button>
            )}
            {ticket.status === "IN_PROGRESS" && (
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto gap-1.5 bg-emerald-700 hover:bg-emerald-800 border-emerald-800"
                disabled={isPending}
                onClick={() => handleStatusChange("RESOLVED")}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark Resolved</span>
              </Button>
            )}
          </div>
        )}

        {/* Employee Actions */}
        {session.role === "EMPLOYEE" && isCreatedByMe && ticket.status === "RESOLVED" && (
          <div>
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto gap-1.5 bg-slate-900"
              disabled={isPending}
              onClick={() => handleStatusChange("CLOSED")}
            >
              <Lock className="w-4 h-4" />
              <span>Confirm & Close Ticket</span>
            </Button>
          </div>
        )}

        {/* Manager Actions & Administrative Overrides */}
        {isManagerUser && (
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-700" />
              <span>Manager Administrative Controls</span>
            </h4>

            {/* Assignment Tool */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="w-full sm:flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-900"
              >
                <option value="">Select Technical Staff...</option>
                {technicalStaff.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
              <Button
                variant="secondary"
                size="md"
                className="w-full sm:w-auto gap-1"
                disabled={isPending || !selectedStaff}
                onClick={handleAssign}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{ticket.assignedToId ? "Reassign Staff" : "Assign Staff"}</span>
              </Button>
            </div>

            {/* Priority Tool */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label className="text-xs font-medium text-slate-600 sm:w-28">Priority Level:</label>
              <select
                value={selectedPriority}
                onChange={(e) => {
                  const val = e.target.value as Priority;
                  setSelectedPriority(val);
                  handlePriorityChange(val);
                }}
                className="w-full sm:flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-900"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            {/* Manager Override Status Buttons */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Override Ticket Status:
              </label>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5">
                {(["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"] as Status[]).map((st) => (
                  <button
                    key={st}
                    disabled={isPending || ticket.status === st}
                    onClick={() => handleStatusChange(st)}
                    className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                      ticket.status === st
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 disabled:opacity-40"
                    }`}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
