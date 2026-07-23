import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Ticket, Clock, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";

interface StatsCardsProps {
  stats: {
    total: number;
    open: number;
    assigned: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  role: string;
}

export function StatsCards({ stats, role }: StatsCardsProps) {
  const items = [
    {
      title: "Total Tickets",
      value: stats.total,
      description: role === "MANAGER" ? "All system tickets" : role === "TECHNICAL" ? "Assigned to you" : "Created by you",
      icon: Ticket,
      filter: "",
      color: "text-slate-900",
    },
    {
      title: "Open / Unassigned",
      value: stats.open,
      description: "Awaiting assignment",
      icon: AlertCircle,
      filter: "?status=OPEN",
      color: "text-slate-700",
    },
    {
      title: "Assigned",
      value: stats.assigned,
      description: "Queued for work",
      icon: Clock,
      filter: "?status=ASSIGNED",
      color: "text-blue-600",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      description: "Currently being handled",
      icon: Clock,
      filter: "?status=IN_PROGRESS",
      color: "text-amber-600",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      description: "Awaiting employee verification",
      icon: CheckCircle2,
      filter: "?status=RESOLVED",
      color: "text-emerald-600",
    },
    {
      title: "Closed",
      value: stats.closed,
      description: "Completed lifecycle",
      icon: CheckCircle2,
      filter: "?status=CLOSED",
      color: "text-gray-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">{item.title}</p>
                <h4 className={`text-2xl font-bold mt-1 ${item.color}`}>{item.value}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{item.description}</p>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-md">
                <Icon className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <Link
                href={`/tickets${item.filter}`}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900"
              >
                <span>View list</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
