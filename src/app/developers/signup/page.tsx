import type { Metadata } from "next";
import AuthForm from "@/components/developers/AuthForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a Train Dekho developer account and get an API key.",
};

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 pt-10">
      <h1 className="text-3xl font-extrabold text-gray-900">Create account</h1>
      <p className="mt-3 text-gray-600">
        Accounts start on the Developer plan: 1,000 requests a day, 20,000 a month, and 60 a minute. We email you a
        confirmation link before the account can be used.
      </p>
      <AuthForm mode="signup" />
    </div>
  );
}
