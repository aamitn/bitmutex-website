import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import CodeBlockWithCopy from "../CodeBlockWithCopy"; 
import React from "react";

// 1. Mock the native Clipboard API globally
const mockWriteText = vi.fn().mockResolvedValue(undefined);
vi.stubGlobal("navigator", {
  clipboard: {
    writeText: mockWriteText,
  },
});

// 2. Mock the heavy internal react-syntax-highlighter module 
vi.mock("react-syntax-highlighter", () => ({
  Prism: ({ children, language, showLineNumbers }: any) => (
    <pre data-testid="mock-highlighter" data-lang={language} data-line-numbers={showLineNumbers}>
      <code>{children}</code>
    </pre>
  ),
}));

// 3. Mock Framer Motion to isolate styling animation transitions completely
vi.mock("framer-motion", async () => {
  const ReactComponentProxy = (tagName: string) => {
    return React.forwardRef(({ children, style, onHoverStart, onHoverEnd, whileHover, ...props }: any, ref: any) => {
      return React.createElement(tagName, { ...props, ref, style }, children);
    });
  };
  return {
    motion: new Proxy({}, {
      get(_target, prop: string) {
        return ReactComponentProxy(prop);
      }
    }),
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe("CodeBlockWithCopy Highlighting Framework Suite", () => {
  const mockCodeSnippet = `const toggleLatch = (current: number) => {\n  return current > 0.5 ? 1 : 0;\n};`;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });


  it("should interact directly with clipboard APIs and display transient text alerts when copied", async () => {
    render(
      <CodeBlockWithCopy language="typescript">
        {mockCodeSnippet}
      </CodeBlockWithCopy>
    );

    const copyBtn = screen.getByRole("button", { name: /copy/i });
    expect(copyBtn).toBeInTheDocument();

    // Trigger click transition pathway
    await act(async () => {
      await fireEvent.click(copyBtn);
    });

    expect(mockWriteText).toHaveBeenCalledWith(mockCodeSnippet.trim());
    expect(screen.getByText("Copied!")).toBeInTheDocument();

    // Advancing timers beyond the 2500ms delay window drops the text status back down cleanly
    act(() => {
      vi.advanceTimersByTime(2600);
    });

    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(screen.queryByText("Copied!")).toBeNull();
  });

  it("should process custom parameter overrides and disable internal layout line numbers cleanly", () => {
    render(
      <CodeBlockWithCopy language="rust" showLineNumbers={false}>
        {`let state = 0xAA;`}
      </CodeBlockWithCopy>
    );

    const highLighter = screen.getByTestId("mock-highlighter");
    expect(highLighter).toHaveAttribute("data-line-numbers", "false");
  });
});