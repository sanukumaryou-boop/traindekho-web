import DocsSidebar from "@/components/developers/DocsSidebar";

export default function DocsFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[1760px] gap-8 px-4 sm:px-6 lg:px-8 pt-8">
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="glass sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-[28px] p-3.5">
          <DocsSidebar />
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="mb-6 lg:hidden">
          <details className="glass rounded-3xl p-3">
            <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-gray-900">API navigation</summary>
            <div className="mt-2 max-h-80 overflow-y-auto">
              <DocsSidebar />
            </div>
          </details>
        </div>
        {children}
      </div>
    </div>
  );
}
