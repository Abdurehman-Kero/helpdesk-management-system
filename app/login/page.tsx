import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/forms/LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-10 h-10 bg-slate-900 text-white rounded-md items-center justify-center font-bold text-sm mb-3">
          HD
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Internal Helpdesk System
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Sign in to manage and track support requests
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 sm:px-8 border border-slate-200 rounded-lg shadow-xs">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
