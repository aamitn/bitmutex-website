import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JobApplicationForm from "./JobApplicationForm";

// Global fetch mock helper setup
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("JobApplicationForm Component Suite", () => {
  const defaultProps = {
    jobId: "job-101",
    jobName: "Full Stack Engineer",
  };

  beforeEach(() => {
    mockFetch.mockReset();
    vi.clearAllMocks();
  });

  it("should render all form input nodes and labels correctly", () => {
    render(<JobApplicationForm {...defaultProps} />);

    expect(screen.getByRole("heading", { name: /apply for this job/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Phone Number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Cover Letter")).toBeInTheDocument();
    expect(screen.getByText("Choose a File")).toBeInTheDocument();
  });

  it("should validate input changes and update component state on user input", async () => {
    const user = userEvent.setup();
    render(<JobApplicationForm {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText("Your Name");
    await user.type(nameInput, "John Doe");
    expect(nameInput).toHaveValue("John Doe");
  });

  it("should reject invalid file types during resume upload selection", () => {
    render(<JobApplicationForm {...defaultProps} />);
    
    // Simulate selecting an image instead of a PDF/DOCX
    const file = new File(["dummy content"], "photo.png", { type: "image/png" });
    const fileInput = screen.getByLabelText(/choose a file/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText("Please upload a valid PDF or DOCX file.")).toBeInTheDocument();
  });

  it("should reject files that exceed the 5MB file size restriction", () => {
    render(<JobApplicationForm {...defaultProps} />);
    
    const largeFile = new File(["dummy content"], "resume.pdf", { type: "application/pdf" });
    // Manually overwrite the size parameter property to mock a 6MB file
    Object.defineProperty(largeFile, "size", { value: 6 * 1024 * 1024 });

    const fileInput = screen.getByLabelText(/choose a file/i);
    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(screen.getByText("File size exceeds the 5MB limit. Please upload a smaller file.")).toBeInTheDocument();
  });

  it("should accept valid files and display their filename text clearly", () => {
    render(<JobApplicationForm {...defaultProps} />);
    
    const validFile = new File(["dummy content"], "my-resume.pdf", { type: "application/pdf" });
    const fileInput = screen.getByLabelText(/choose a file/i);

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    expect(screen.getByText("my-resume.pdf")).toBeInTheDocument();
    expect(screen.queryByText(/please upload a valid/i)).not.toBeInTheDocument();
  });

  it("should handle form submissions seamlessly along with asset uploads", async () => {
    const user = userEvent.setup();
    render(<JobApplicationForm {...defaultProps} />);

    // Fill out mandatory fields
    await user.type(screen.getByPlaceholderText("Your Name"), "Jane Doe");
    await user.type(screen.getByPlaceholderText("Your Email"), "jane@example.com");
    await user.type(screen.getByPlaceholderText("Your Phone Number"), "+123456789");
    await user.type(screen.getByPlaceholderText("Cover Letter"), "Hello, this is my application statement layout.");

    // Attach a valid file asset
    const validFile = new File(["dummy content"], "resume.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    fireEvent.change(screen.getByLabelText(/choose a file/i), { target: { files: [validFile] } });

    // Step-by-step fetch sequence mocking execution chain loop:
    // 1st Fetch call simulation: File upload to `/api/upload` endpoint
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: "file-999" }],
    });

    // 2nd Fetch call simulation: Application record layout creation to `/api/job-applications`
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    // Trigger explicit submit click action event loop processing 
    await user.click(screen.getByRole("button", { name: /submit application/i }));

    // Assert file endpoints mapped and formatted parameters accurately
    expect(mockFetch).toHaveBeenCalledTimes(2);
    
    // Check first fetch call parameter payloads parsing behavior
    const firstCallArgs = mockFetch.mock.calls[0];
    expect(firstCallArgs[0]).toContain("/api/upload");

    // Check second fetch call payload contains mapped job IDs, data rows and attached resume reference numbers
    const secondCallArgs = mockFetch.mock.calls[1];
    expect(secondCallArgs[0]).toContain("/api/job-applications");
    
    const submittedBody = JSON.parse(secondCallArgs[1].body);
    expect(submittedBody.data.resume).toBe("file-999");
    expect(submittedBody.data.job).toBe("job-101 - Full Stack Engineer");

    // UI shows validation check pass confirmation
    expect(await screen.findByText("Application submitted successfully!")).toBeInTheDocument();
  });

  it("should show a descriptive UI error message if backend submission endpoint crashes", async () => {
    const user = userEvent.setup();
    render(<JobApplicationForm {...defaultProps} />);

    // Fill minimum required elements
    await user.type(screen.getByPlaceholderText("Your Name"), "Jane Doe");
    await user.type(screen.getByPlaceholderText("Your Email"), "jane@example.com");
    await user.type(screen.getByPlaceholderText("Your Phone Number"), "+123456789");
    await user.type(screen.getByPlaceholderText("Cover Letter"), "Hello!");

    // Mock an error response from the server submission payload request track
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Bad Request validation constraints" }),
    });

    await user.click(screen.getByRole("button", { name: /submit application/i }));

    expect(await screen.findByText("There was an error submitting your application.")).toBeInTheDocument();
  });
});