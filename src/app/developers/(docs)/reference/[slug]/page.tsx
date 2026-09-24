import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EndpointDoc from "@/components/developers/EndpointDoc";
import { apiEndpoints, endpointBySlug } from "@/lib/developers/catalog";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return apiEndpoints.map((endpoint) => ({ slug: endpoint.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const endpoint = endpointBySlug(slug);
  if (!endpoint) return { title: "API reference" };
  return {
    title: endpoint.summary,
    description: endpoint.description,
  };
}

export default async function EndpointPage({ params }: PageProps) {
  const { slug } = await params;
  const endpoint = endpointBySlug(slug);
  if (!endpoint) notFound();

  return <EndpointDoc endpoint={endpoint} />;
}
