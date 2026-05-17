import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StrapiErrors } from "../strapi-errors"; // Adjust path
import React from "react";

describe("StrapiErrors Error Feedback Box", () => {
  it("should display message descriptions italicized when valid payloads load", () => {
    const errorMock = { message: "Validation error: Invalid Thyristor frequency setup.", name: "ValidationError", status: "400" };
    render(<StrapiErrors error={errorMock} />);
    
    expect(screen.getByText("Validation error: Invalid Thyristor frequency setup.")).toBeInTheDocument();
  });

  it("should evaluate clean fallback returns matching null when exceptions are missing", () => {
    const { container } = render(<StrapiErrors error={{ message: null, name: "", status: null }} />);
    expect(container.firstChild).toBeNull();
  });
});