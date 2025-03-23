import { getLandingPage } from "@/data/loaders";
import { BlockRenderer } from "@/components/block-renderer";
import { generateHomeMetadata } from "@/lib/homeMetadata";

export { generateHomeMetadata as generateMetadata }; // ✅ Export metadata function

export default async function Home() {
  const data = await getLandingPage();
  const blocks = data?.data?.blocks;
  if (!blocks) return null;
  return <div>{blocks ? <BlockRenderer blocks={blocks} /> : null}</div>;
}
