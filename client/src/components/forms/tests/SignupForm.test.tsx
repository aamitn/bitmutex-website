import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { SignupForm } from "../sign-up-form"; 
import React from "react";

// 1. Mock Next.js Link component to render as a plain anchor element
vi.mock("next/link", () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// 2. Mock external server actions to control validation responses safely
const mockRegisterUserAction = vi.fn();
vi.mock("@/data/actions", () => ({
  registerUserAction: (prevState: any, formData: FormData) => mockRegisterUserAction(prevState, formData),
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

describe("SignupForm useActionState & Redirection Infrastructure Suite", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    
    // Redefine window.location assignment property tracking to mock route redirects cleanly
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { href: "" },
    });

    mockRegisterUserAction.mockResolvedValue({
      data: null,
      zodErrors: null,
      strapiErrors: null,
      message: null,
      success: false,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("should mount all structural layout inputs, placeholder prompts, and authentication triggers smoothly", () => {
    render(<SignupForm />);

    expect(screen.getByText("Enter your details to create a new account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("name@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
    expect(screen.getByTestId("provider-btn")).toHaveTextContent("GitHub");
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "signin");
  });

  it("should submit entered credentials straight to the target server register action hook pipeline", async () => {
    render(<SignupForm />);

    const usernameInput = screen.getByPlaceholderText("username");
    const emailInput = screen.getByPlaceholderText("name@example.com");
    const passwordInput = screen.getByPlaceholderText("password");
    
    // Isolate form scope via unique descriptor sentence to bypass button text collisions cleanly
    const formElement = screen.getByText("Enter your details to create a new account").closest("form")!;

    fireEvent.change(usernameInput, { target: { value: "amitnandi" } });
    fireEvent.change(emailInput, { target: { value: "amit@bitmutex.com" } });
    fireEvent.change(passwordInput, { target: { value: "securePass123" } });

    await act(async () => {
      fireEvent.submit(formElement);
    });

    expect(mockRegisterUserAction).toHaveBeenCalledTimes(1);
    
    const submittedFormData = mockRegisterUserAction.mock.calls[0][1] as FormData;
    expect(submittedFormData.get("username")).toBe("amitnandi");
    expect(submittedFormData.get("email")).toBe("amit@bitmutex.com");
    expect(submittedFormData.get("password")).toBe("securePass123");
  });

  it("should catch Zod validation schemas and project error structures next to their target labels", async () => {
    mockRegisterUserAction.mockImplementation(() => ({
      data: null,
      zodErrors: {
        username: ["Username is too short"],
        email: ["Invalid email address"],
        password: ["Password must contain an uppercase letter"],
      },
      strapiErrors: null,
      message: "Validation Failed",
      success: false,
    }));

    const { rerender } = render(<SignupForm />);
    const formElement = screen.getByText("Enter your details to create a new account").closest("form")!;

    await act(async () => {
      fireEvent.submit(formElement);
    });

    rerender(<SignupForm />);

    const errorContainers = screen.getAllByTestId("zod-error");
    expect(errorContainers[0]).toHaveTextContent("Username is too short");
    expect(errorContainers[1]).toHaveTextContent("Invalid email address");
    expect(errorContainers[2]).toHaveTextContent("Password must contain an uppercase letter");
  });

  it("should present server-side Strapi error logs clearly on the footer message board", async () => {
    mockRegisterUserAction.mockImplementation(() => ({
      data: null,
      zodErrors: null,
      strapiErrors: { message: "Email or Username already taken" },
      message: "Database Mismatch",
      success: false,
    }));

    const { rerender } = render(<SignupForm />);
    const formElement = screen.getByText("Enter your details to create a new account").closest("form")!;

    await act(async () => {
      fireEvent.submit(formElement);
    });

    rerender(<SignupForm />);

    const backendError = screen.getByTestId("strapi-error");
    expect(backendError).toBeInTheDocument();
    expect(backendError).toHaveTextContent("Email or Username already taken");
  });

  it("should expose a success banner alert and redirect to signin exactly after 5000ms upon victory", async () => {
    mockRegisterUserAction.mockImplementation(() => ({
      data: { id: 22, token: "jwt-token" },
      zodErrors: null,
      strapiErrors: null,
      message: "Account created successfully!",
      success: true,
    }));

    const { rerender } = render(<SignupForm />);
    const formElement = screen.getByText("Enter your details to create a new account").closest("form")!;

    await act(async () => {
      fireEvent.submit(formElement);
    });

    rerender(<SignupForm />);

    // Check that success banner renders correctly into the view
    expect(screen.getByText(/Account created successfully! Redirecting to login in 5 seconds.../i)).toBeInTheDocument();

    // Verify redirect window location has NOT updated prematurely before the timeout completes
    expect(window.location.href).toBe("");

    // Fast-forward fake timer ticks by 5000ms
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    // Assert redirect routing triggers successfully
    expect(window.location.href).toBe("/signin");
  });
});