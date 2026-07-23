import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StatusActions } from "@/components/tickets/StatusActions";
import { TicketTimeline } from "@/components/tickets/TicketTimeline";
import { CommentBox } from "@/components/tickets/CommentBox";
import { ArrowLeft, Calendar, User } from "lucide-react";

interface TicketPageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({ params }: TicketPageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true, email: true, role: true } },
      assignedTo: { select: { id: true, name: true, email: true, role: true } },
      activities: {
        include: {
          user: { select: { name: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!ticket) {
    notFound();
  }

  const isCreator = ticket.createdById === session.userId;
  const isAssignee = ticket.assignedToId === session.userId;
  const isManager = session.role === "MANAGER";
  const isTechStaff = session.role === "TECHNICAL";

  if (!isManager && !isTechStaff && !isCreator) {
    redirect("/tickets");
  }

  const technicalStaff = isManager
    ? await prisma.user.findMany({
        where: { role: "TECHNICAL" },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      })
    : [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Navigation */}
      <div>
        <Link
          href="/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tickets</span>
        </Link>
      </div>

      {/* Main Ticket Header & Metadata */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-900 rounded">
                {ticket.ticketNumber}
              </span>
              <Badge type="status" value={ticket.status} />
              <Badge type="priority" value={ticket.priority} />
              <Badge type="category" value={ticket.category} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">{ticket.title}</h1>
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Description
          </h3>
          <div className="p-3.5 sm:p-4 bg-slate-50 border border-slate-200/80 rounded-md text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </div>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Created By</span>
              <span className="font-medium text-slate-900">{ticket.createdBy.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Assigned Staff</span>
              <span className="font-medium text-slate-900">
                {ticket.assignedTo ? ticket.assignedTo.name : "Unassigned"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Date Created</span>
              <span className="font-medium text-slate-900">
                {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Action Bar */}
        <StatusActions
          ticket={{
            id: ticket.id,
            status: ticket.status,
            priority: ticket.priority,
            createdById: ticket.createdById,
            assignedToId: ticket.assignedToId,
          }}
          session={session}
          technicalStaff={technicalStaff}
        />
      </div>

      {/* Two Column Section: Timeline & Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Activity Audit Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <Card title="Activity Log" subtitle="History of transitions, assignments, and notes">
            <TicketTimeline activities={ticket.activities} />
          </Card>
        </div>

        {/* Post Comment Box */}
        <div className="space-y-4">
          <Card title="Add Note or Comment" subtitle="Communicate updates regarding this ticket">
            <CommentBox ticketId={ticket.id} />
          </Card>
        </div>
      </div>
    </div>
  );
}
