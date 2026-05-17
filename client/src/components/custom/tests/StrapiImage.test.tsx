import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StrapiImage, getStrapiMedia } from "../strapi-image"; // Adjust path
import React from "react";

vi.mock("next/image", () => ({
  default: ({ src, alt, className }: any) => <img src={src} alt={alt} className={className} data-testid="next-img" />,
}));

vi.mock("@/lib/utils", () => ({
  getStrapiURL: () => "https://api.bitmutex.com",
}));

describe("StrapiImage CDN Resolution Primitives", () => {
  it("should append asset prefix domains onto standard relative path descriptors", () => {
    expect(getStrapiMedia("/uploads/schematic.png")).toBe("https://api.bitmutex.com/uploads/schematic.png");
  });

  it("should bypass string transformations when parsing absolute or base64 data strings", () => {
    expect(getStrapiMedia("https://external.com/logo.jpg")).toBe("https://external.com/logo.jpg");
    expect(getStrapiMedia("data:image/png;base64,XYZ")).toBe("data:image/png;base64,XYZ");
    expect(getStrapiMedia(null)).toBeNull();
  });

  it("should mount NextImage asset elements with fallback alt descriptors safely", () => {
    render(<StrapiImage src="/uploads/pcb.png" alt="" />);
    
    const targetImg = screen.getByTestId("next-img");
    expect(targetImg).toHaveAttribute("src", "https://api.bitmutex.com/uploads/pcb.png");
    expect(targetImg).toHaveAttribute("alt", "No alt text provided.");
  });
});