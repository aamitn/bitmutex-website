
import { draftMode } from "next/headers";
import { getAllPagesSlugs, getPageBySlug } from "@/data/loaders";
import { BlockRenderer } from "@/components/block-renderer";

export async function generateStaticParams() {
  const pages = await getAllPagesSlugs();
  return pages.data.map((page) => ({
    slug: page.slug,
  }));
}


interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PageBySlugRoute({ params }: PageProps) {
  const resolveParams = await params;
  const slug = await resolveParams?.slug;

  const { isEnabled: isDraftMode } = await draftMode();
  const status = isDraftMode ? "draft" : "published";
  
  const data = await getPageBySlug(slug, status);
  const blocks = data?.data[0]?.blocks;
  if (!blocks) return null;
  return <div>{blocks ? <BlockRenderer blocks={blocks} /> : null}</div>;
}
