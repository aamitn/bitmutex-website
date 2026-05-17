import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CkeditorBlockMarkdown } from "../ckeditor-block-markdown"; 
import { CkeditorBlock } from "../ckeditor-block";
import React from "react";

// 1. Mock the custom markdown rendering engine wrapper
vi.mock("@/components/custom/RenderMarkdown", () => ({
  default: ({ content }: { content: string }) => (
    <div data-testid="mock-markdown-render">{content}</div>
  ),
}));

// 2. ✅ FIX: Use dangerouslySetInnerHTML inside the parser mock to output 
// true raw HTML into JSDOM instead of string-escaped text characters!
vi.mock("html-react-parser", () => ({
  default: (html: string) => <span data-testid="html-parser-output" dangerouslySetInnerHTML={{ __html: html }} />,
}));

describe("Rich Text Content Renderers Unified Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component 1: CkeditorBlockMarkdown (Markdown Rendering Pipeline)", () => {
    it("should mount semantic layout wrappers and render clean markdown body text structures", () => {
      const mockMarkdownProps = {
        content: "## Power Electronics Design\nReviewing thyristor-based power topologies for structural stability.",
      };

      // ✅ FIX: Cast the spread object to satisfies the full CMS model contract safely
      render(<CkeditorBlockMarkdown {...mockMarkdownProps as any} />);

      const markdownWidget = screen.getByTestId("mock-markdown-render");
      expect(markdownWidget).toBeInTheDocument();
      expect(markdownWidget).toHaveTextContent("Power Electronics Design");
    });

    it("should return null gracefully if the string payload parameter evaluates as empty", () => {
      const mockEmptyProps = {
        content: ""
      };

      const { container } = render(<CkeditorBlockMarkdown {...mockEmptyProps as any} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Component 2: CkeditorBlock (HTML Sanitization Matrix)", () => {
    it("should seamlessly parse clean rich-text HTML structures down to the rendering view boards", () => {
      const cleanHtml = "<p>Bitmutex firm develops firmware layouts on <strong>STM32</strong> boards.</p>";
      
      render(<CkeditorBlock content={cleanHtml} />);

      const rawOutputNode = screen.getByTestId("html-parser-output");
      expect(rawOutputNode).toBeInTheDocument();
      expect(rawOutputNode).toHaveTextContent("Bitmutex firm develops firmware layouts");
    });

    it("should aggressively strip out blacklisted malicious script tags while retaining safe typography nodes", () => {
      const maliciousPayload = "<div><h1>Heading Valid</h1><script>alert('exploit-vulnerability')</script></div>";
      
      render(<CkeditorBlock content={maliciousPayload} />);

      const sanitizedResult = screen.getByTestId("html-parser-output").innerHTML;
      
      // ✅ Now resolves perfectly against real unescaped HTML elements
      expect(sanitizedResult).toContain("<h1>Heading Valid</h1>");
      expect(sanitizedResult).not.toContain("<script>");
      expect(sanitizedResult).not.toContain("alert");
    });

    it("should allow whitelisted media extensions including YouTube embed parameters and raw images", () => {
      const mediaHtml = `
        <div>
          <img src="/uploads/vienna_rectifier.png" alt="Vienna Stack" />
          <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315"></iframe>
        </div>
      `;

      render(<CkeditorBlock content={mediaHtml} />);

      const parsedMediaContent = screen.getByTestId("html-parser-output").innerHTML;

      // ✅ Unescaped checks parse effortlessly
      expect(parsedMediaContent).toContain('<img src="/uploads/vienna_rectifier.png"');
      expect(parsedMediaContent).toContain('src="https://www.youtube.com/embed/dQw4w9WgXcQ"');
    });

    it("should return null gracefully if the raw content string input evaluation path resolves empty", () => {
      const { container } = render(<CkeditorBlock content="" />);
      expect(container.firstChild).toBeNull();
    });
  });
});