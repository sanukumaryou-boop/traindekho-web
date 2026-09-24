"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Account, ApiCredential } from "@/lib/developers/public-api";

function limitLabel(value: number | null, unit: string) {
  return value == null ? `Unlimited ${unit}` : `${value.toLocaleString("en-IN")} ${unit}`;
}

function when(value: string | null) {
  if (!value) return "Never";
  return new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function KeysPanel({
  account,
  credentials,
}: {
  account: Account;
  credentials: ApiCredential[];
}) {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);

  async function createKey() {
    setError("");
    setPending(true);
    const response = await fetch("/api/developers/credentials", { method: "POST" });
    const body = (await response.json().catch(() => null)) as { secret?: string; error?: string } | null;
    setPending(false);
    if (!response.ok || !body?.secret) {
      setError(body?.error ?? "The key could not be created.");
      return;
    }
    setSecret(body.secret);
    setCopied(false);
    router.refresh();
  }

  async function revoke(id: string) {
    if (!window.confirm("Revoke this API key? Calls using it will stop working.")) return;
    setError("");
    const response = await fetch(`/api/developers/credentials/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "The key could not be revoked.");
      return;
    }
    router.refresh();
  }

  async function copySecret() {
    await navigator.clipboard.writeText(secret);
    setCopied(true);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">API keys</h1>
          <p className="mt-2 text-gray-600">{account.name}</p>
          <p className="mt-1 text-sm text-gray-500">
            {account.plan.name}: {limitLabel(account.plan.daily_request_limit, "requests / day")},{" "}
            {limitLabel(account.plan.monthly_request_limit, "requests / month")},{" "}
            {limitLabel(account.plan.requests_per_minute, "requests / minute")}
          </p>
        </div>
        <button
          type="button"
          onClick={createKey}
          disabled={pending}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Creating" : "Create API key"}
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {secret ? (
        <div className="glass mt-6 rounded-3xl p-4">
          <p className="text-sm font-semibold text-gray-900">Copy this key now. It will not be shown again.</p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-white p-3 text-sm text-gray-900">{secret}</pre>
          <button type="button" onClick={copySecret} className="mt-3 text-sm font-semibold text-blue-700">
            {copied ? "Copied" : "Copy key"}
          </button>
        </div>
      ) : null}

      {credentials.length === 0 ? (
        <p className="mt-8 text-gray-600">You do not have an API key yet.</p>
      ) : (
        <ul className="glass mt-8 divide-y divide-white/70 overflow-hidden rounded-3xl">
          {credentials.map((credential) => (
            <li key={credential.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3">
              <div>
                <p className="font-mono text-sm text-gray-900">{credential.key_prefix}…</p>
                <p className="text-sm text-gray-500">
                  {credential.status} · created {when(credential.created_at)} · last used {when(credential.last_used_at)}
                </p>
              </div>
              {credential.status === "active" ? (
                <button type="button" onClick={() => revoke(credential.id)} className="text-sm font-semibold text-red-600">
                  Revoke
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
