import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JobBoardClient from "./JobBoardClient";
import { describe, it, expect } from "vitest";

// Mock sample job mock data payload
const mockJobs = [
  {
    documentID: "job-1",
    title: "Frontend Engineer",
    description: "Build beautiful user interfaces with React and Tailwind CSS.",
    location: "Remote",
    postedAt: "2026-05-15",
    experience: "Mid-level",
    deadline: "2026-06-01",
  },
  {
    documentID: "job-2",
    title: "Backend Specialist",
    description: "Architect scale infrastructure configurations with Node.js and Strapi v5.",
    location: "New York",
    postedAt: "2026-05-14",
    experience: "Senior",
    deadline: "2026-06-15",
  },
];

describe("JobBoardClient Component Suite", () => {
  it("should render all initial job postings and filters cleanly", () => {
    render(<JobBoardClient initialJobs={mockJobs} />);

    // Check that both job cards are rendered
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
    expect(screen.getByText("Backend Specialist")).toBeInTheDocument();

    // Verify filter check options extracted correctly from dataset variables
    expect(screen.getByLabelText("Search jobs")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Mid-level" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Remote" })).toBeInTheDocument();
  });

  it("should filter the cards layout array when typing in the search bar", async () => {
    const user = userEvent.setup();
    render(<JobBoardClient initialJobs={mockJobs} />);

    const searchInput = screen.getByLabelText("Search jobs");

    // Type query matching item 1 
    await user.type(searchInput, "Frontend");

    // Assert layout mutations updated UI presentation dynamically
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
    expect(screen.queryByText("Backend Specialist")).not.toBeInTheDocument();
  });

  it("should narrow down results when checkboxes are checked", async () => {
    const user = userEvent.setup();
    render(<JobBoardClient initialJobs={mockJobs} />);

    // Grab specific filter checkbox references
    const seniorCheckbox = screen.getByRole("checkbox", { name: "Senior" });
    
    // Toggle check filter
    await user.click(seniorCheckbox);

    // Only Senior item should survive node pass filter evaluations
    expect(screen.getByText("Backend Specialist")).toBeInTheDocument();
    expect(screen.queryByText("Frontend Engineer")).not.toBeInTheDocument();
  });

  it("should display a fallback message if no dataset rows pass filter constraints", async () => {
    const user = userEvent.setup();
    render(<JobBoardClient initialJobs={mockJobs} />);

    const searchInput = screen.getByLabelText("Search jobs");

    // Type gibberish query
    await user.type(searchInput, "xyzNonExistentJobRole");

    // Verify fallback markup visibility state
    expect(
      screen.getByText("No jobs found matching your criteria.")
    ).toBeInTheDocument();
  });

  it("should clear layout items correctly if multiple conflicting filters are combined", async () => {
    const user = userEvent.setup();
    render(<JobBoardClient initialJobs={mockJobs} />);

    // Choose Senior filter button element context
    await user.click(screen.getByRole("checkbox", { name: "Senior" }));
    
    // Combine with Remote location constraint (Backend Specialist is New York)
    await user.click(screen.getByRole("checkbox", { name: "Remote" }));

    expect(screen.queryByText("Backend Specialist")).not.toBeInTheDocument();
    expect(screen.queryByText("Frontend Engineer")).not.toBeInTheDocument();
  });
});