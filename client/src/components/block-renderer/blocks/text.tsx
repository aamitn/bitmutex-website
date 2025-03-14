import { type TextProps } from "@/types";
import { MarkdownText } from "../../custom/markdown-text";

export function Text(data: Readonly<TextProps>) {
  if (!data) return null;
  console.log(data, "data");
  return <MarkdownText content={data.content} />;
}
