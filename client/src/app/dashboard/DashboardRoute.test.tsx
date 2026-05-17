import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardRoute from "./page"; // Adjust path if named page.tsx or route.tsx
import { getUserMeLoader } from "@/data/services/user";

// 1. Mock the user data loader service
vi.mock("@/data/services/user", () => ({
  getUserMeLoader: vi.fn(),
}));

// 2. Mock child client components to isolate the server component layout
vi.mock("@/components/custom/logout-button", () => ({
  LogoutButton: () => <button data-testid="mock-logout">Logout</button>,
}));

vi.mock("@/components/cookie/CookieConsentApiControls", () => ({
  default: () => <div data-testid="mock-cookie-controls">Cookie Controls</div>,
}));

// 3. Partially mock utils to keep shadcn's "cn" class merger active
vi.mock("@/lib/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/utils")>();
  return {
    ...actual,
  };
});

describe("DashboardRoute Server Component Suite", () => {
  const mockUserData = {
    id: 42,
    documentId: "doc-user-123",
    firstname: "Alex",
    lastname: "Wiz",
    username: "alexwiz",
    email: "alex@bitmutex.com",
    confirmed: true,
    blocked: false,
    provider: "local",
    image: "/avatars/alex.png",
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-05-17T14:30:00.000Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully render profile, metrics table, and child widgets for an authenticated user", async () => {
    vi.mocked(getUserMeLoader).mockResolvedValueOnce({
      ok: true,
      data: mockUserData,
      error: null,
    });

    // Resolve async component promise structure
    const PageJSX = await DashboardRoute();
    render(PageJSX);

    // Verify greetings and identity texts
    expect(screen.getByRole("heading", { name: "Welcome, Alex!" })).toBeInTheDocument();
    expect(screen.getByText("Alex Wiz")).toBeInTheDocument();
    expect(screen.getByText("@alexwiz")).toBeInTheDocument();

    // Verify account status badges render with expected conditional strings
    expect(screen.getByText("Verified")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();

    // Verify data rows inside the layout table match our mock values
    expect(screen.getByText("alex@bitmutex.com")).toBeInTheDocument();
    expect(screen.getByText("doc-user-123")).toBeInTheDocument();
    expect(screen.getByText("local")).toBeInTheDocument();

    // Verify sidebar structural elements and child widgets mounted cleanly
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByTestId("mock-logout")).toBeInTheDocument();
    expect(screen.getByTestId("mock-cookie-controls")).toBeInTheDocument();
  });

  it("should alternative-render status badge UI states when flags are flipped", async () => {
    vi.mocked(getUserMeLoader).mockResolvedValueOnce({
      ok: true,
      data: {
        ...mockUserData,
        confirmed: false, // Should display "Unverified"
        blocked: true,    // Should display "Blocked"
      },
      error: null,
    });

    const PageJSX = await DashboardRoute();
    render(PageJSX);

    expect(screen.getByText("Unverified")).toBeInTheDocument();
    expect(screen.getByText("Blocked")).toBeInTheDocument();
    expect(screen.queryByText("Verified")).not.toBeInTheDocument();
    expect(screen.queryByText("Active")).not.toBeInTheDocument();
  });

  it("should gracefully display a red error notification text if user data retrieval fails", async () => {
    vi.mocked(getUserMeLoader).mockResolvedValueOnce({
      ok: false,
      data: null,
      error: { message: "Unauthorized token authentication error" },
    });

    const PageJSX = await DashboardRoute();
    render(PageJSX);

    expect(screen.getByText("Error fetching user data.")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Welcome, Alex!")).not.toBeInTheDocument();
  });
});