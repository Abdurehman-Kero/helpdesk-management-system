import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  await prisma.ticketActivity.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Seeding users...");
  const passwordHash = await bcrypt.hash("password123", 10);

  const manager1 = await prisma.user.create({
    data: { name: "Manager One", email: "manager1@company.com", passwordHash, role: "MANAGER" },
  });
  const manager2 = await prisma.user.create({
    data: { name: "Manager Two", email: "manager2@company.com", passwordHash, role: "MANAGER" },
  });

  const tech1 = await prisma.user.create({
    data: { name: "Tech One", email: "tech1@company.com", passwordHash, role: "TECHNICAL" },
  });
  const tech2 = await prisma.user.create({
    data: { name: "Tech Two", email: "tech2@company.com", passwordHash, role: "TECHNICAL" },
  });
  const tech3 = await prisma.user.create({
    data: { name: "Tech Three", email: "tech3@company.com", passwordHash, role: "TECHNICAL" },
  });

  const emp1 = await prisma.user.create({
    data: { name: "Employee One", email: "emp1@company.com", passwordHash, role: "EMPLOYEE" },
  });
  const emp2 = await prisma.user.create({
    data: { name: "Employee Two", email: "emp2@company.com", passwordHash, role: "EMPLOYEE" },
  });
  const emp3 = await prisma.user.create({
    data: { name: "Employee Three", email: "emp3@company.com", passwordHash, role: "EMPLOYEE" },
  });

  console.log("Seeding tickets...");

  const rawTickets = [
    {
      ticketNumber: "TKT-001",
      title: "VPN connection dropping repeatedly",
      description: "My VPN connection resets every 15 minutes when working remotely from home.",
      category: "IT_SUPPORT" as const,
      priority: "HIGH" as const,
      status: "OPEN" as const,
      createdBy: emp1,
      assignedTo: null,
      activities: [
        { userId: emp1.id, type: "STATUS_CHANGE" as const, message: "Ticket created" },
      ],
    },
    {
      ticketNumber: "TKT-002",
      title: "Monitors not receiving power on 3rd floor desk 14",
      description: "Dual monitor setup has no power. Surge protector appears non-functional.",
      category: "FACILITIES" as const,
      priority: "MEDIUM" as const,
      status: "ASSIGNED" as const,
      createdBy: emp2,
      assignedTo: tech1,
      activities: [
        { userId: emp2.id, type: "STATUS_CHANGE" as const, message: "Ticket created" },
        { userId: manager1.id, type: "ASSIGNMENT" as const, message: `Assigned to ${tech1.name}` },
      ],
    },
    {
      ticketNumber: "TKT-003",
      title: "Update direct deposit info request",
      description: "Submitted new direct deposit form via portal, need confirmation of payroll update.",
      category: "HR" as const,
      priority: "MEDIUM" as const,
      status: "IN_PROGRESS" as const,
      createdBy: emp3,
      assignedTo: tech2,
      activities: [
        { userId: emp3.id, type: "STATUS_CHANGE" as const, message: "Ticket created" },
        { userId: manager1.id, type: "ASSIGNMENT" as const, message: `Assigned to ${tech2.name}` },
        { userId: tech2.id, type: "STATUS_CHANGE" as const, message: "Status updated to IN_PROGRESS" },
        { userId: tech2.id, type: "COMMENT" as const, message: "Form received, validating with bank details." },
      ],
    },
    {
      ticketNumber: "TKT-004",
      title: "Critical server room temperature alert",
      description: "AC unit B in main server room showing high temperature warning.",
      category: "FACILITIES" as const,
      priority: "CRITICAL" as const,
      status: "IN_PROGRESS" as const,
      createdBy: emp1,
      assignedTo: tech3,
      activities: [
        { userId: emp1.id, type: "STATUS_CHANGE" as const, message: "Ticket created" },
        { userId: manager2.id, type: "ASSIGNMENT" as const, message: `Assigned to ${tech3.name}` },
        { userId: tech3.id, type: "STATUS_CHANGE" as const, message: "Status updated to IN_PROGRESS" },
        { userId: tech3.id, type: "COMMENT" as const, message: "HVAC tech dispatched to room." },
      ],
    },
    {
      ticketNumber: "TKT-005",
      title: "New developer laptop provisioning",
      description: "Requesting MacBook Pro M3 configuration for upcoming engineering hire.",
      category: "IT_SUPPORT" as const,
      priority: "HIGH" as const,
      status: "RESOLVED" as const,
      createdBy: emp2,
      assignedTo: tech1,
      activities: [
        { userId: emp2.id, type: "STATUS_CHANGE" as const, message: "Ticket created" },
        { userId: manager1.id, type: "ASSIGNMENT" as const, message: `Assigned to ${tech1.name}` },
        { userId: tech1.id, type: "STATUS_CHANGE" as const, message: "Status updated to IN_PROGRESS" },
        { userId: tech1.id, type: "STATUS_CHANGE" as const, message: "Status updated to RESOLVED" },
        { userId: tech1.id, type: "COMMENT" as const, message: "Laptop imaged and ready for pickup at IT desk." },
      ],
    },
    {
      ticketNumber: "TKT-006",
      title: "Broken ergonomic chair replacement",
      description: "Height adjustment lever on chair broke. Need replacement chair.",
      category: "FACILITIES" as const,
      priority: "LOW" as const,
      status: "CLOSED" as const,
      createdBy: emp3,
      assignedTo: tech2,
      activities: [
        { userId: emp3.id, type: "STATUS_CHANGE" as const, message: "Ticket created" },
        { userId: manager1.id, type: "ASSIGNMENT" as const, message: `Assigned to ${tech2.name}` },
        { userId: tech2.id, type: "STATUS_CHANGE" as const, message: "Status updated to RESOLVED" },
        { userId: emp3.id, type: "STATUS_CHANGE" as const, message: "Status updated to CLOSED" },
      ],
    },
    {
      ticketNumber: "TKT-007",
      title: "Software license allocation - Figma Enterprise",
      description: "Need design seat license for UI team sprint.",
      category: "IT_SUPPORT" as const,
      priority: "MEDIUM" as const,
      status: "OPEN" as const,
      createdBy: emp1,
      assignedTo: null,
      activities: [
        { userId: emp1.id, type: "STATUS_CHANGE" as const, message: "Ticket created" },
      ],
    },
    {
      ticketNumber: "TKT-008",
      title: "Health benefits enrollment assistance",
      description: "Questions regarding dependent coverage additions for Q3 window.",
      category: "HR" as const,
      priority: "LOW" as const,
      status: "ASSIGNED" as const,
      createdBy: emp2,
      assignedTo: tech3,
      activities: [
        { userId: emp2.id, type: "STATUS_CHANGE" as const, message: "Ticket created" },
        { userId: manager2.id, type: "ASSIGNMENT" as const, message: `Assigned to ${tech3.name}` },
      ],
    },
    {
      ticketNumber: "TKT-009",
      title: "Keycard access badge failing at West entrance",
      description: "Keycard reader returns red error code when scanning badge #4092.",
      category: "FACILITIES" as const,
      priority: "HIGH" as const,
      status: "IN_PROGRESS" as const,
      createdBy: emp3,
      assignedTo: tech1,
      activities: [
        { userId: emp3.id, type: "STATUS_CHANGE" as const, message: "Ticket created" },
        { userId: manager1.id, type: "ASSIGNMENT" as const, message: `Assigned to ${tech1.name}` },
        { userId: tech1.id, type: "STATUS_CHANGE" as const, message: "Status updated to IN_PROGRESS" },
      ],
    },
    {
      ticketNumber: "TKT-010",
      title: "Slack enterprise channel archive request",
      description: "Requesting archive of project-alpha-legacy channels.",
      category: "OTHER" as const,
      priority: "LOW" as const,
      status: "RESOLVED" as const,
      createdBy: emp1,
      assignedTo: tech2,
      activities: [
        { userId: emp1.id, type: "STATUS_CHANGE" as const, message: "Ticket created" },
        { userId: manager1.id, type: "ASSIGNMENT" as const, message: `Assigned to ${tech2.name}` },
        { userId: tech2.id, type: "STATUS_CHANGE" as const, message: "Status updated to RESOLVED" },
      ],
    },
    {
      ticketNumber: "TKT-011",
      title: "Database backup verification failure",
      description: "Nightly automated snapshot reported checksum discrepancy on secondary node.",
      category: "IT_SUPPORT" as const,
      priority: "CRITICAL" as const,
      status: "IN_PROGRESS" as const,
      createdBy: emp2,
      assignedTo: tech3,
      activities: [
        { userId: emp2.id, type: "STATUS_CHANGE" as const, message: "Ticket created" },
        { userId: manager2.id, type: "ASSIGNMENT" as const, message: `Assigned to ${tech3.name}` },
        { userId: tech3.id, type: "STATUS_CHANGE" as const, message: "Status updated to IN_PROGRESS" },
      ],
    },
    {
      ticketNumber: "TKT-012",
      title: "Conference room A/V microphone static",
      description: "Microphone array in Room 204 produces loud feedback during Zoom calls.",
      category: "FACILITIES" as const,
      priority: "MEDIUM" as const,
      status: "OPEN" as const,
      createdBy: emp3,
      assignedTo: null,
      activities: [
        { userId: emp3.id, type: "STATUS_CHANGE" as const, message: "Ticket created" },
      ],
    },
  ];

  for (const t of rawTickets) {
    await prisma.ticket.create({
      data: {
        ticketNumber: t.ticketNumber,
        title: t.title,
        description: t.description,
        category: t.category,
        priority: t.priority,
        status: t.status,
        createdById: t.createdBy.id,
        assignedToId: t.assignedTo?.id || null,
        activities: {
          createMany: {
            data: t.activities,
          },
        },
      },
    });
  }

  console.log("Seeding complete! Sample accounts:");
  console.log("Managers: manager1@company.com, manager2@company.com (pass: password123)");
  console.log("Technical: tech1@company.com, tech2@company.com, tech3@company.com (pass: password123)");
  console.log("Employees: emp1@company.com, emp2@company.com, emp3@company.com (pass: password123)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
