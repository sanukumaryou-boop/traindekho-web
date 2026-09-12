import type { ButtonHTMLAttributes, ReactNode } from "react";

type HeroActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
};

export default function HeroActionButton({
  loading = false,
  loadingLabel = "Loading…",
  children,
  className = "",
  disabled,
  type = "submit",
  ...props
}: HeroActionButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-900 disabled:opacity-50 text-white font-medium px-6 py-[0.95rem] text-[0.95rem] transition-colors whitespace-nowrap disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="w-4 h-4" />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`animate-spin ${className ?? ""}`}
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
