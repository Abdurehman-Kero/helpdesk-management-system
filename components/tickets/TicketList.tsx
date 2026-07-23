import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Ticket as TicketIcon, Calendar, User } from "lucide-react";

export type TicketListItem = {
  id: string;
  ticketNumber: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: { name: string; email: string };
  assignedTo: { name: string; email: string } | null;
};

interface TicketListProps {
  tickets: TicketListItem[];
}

export function TicketList({ tickets }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8 sm:p-12 text-center text-xs text-slate-500">
        <TicketIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-900 mb-1">No tickets match criteria</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          Adjust search keywords or status filters to locate tickets.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Mobile-First Stacked Card View (visible on small screens) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {tickets.map((t) => (
          <div key={t.id} className="bg-white p-4 border border-slate-200 rounded-lg space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {t.ticketNumber}
              </span>
              <Badge type="status" value={t.status} />
            </div>

            <div>
              <Link href={`/tickets/${t.id}`} className="font-semibold text-sm text-slate-900 hover:underline">
                {t.title}
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              <Badge type="priority" value={t.priority} />
              <Badge type="category" value={t.category} />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.assignedTo ? t.assignedTo.name : "Unassigned"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {new Date(t.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <Link
              href={`/tickets/${t.id}`}
              className="block w-full text-center py-2 bg-slate-900 text-white font-medium text-xs rounded-md hover:bg-slate-800 transition-colors"
            >
              View Ticket Details &rarr;
            </Link>
          </div>
        ))}
      </div>

      {/* Desktop Table View (visible on medium & large screens) */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Ticket #</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created By</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Last Updated</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                    <Link href={`/tickets/${t.id}`} className="hover:underline">
                      {t.ticketNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">
                    <Link href={`/tickets/${t.id}`} className="hover:text-slate-700">
                      {t.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge type="category" value={t.category} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge type="priority" value={t.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge type="status" value={t.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-medium">{t.createdBy.name}</td>
                  <td className="px-4 py-3 text-slate-600 font-medium">
                    {t.assignedTo ? t.assignedTo.name : <span className="text-slate-400 italic">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-[11px]">
                    {new Date(t.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/tickets/${t.id}`}
                      className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
