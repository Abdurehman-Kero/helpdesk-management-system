import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TicketFilters } from "@/components/tickets/TicketFilters";
import { TicketList } from "@/components/tickets/TicketList";
import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import { Category, Priority, Status, Prisma } from "@prisma/client";

interface SearchParamsProps {
  searchParams: Promise<{
    status?: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
    q?: string;
    sort?: string;
  }>;
}

export default async function TicketsPage({ searchParams }: SearchParamsProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const { status, priority, category, assignedTo, q, sort } = params;

  // Base role-scoped filter
  const where: Prisma.TicketWhereInput = {};

  if (session.role === "TECHNICAL") {
    where.assignedToId = session.userId;
  } else if (session.role === "EMPLOYEE") {
    where.createdById = session.userId;
  }

  // Filter application
  if (status) {
    where.status = status as Status;
  }
  if (priority) {
    where.priority = priority as Priority;
  }
  if (category) {
    where.category = category as Category;
  }
  if (session.role === "MANAGER" && assignedTo) {
    if (assignedTo === "unassigned") {
      where.assignedToId = null;
    } else {
      where.assignedToId = assignedTo;
    }
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { ticketNumber: { contains: q } },
    ];
  }

  // Sorting logic
  let orderBy: Prisma.TicketOrderByWithRelationInput = { updatedAt: "desc" };
  if (sort === "created_desc") orderBy = { createdAt: "desc" };
  if (sort === "created_asc") orderBy = { createdAt: "asc" };
  if (sort === "priority_desc") orderBy = { priority: "desc" };

  const [tickets, technicalStaff] = await Promise.all([
    prisma.ticket.findMany({
      where,
      orderBy,
      include: {
        createdBy: { select: { name: true, email: true } },
        assignedTo: { select: { name: true, email: true } },
      },
    }),
    session.role === "MANAGER"
      ? prisma.user.findMany({
          where: { role: "TECHNICAL" },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Tickets Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} matching current filters
          </p>
        </div>
        {session.role === "EMPLOYEE" && (
          <Link href="/tickets/new">
            <Button variant="primary" size="sm" className="gap-1.5">
              <PlusCircle className="w-4 h-4" />
              <span>New Ticket</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Filter Toolbar */}
      <TicketFilters technicalStaff={technicalStaff} isManager={session.role === "MANAGER"} />

      {/* Data Table */}
      <TicketList tickets={tickets} />
    </div>
  );
}
