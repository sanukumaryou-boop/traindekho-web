const methodTone: Record<string, string> = {
  GET: "text-[#0cbb52]",
  POST: "text-[#ff6c37]",
  PUT: "text-[#097bed]",
  PATCH: "text-[#7b61ff]",
  DELETE: "text-[#eb2013]",
  HEAD: "text-[#6b7280]",
  OPTIONS: "text-[#c2417a]",
};

export function methodBadgeClass(method: string) {
  return methodTone[method] ?? "bg-slate-500";
}
