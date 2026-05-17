import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route"; // Adjust path if your handler file is named route.ts
import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

// 1. Mock Nodemailer transport engines and sending spies
const mockSendMail = vi.fn();
const mockCreateTransport = vi.fn((options: any) => ({
  sendMail: mockSendMail,
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: (options: any) => mockCreateTransport(options),
  },
}));

describe("SMTP Email Dispatcher API Route Handler Suite", () => {
  const baseRequestUrl = "http://localhost:3000/api/send-email";

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup dummy environment variable tokens
    process.env.SMTP_HOST = "smtp.mailtrap.io";
    process.env.SMTP_PORT = "2525";
    process.env.SMTP_USER = "test-user-abc";
    process.env.SMTP_PASS = "test-pass-xyz";
  });

  it("should successfully initialize the SMTP transport layer and dispatch a text-only email", async () => {
    const requestPayload = {
      to: "client@bitmutex.com",
      subject: "Project Deployment Update",
      message: "The staging build is successfully live.",
    };

    const request = new NextRequest(baseRequestUrl, {
      method: "POST",
      body: JSON.stringify(requestPayload),
    });

    mockSendMail.mockResolvedValueOnce({ messageId: "msg-12345" });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.message).toBe("Message sent successfully!");

    // Verify nodemailer configured the connection pool accurately
    expect(mockCreateTransport).toHaveBeenCalledWith({
      host: "smtp.mailtrap.io",
      port: 2525,
      secure: false,
      auth: {
        user: "test-user-abc",
        pass: "test-pass-xyz",
      },
    });

    // Verify outward message parameters match formatting rules
    expect(mockSendMail).toHaveBeenCalledWith({
      from: '"No Reply" <test-user-abc>',
      to: "client@bitmutex.com",
      subject: "Project Deployment Update",
      html: "<p>The staging build is successfully live.</p>",
    });
  });

  it("should cleanly parse and slice raw Base64 data strings when processing attachments", async () => {
    const requestPayload = {
      to: "billing@bitmutex.com",
      subject: "Invoice #1094",
      message: "Please find your attached receipt below.",
      attachments: [
        {
          filename: "receipt.pdf",
          content: "data:application/pdf;base64,JVBERi0xLjQKJb...", // Simulating standard client browser base64 stream
        },
      ],
    };

    const request = new NextRequest(baseRequestUrl, {
      method: "POST",
      body: JSON.stringify(requestPayload),
    });

    mockSendMail.mockResolvedValueOnce({ messageId: "msg-67890" });

    const response = await POST(request);
    expect(response.status).toBe(200);

    // Verify that the data URI scheme meta-prefix is stripped out correctly
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        attachments: [
          {
            filename: "receipt.pdf",
            content: "JVBERi0xLjQKJb...", // Confirms it popped the text cleanly
            encoding: "base64",
          },
        ],
      })
    );
  });

  it("should catch operational failures and return a 500 status code if the SMTP handshake crashes", async () => {
    const request = new NextRequest(baseRequestUrl, {
      method: "POST",
      body: JSON.stringify({
        to: "error@bitmutex.com",
        subject: "Ping Test",
        message: "Hello World",
      }),
    });

    // Force sendMail to simulate a standard authentication or network drop error
    mockSendMail.mockRejectedValueOnce(new Error("SMTP Authentication Failed: Invalid Credentials"));

    const response = await POST(request);
    expect(response.status).toBe(500);

    const json = await response.json();
    expect(json.error).toBe("Error sending message");
  });
});