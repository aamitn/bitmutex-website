import { type TextProps } from "@/types";
import  RenderMarkdown  from "@/components/custom/RenderMarkdown";

export function Text(data: Readonly<TextProps>) {
  if (!data) return null;
  console.log(data, "data");
  return <RenderMarkdown content={data.content} />;
}
