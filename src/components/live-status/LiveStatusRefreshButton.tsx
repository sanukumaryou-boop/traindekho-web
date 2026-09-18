type LiveStatusRefreshButtonProps = {
  onRefresh: () => void;
  pending?: boolean;
};

export default function LiveStatusRefreshButton({
  onRefresh,
  pending = false,
}: LiveStatusRefreshButtonProps) {
  return (
    <button
      type="button"
      onClick={onRefresh}
      disabled={pending}
      aria-label="Refresh live status"
      aria-busy={pending}
      className="fixed bottom-28 sm:bottom-6 right-4 sm:right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-80 disabled:cursor-wait"
    >
      <RefreshIcon
        className={`h-6 w-6 ${pending ? "animate-spin" : ""}`}
      />
    </button>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M1 4v6h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 20v-6h-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
