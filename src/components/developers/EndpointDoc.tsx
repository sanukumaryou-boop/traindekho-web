import GetApiKeyLink from "@/components/developers/GetApiKeyLink";
import { API_BASE_URL, curlExample, type ApiEndpoint } from "@/lib/developers/catalog";
import { responseExamples } from "@/lib/developers/responses";

function statusTone(status: number) {
  if (status < 300) return "bg-emerald-50 text-emerald-700";
  if (status < 500) return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
}

export default function EndpointDoc({ endpoint }: { endpoint: ApiEndpoint }) {
  const responses = responseExamples(endpoint.success, endpoint.errorStatuses);

  return (
    <article>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-md bg-blue-600 px-2 py-1 text-xs font-bold tracking-wide text-white">{endpoint.method}</span>
        <h1 className="font-mono text-xl text-gray-900 sm:text-2xl">{endpoint.path}</h1>
      </div>
      <p className="mt-4 max-w-2xl text-gray-600 leading-relaxed">{endpoint.description}</p>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-gray-900">Request</h2>
        <p className="mt-2 text-sm text-gray-500">
          Base URL <span className="font-mono text-gray-800">{API_BASE_URL}</span>. Send{" "}
          <span className="font-mono text-gray-800">X-API-Key</span>.
        </p>
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
        <pre className="glass-dark mt-4 overflow-x-auto rounded-3xl p-4 text-sm leading-relaxed text-gray-100">
          <code>{curlExample(endpoint)}</code>
        </pre>
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
              <pre className="overflow-x-auto bg-[rgba(8,22,46,0.88)] p-4 text-sm leading-relaxed text-gray-100">
                <code>{response.example}</code>
              </pre>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10">
        <GetApiKeyLink />
      </div>
    </article>
  );
}
