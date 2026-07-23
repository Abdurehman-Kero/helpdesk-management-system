import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { RegisterForm } from "@/components/forms/RegisterForm";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-md flex items-center justify-center font-bold text-sm">
            HD
          </div>
        </div>
        <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-slate-900">
          Create an Account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Register to submit or manage internal helpdesk tickets
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-slate-200 rounded-lg shadow-xs sm:px-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
