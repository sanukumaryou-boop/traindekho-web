import CodeBlock from "@/components/developers/CodeBlock";
import CopyButton from "@/components/developers/CopyButton";
import GetApiKeyLink from "@/components/developers/GetApiKeyLink";
import { curlExample, type ApiEndpoint } from "@/lib/developers/catalog";
import { methodBadgeClass } from "@/lib/developers/method";
import { responseExamples } from "@/lib/developers/responses";

function statusTone(status: number) {
  if (status < 300) return "bg-emerald-50 text-emerald-700";
  if (status < 500) return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
}

export default function EndpointDoc({ endpoint }: { endpoint: ApiEndpoint }) {
  const responses = responseExamples(endpoint.success, endpoint.errorStatuses);
  const curl = curlExample(endpoint);

  return (
    <article>
      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded-md bg-white/80 px-2 py-1 text-xs font-bold tracking-wide ring-1 ring-black/5 ${methodBadgeClass(endpoint.method)}`}>
          {endpoint.method}
        </span>
        <h1 className="min-w-0 font-mono text-xl text-gray-900 sm:text-2xl">{endpoint.path}</h1>
        <GetApiKeyLink className="ml-auto shrink-0 !bg-black hover:!bg-gray-800" />
      </div>
      <p className="mt-4 max-w-2xl text-gray-600 leading-relaxed">{endpoint.description}</p>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-gray-900">Request</h2>
        <div className="glass-dark relative mt-4 rounded-3xl">
          <CopyButton text={curl} />
          <pre className="overflow-x-auto rounded-3xl p-4 pr-12 font-mono text-sm leading-relaxed text-slate-200">
            <CodeBlock code={curl} language="curl" />
          </pre>
        </div>
        <div className="glass mt-4 overflow-hidden rounded-3xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/40 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-2 font-semibold">Name</th>
                <th className="px-4 py-2 font-semibold">In</th>
                <th className="px-4 py-2 font-semibold">Required</th>
                <th className="px-4 py-2 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {endpoint.parameters.map((parameter) => (
                <tr key={parameter.name} className="border-t border-white/70">
                  <td className="px-4 py-3 font-mono text-gray-900">{parameter.name}</td>
                  <td className="px-4 py-3 text-gray-500">{parameter.in}</td>
                  <td className="px-4 py-3 text-gray-500">{parameter.required ? "yes" : "no"}</td>
                  <td className="px-4 py-3 text-gray-600">{parameter.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-gray-900">Responses</h2>
        <div className="mt-4 space-y-4">
          {responses.map((response) => (
            <div key={response.status} className="glass overflow-hidden rounded-3xl">
              <div className="flex flex-wrap items-center gap-3 border-b border-white/70 px-4 py-3">
                <span className={`rounded-md px-2 py-1 text-xs font-bold ${statusTone(response.status)}`}>{response.status}</span>
                <p className="text-sm text-gray-600">{response.description}</p>
              </div>
              <pre className="overflow-x-auto bg-[rgba(8,22,46,0.88)] p-4 font-mono text-sm leading-relaxed text-slate-200">
                <CodeBlock code={response.example} language="json" />
              </pre>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
