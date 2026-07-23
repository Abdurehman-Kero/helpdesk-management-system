import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlusCircle, ArrowRight, Ticket } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Role-scoped query filter
  let whereClause = {};
  if (session.role === "TECHNICAL") {
    whereClause = { assignedToId: session.userId };
  } else if (session.role === "EMPLOYEE") {
    whereClause = { createdById: session.userId };
  }

  const [total, open, assigned, inProgress, resolved, closed, recentTickets] = await Promise.all([
    prisma.ticket.count({ where: whereClause }),
    prisma.ticket.count({ where: { ...whereClause, status: "OPEN" } }),
    prisma.ticket.count({ where: { ...whereClause, status: "ASSIGNED" } }),
    prisma.ticket.count({ where: { ...whereClause, status: "IN_PROGRESS" } }),
    prisma.ticket.count({ where: { ...whereClause, status: "RESOLVED" } }),
    prisma.ticket.count({ where: { ...whereClause, status: "CLOSED" } }),
    prisma.ticket.findMany({
      where: whereClause,
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: {
        createdBy: { select: { name: true } },
        assignedTo: { select: { name: true } },
      },
    }),
  ]);

  const stats = { total, open, assigned, inProgress, resolved, closed };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Welcome back, {session.name} ({session.role.toLowerCase()} view)
          </p>
        </div>
        {session.role === "EMPLOYEE" && (
          <Link href="/tickets/new" className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full sm:w-auto gap-1.5">
              <PlusCircle className="w-4 h-4" />
              <span>Create Ticket</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Metrics Cards */}
      <StatsCards stats={stats} role={session.role} />

      {/* Recent Activity Section */}
      <Card
        title="Recent Tickets"
        subtitle="Latest updated tickets in your workspace"
        headerAction={
          <Link
            href="/tickets"
            className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      >
        {recentTickets.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            <Ticket className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p>No tickets found in your queue.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Mobile Stacked List */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {recentTickets.map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{t.ticketNumber}</span>
                    <Badge type="status" value={t.status} />
                  </div>
                  <Link href={`/tickets/${t.id}`} className="font-semibold text-slate-900 block hover:underline">
                    {t.title}
                  </Link>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <Badge type="priority" value={t.priority} />
                    <Link href={`/tickets/${t.id}`} className="text-slate-900 font-medium hover:underline">
                      View details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">Ticket #</th>
                    <th className="px-4 py-2.5">Title</th>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5">Priority</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Assigned To</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-slate-900">{t.ticketNumber}</td>
                      <td className="px-4 py-3 max-w-xs truncate font-medium text-slate-900">{t.title}</td>
                      <td className="px-4 py-3">
                        <Badge type="category" value={t.category} />
                      </td>
                      <td className="px-4 py-3">
                        <Badge type="priority" value={t.priority} />
                      </td>
                      <td className="px-4 py-3">
                        <Badge type="status" value={t.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {t.assignedTo ? t.assignedTo.name : <span className="text-slate-400 italic">Unassigned</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/tickets/${t.id}`}
                          className="text-slate-900 hover:underline font-medium text-[11px]"
                        >
                          Details &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
