import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { RegisterForm } from "../register-form";
import React from "react";

// 1. Mock local layout container wrapper
vi.mock("./container", () => ({
  Container: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

// 2. Mock react-phone-input-2 to render as a plain text input box to bypass complex dropdown simulations
vi.mock("react-phone-input-2", () => ({
  default: ({ value, onChange, inputStyle }: any) => (
    <input
      data-testid="mock-phone-input"
      value={value}
      style={inputStyle}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Phone Number"
    />
  ),
}));

describe("RegisterForm Multi-Step File Attachment Submission Suite", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubEnv("NEXT_PUBLIC_STRAPI_BASE_URL", "https://api.bitmutex.com");
    vi.stubEnv("NEXT_PUBLIC_ADMIN_EMAIL", "admin@bitmutex.com");
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
    globalThis.alert = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should mount standard text fields, custom file inputs, and select options seamlessly", () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Company Name")).toBeInTheDocument();
    expect(screen.getByLabelText(/service opted/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enquiry type/i)).toBeInTheDocument();
    expect(screen.getByText("Choose a file...")).toBeInTheDocument();
  });

  it("should enforce validation parameters blocking illegal file formats and sizes exceeding 2MB bounds", () => {
    render(<RegisterForm />);
    const fileInputElement = document.getElementById("file-upload") as HTMLInputElement;

    // Test case 1: Invalid text file type
    const invalidFile = new File(["dummy text data"], "document.txt", { type: "text/plain" });
    fireEvent.change(fileInputElement, { target: { files: [invalidFile] } });
    expect(globalThis.alert).toHaveBeenCalledWith(expect.stringContaining("Invalid file type"));

    // Test case 2: Oversized PDF file type
    const oversizedFile = new File([""], "huge-file.pdf", { type: "application/pdf" });
    Object.defineProperty(oversizedFile, "size", { value: 3 * 1024 * 1024 }); // 3MB
    fireEvent.change(fileInputElement, { target: { files: [oversizedFile] } });
    expect(globalThis.alert).toHaveBeenCalledWith(expect.stringContaining("File size exceeds 2MB"));
  });

  it("should block API execution completely if the hidden honeysecretpot spam-bot parameter is active", async () => {
    const { container } = render(<RegisterForm />);

    const honeyPotInput = container.querySelector('input[name="honeysecretpot"]');
    expect(honeyPotInput).toBeInTheDocument();

    fireEvent.change(honeyPotInput as HTMLElement, { target: { value: "bot-activity-detected" } });
    fireEvent.change(screen.getByPlaceholderText("First Name"), { target: { value: "Bot Spam" } });

    const submitBtn = screen.getByRole("button", { name: "Submit" });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});