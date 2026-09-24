"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const isSignup = mode === "signup";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (isSignup && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setPending(true);
    const response = await fetch(isSignup ? "/api/developers/signup" : "/api/developers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isSignup ? { name, email, password } : { email, password }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);
    if (!response.ok) {
      setError(body?.error ?? "The request could not be completed.");
      return;
    }
    router.push("/developers/keys");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="glass mt-8 space-y-4 rounded-3xl p-5">
      {isSignup ? (
        <label className="block text-sm font-medium text-gray-700">
          Name
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-xl border border-white/80 bg-white/70 px-3 py-2 text-gray-900 backdrop-blur-sm"
            autoComplete="name"
          />
        </label>
      ) : null}
      <label className="block text-sm font-medium text-gray-700">
        Email
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-xl border border-white/80 bg-white/70 px-3 py-2 text-gray-900 backdrop-blur-sm"
          autoComplete="email"
        />
      </label>
      <label className="block text-sm font-medium text-gray-700">
        Password
        <input
          required
          type="password"
          minLength={isSignup ? 8 : 1}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-xl border border-white/80 bg-white/70 px-3 py-2 text-gray-900 backdrop-blur-sm"
          autoComplete={isSignup ? "new-password" : "current-password"}
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Please wait" : isSignup ? "Create account" : "Log in"}
      </button>
      <p className="text-sm text-gray-500">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/developers/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/developers/signup" className="text-blue-600 hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
