import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { SubmitButton } from "../submit-button"; // Adjust path
import React from "react";

// Mock the react-dom useFormStatus binding layer safely
const mockFormStatus = vi.fn(() => ({ pending: false }));
vi.mock("react-dom", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useFormStatus: () => mockFormStatus(),
  };
});

describe("SubmitButton Utility Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFormStatus.mockReturnValue({ pending: false });
  });

  it("should render normal text when form status evaluates as idle", () => {
    render(<SubmitButton text="Save Firmware" loadingText="Uploading..." />);
    
    const activeBtn = screen.getByRole("button", { name: "Save Firmware" });
    expect(activeBtn).toBeInTheDocument();
    expect(activeBtn).not.toBeDisabled();
  });

  it("should transition to disabled loader state when useFormStatus updates to pending", () => {
    mockFormStatus.mockReturnValue({ pending: true });
    render(<SubmitButton text="Save Firmware" loadingText="Uploading..." />);
    
    const loadingBtn = screen.getByRole("button");
    expect(loadingBtn).toBeDisabled();
    expect(screen.getByText("Uploading...")).toBeInTheDocument();
  });

  it("should force loading indicator if the manual loading boolean flag is true", () => {
    render(<SubmitButton text="Save Firmware" loadingText="Uploading..." loading={true} />);
    
    const loadingBtn = screen.getByRole("button");
    expect(loadingBtn).toBeDisabled();
    expect(screen.getByText("Uploading...")).toBeInTheDocument();
  });
});