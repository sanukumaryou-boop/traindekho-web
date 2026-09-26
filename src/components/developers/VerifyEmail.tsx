"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function VerifyEmail() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [status, setStatus] = useState<"pending" | "done" | "error">(token ? "pending" : "error");
  const [message, setMessage] = useState(token ? "" : "This confirmation link is invalid or has expired.");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    void (async () => {
      const response = await fetch("/api/developers/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (cancelled) return;
      if (!response.ok) {
        setStatus("error");
        setMessage(body?.error ?? "This confirmation link is invalid or has expired.");
        return;
      }
      setStatus("done");
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="glass mt-8 rounded-3xl p-5">
      {status === "pending" ? <p className="text-sm text-gray-600">Confirming your email…</p> : null}
      {status === "done" ? (
        <>
          <p className="text-sm text-gray-700">Your email is confirmed. Log in to create an API key.</p>
          <Link
            href="/developers/login"
            className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Log in
          </Link>
        </>
      ) : null}
      {status === "error" ? (
        <>
          <p className="text-sm text-red-600">{message}</p>
          <Link href="/developers/signup" className="mt-4 inline-flex text-sm text-blue-600 hover:underline">
            Back to create account
          </Link>
        </>
      ) : null}
    </div>
  );
}
