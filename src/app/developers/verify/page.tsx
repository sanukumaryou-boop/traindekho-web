import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyEmail from "@/components/developers/VerifyEmail";

export const metadata: Metadata = {
  title: "Confirm email",
  description: "Confirm your Train Dekho developer account email.",
};

export default function VerifyEmailPage() {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 pt-10">
      <h1 className="text-3xl font-extrabold text-gray-900">Confirm your email</h1>
      <Suspense fallback={<p className="mt-8 text-sm text-gray-600">Confirming your email…</p>}>
        <VerifyEmail />
      </Suspense>
    </div>
  );
}
