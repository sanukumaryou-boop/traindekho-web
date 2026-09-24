import type { Metadata } from "next";
import AuthForm from "@/components/developers/AuthForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to create a Train Dekho API key.",
};

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 pt-10">
      <h1 className="text-3xl font-extrabold text-gray-900">Log in</h1>
      <p className="mt-3 text-gray-600">Sign in with email and password to create an API key.</p>
      <AuthForm mode="login" />
    </div>
  );
}
