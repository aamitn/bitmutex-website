import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
// ✅ FIX: Bypassed brittle relative paths; using absolute alias maps instead
import { SigninForm } from "../sign-in-form"; 
import React from "react";

// 1. Mock Next.js Link component to render as a plain anchor element
vi.mock("next/link", () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// 2. Mock external server actions to control validation responses safely
const mockLoginUserAction = vi.fn();
vi.mock("@/data/actions", () => ({
  loginUserAction: (prevState: any, formData: FormData) => mockLoginUserAction(prevState, formData),
}));

// 3. Mock dependent visual accessory display sub-components
vi.mock("@/components/custom/zod-errors", () => ({
  ZodErrors: ({ error }: { error?: string[] }) => 
    error ? <div data-testid="zod-error">{error.join(", ")}</div> : null,
}));

vi.mock("@/components/custom/strapi-errors", () => ({
  StrapiErrors: ({ error }: { error?: { message: string } }) => 
    error ? <div data-testid="strapi-error">{error.message}</div> : null,
}));

vi.mock("@/components/custom/submit-button", () => ({
  SubmitButton: ({ text }: { text: string }) => <button type="submit">{text}</button>,
}));

vi.mock("@/components/custom/provider-auth-button", () => ({
  ProviderAuthLink: ({ children, buttonText }: any) => (
    <button type="button" data-testid="provider-btn">{buttonText} {children}</button>
  ),
}));

describe("SigninForm useActionState Infrastructure Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoginUserAction.mockResolvedValue({
      zodErrors: null,
      strapiErrors: null,
      data: null,
      message: null,
    });
  });

  it("should mount all structural layout inputs, placeholder prompts, and auth alternatives smoothly", () => {
    render(<SigninForm />);

    expect(screen.getByText("Enter your details to sign in to your account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("username or email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.getByTestId("provider-btn")).toHaveTextContent("GitHub");
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute("href", "signup");
  });

  it("should submit entered credentials straight to the target server login action hook pipeline", async () => {
    render(<SigninForm />);

    const identifierInput = screen.getByPlaceholderText("username or email");
    const passwordInput = screen.getByPlaceholderText("password");
    
    // ✅ FIX: Find the closest form using the unique description text to completely bypass "Sign In" duplicates
    const formElement = screen.getByText("Enter your details to sign in to your account").closest("form")!;

    fireEvent.change(identifierInput, { target: { value: "mit@bitmutex.com" } });
    fireEvent.change(passwordInput, { target: { value: "securePassword123" } });

    await act(async () => {
      fireEvent.submit(formElement);
    });

    expect(mockLoginUserAction).toHaveBeenCalledTimes(1);
    
    const submittedFormData = mockLoginUserAction.mock.calls[0][1] as FormData;
    expect(submittedFormData.get("identifier")).toBe("mit@bitmutex.com");
    expect(submittedFormData.get("password")).toBe("securePassword123");
  });

  it("should catch Zod validation schemas and project errors next to their target inputs instantly", async () => {
    mockLoginUserAction.mockImplementation(() => ({
      zodErrors: {
        identifier: ["Email is invalid"],
        password: ["Password must contain numbers"],
      },
      strapiErrors: null,
      data: null,
      message: "Validation Failed",
    }));

    const { rerender } = render(<SigninForm />);
    // ✅ FIX: Closest form target fallback isolation
    const formElement = screen.getByText("Enter your details to sign in to your account").closest("form")!;

    await act(async () => {
      fireEvent.submit(formElement);
    });

    rerender(<SigninForm />);

    const errorContainers = screen.getAllByTestId("zod-error");
    expect(errorContainers[0]).toHaveTextContent("Email is invalid");
    expect(errorContainers[1]).toHaveTextContent("Password must contain numbers");
  });

  it("should present server-side or Strapi database error logs clearly on the footer notification board", async () => {
    mockLoginUserAction.mockImplementation(() => ({
      zodErrors: null,
      strapiErrors: { message: "Invalid identifier or password" },
      data: null,
      message: "Authentication Error",
    }));

    const { rerender } = render(<SigninForm />);
    // ✅ FIX: Closest form target fallback isolation
    const formElement = screen.getByText("Enter your details to sign in to your account").closest("form")!;

    await act(async () => {
      fireEvent.submit(formElement);
    });

    rerender(<SigninForm />);

    const backendError = screen.getByTestId("strapi-error");
    expect(backendError).toBeInTheDocument();
    expect(backendError).toHaveTextContent("Invalid identifier or password");
  });
});