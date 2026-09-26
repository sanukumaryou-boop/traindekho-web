"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ApiCredential } from "@/lib/developers/public-api";

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M7 15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M5 12.5 9.5 17 19 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg viewBox="0 -960 960 960" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
    </svg>
  );
}

function when(value: string | null) {
  if (!value) return "Never";
  return new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function KeysPanel({ credentials }: { credentials: ApiCredential[] }) {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [secretId, setSecretId] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [copiedId, setCopiedId] = useState("");
  const [copyNoteId, setCopyNoteId] = useState("");

  async function createKey() {
    setError("");
    setPending(true);
    const response = await fetch("/api/developers/credentials", { method: "POST" });
    const body = (await response.json().catch(() => null)) as {
      secret?: string;
      credential?: { id?: string };
      error?: string;
    } | null;
    setPending(false);
    if (!response.ok || !body?.secret) {
      setError(body?.error ?? "The key could not be created.");
      return;
    }
    setSecret(body.secret);
    setSecretId(body.credential?.id ?? "");
    setCopiedId("");
    setCopyNoteId("");
    router.refresh();
  }

  async function deleteKey(id: string) {
    if (!window.confirm("Delete this API key? Calls using it will stop working.")) return;
    setError("");
    const response = await fetch(`/api/developers/credentials/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "The key could not be deleted.");
      return;
    }
    if (secretId === id) {
      setSecret("");
      setSecretId("");
    }
    router.refresh();
  }

  async function copyKey(id: string) {
    setError("");
    if (id !== secretId || !secret) {
      setCopiedId("");
      setCopyNoteId(id);
      return;
    }
    await navigator.clipboard.writeText(secret);
    setCopiedId(id);
    setCopyNoteId("");
  }

  async function copySecret() {
    if (!secret) return;
    await navigator.clipboard.writeText(secret);
    setCopiedId(secretId || "new");
    setCopyNoteId("");
  }

  const keys = credentials.filter((credential) => credential.status === "active");
  const hasKeys = keys.length > 0;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wide text-blue-600">Account</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">API keys</h1>
        </div>
        {hasKeys ? (
          <button
            type="button"
            onClick={createKey}
            disabled={pending}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {pending ? "Creating" : "Create API key"}
          </button>
        ) : null}
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {secret ? (
        <section className="relative mt-8 overflow-hidden rounded-[1.75rem] border border-blue-600 bg-white p-5 shadow-[0_18px_40px_rgba(0,46,97,0.08)] sm:p-6">
          <p className="text-sm font-semibold text-gray-950">Copy this key now. It will not be shown again.</p>
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[#eef5fc] px-4 py-3">
            <pre className="min-w-0 flex-1 overflow-x-auto font-mono text-sm text-gray-950">{secret}</pre>
            <button
              type="button"
              onClick={copySecret}
              aria-label={copiedId === (secretId || "new") ? "Copied" : "Copy API key"}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-blue-700 hover:bg-white"
            >
              {copiedId === (secretId || "new") ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </section>
      ) : null}

      {keys.length === 0 ? (
        <section className="relative mt-8 max-w-xl overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white px-6 py-8 shadow-[0_18px_40px_rgba(0,46,97,0.08)] sm:px-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-blue-500/15 blur-2xl" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
              <circle cx="8" cy="14" r="3.25" stroke="currentColor" strokeWidth="1.75" />
              <path d="M11 14h9.5M16.5 14v2.5M19.5 14v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="relative mt-5 text-2xl font-extrabold tracking-tight text-gray-950">No API key yet</h2>
          <p className="relative mt-3 max-w-md text-sm leading-relaxed text-gray-600">
            Create a key for the train, station, and route APIs. Send it as{" "}
            <span className="font-mono text-[13px] text-gray-900">X-API-Key</span>. The full key is shown once,
            right after you create it.
          </p>
          <button
            type="button"
            onClick={createKey}
            disabled={pending}
            className="relative mt-6 inline-flex h-10 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {pending ? "Creating" : "Create API key"}
          </button>
        </section>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {keys.map((credential) => (
            <li
              key={credential.id}
              className="flex flex-col gap-4 rounded-[1.75rem] border border-blue-100 bg-white p-5 shadow-[0_18px_40px_rgba(0,46,97,0.08)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <circle cx="8" cy="14" r="3.25" stroke="currentColor" strokeWidth="1.75" />
                    <path d="M11 14h9.5M16.5 14v2.5M19.5 14v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm font-semibold text-gray-950">{credential.key_prefix}••••</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Created {when(credential.created_at)} · Last used {when(credential.last_used_at)}
                  </p>
                  {copyNoteId === credential.id ? (
                    <p className="mt-1 text-sm text-gray-600">The full key is shown only once, when you create it.</p>
                  ) : null}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => copyKey(credential.id)}
                  aria-label={copiedId === credential.id ? "Copied" : "Copy API key"}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-blue-700 hover:bg-blue-50"
                >
                  {copiedId === credential.id ? <CheckIcon /> : <CopyIcon />}
                </button>
                <button
                  type="button"
                  onClick={() => deleteKey(credential.id)}
                  aria-label="Delete API key"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
                >
                  <DeleteIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
