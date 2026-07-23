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

        {/* Test Accounts Box */}
        <div className="mt-4 bg-white p-4 border border-slate-200 rounded-lg text-xs space-y-2 text-slate-600">
          <p className="font-semibold text-slate-900 border-b border-slate-100 pb-1">
            Test Accounts (Password: <code className="bg-slate-100 px-1 py-0.5 rounded">password123</code>)
          </p>
          <div className="grid grid-cols-1 gap-1 text-[11px]">
            <div><span className="font-medium text-slate-900">Manager:</span> manager1@company.com</div>
            <div><span className="font-medium text-slate-900">Technical Staff:</span> tech1@company.com</div>
            <div><span className="font-medium text-slate-900">Employee:</span> emp1@company.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
