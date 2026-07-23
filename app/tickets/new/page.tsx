import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { TicketForm } from "@/components/forms/TicketForm";
import { Card } from "@/components/ui/Card";

export default async function NewTicketPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Submit New Support Ticket</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Fill out the details below to request technical, facilities, or HR support
        </p>
      </div>

      <Card>
        <TicketForm />
      </Card>
    </div>
  );
}
