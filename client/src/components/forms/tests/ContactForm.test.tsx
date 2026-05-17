import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ContactForm } from "../contact-form"; // Adjust filename or relative path if needed
import React from "react";

// 1. Mock local layout container wrapper to render flat children elements cleanly
vi.mock("./container", () => ({
  Container: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

describe("ContactForm Form Submission & Anti-Spam Suite", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_STRAPI_BASE_URL", "https://api.bitmutex.com");
    vi.stubEnv("NEXT_PUBLIC_ADMIN_EMAIL", "admin@bitmutex.com");
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it("should render all expected input fields, placeholders, and form labels smoothly", () => {
    render(<ContactForm />);

    expect(screen.getByPlaceholderText("Your Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Contact Number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Message")).toBeInTheDocument();
    expect(screen.getByLabelText(/where did you hear about us\?/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("should restrict the contact number input to strictly numeric characters up to 10 digits", () => {
    render(<ContactForm />);
    const phoneInput = screen.getByPlaceholderText("Your Contact Number") as HTMLInputElement;

    // Simulate user typing containing mixed strings/letters
    fireEvent.change(phoneInput, { target: { value: "98300abc12" } });
    
    // Non-digits are stripped instantly via regex formatting logic
    expect(phoneInput.value).toBe("9830012");
  });


 it("should intercept bot interactions and block api submission hooks if the hidden honeypot field is active", async () => {
    const { container } = render(<ContactForm />);
    
    // Target the invisible input node securely via its name attribute configuration
    const honeypotInput = container.querySelector('input[name="honeypot"]');
    expect(honeypotInput).toBeInTheDocument();

    // Simulate a malicious crawler auto-filling the hidden honeypot field
    fireEvent.change(honeypotInput as HTMLElement, { target: { value: "spam-bot-value" } });
    fireEvent.change(screen.getByPlaceholderText("Your Name"), { target: { value: "Bot Tester" } });

    const submitBtn = screen.getByRole("button", { name: /send message/i });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    // Submissions are instantly blocked—no external fetch network dispatches should ever fire
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});

// Helper selector utility to lookup nodes gracefully outside typical accessibility trees
function containerQuerySelect(container: HTMLElement, selector: string): HTMLElement {
  return container.querySelector(selector) as HTMLElement;
}