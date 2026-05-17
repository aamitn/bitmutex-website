import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Heading } from "../heading";       // Adjust paths to where your elements live
import { Subheading } from "../subheading";
import React from "react";

// Mock react-wrap-balancer since it's a layout optimizer that don't change text delivery nodes
vi.mock("react-wrap-balancer", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Shared Typography Layout Components Suite", () => {
  
  describe("Heading Component Elements", () => {
    it("should compile textual child structures and defaults to an h2 semantic tag element", () => {
      const { container } = render(<Heading>Industrial Power Charger Stack</Heading>);
      
      const element = screen.getByText("Industrial Power Charger Stack");
      expect(element).toBeInTheDocument();
      
      // Check default element tag node assignments
      expect(container.querySelector("h2")).toBeInTheDocument();
    });

    it("should dynamically switch root structural tags based on the explicit 'as' parameter config", () => {
      const { container } = render(<Heading as="h1">Vienna Rectifier Control</Heading>);
      
      expect(screen.getByText("Vienna Rectifier Control")).toBeInTheDocument();
      expect(container.querySelector("h1")).toBeInTheDocument();
      expect(container.querySelector("h2")).not.toBeInTheDocument();
    });

    it("should cleanly append tailwind style size variants correctly without colliding structural classes", () => {
      const { container } = render(<Heading size="2xl">11kW Architecture</Heading>);
      
      const headingNode = container.firstChild as HTMLElement;
      // Confirm the variant class maps cleanly into the DOM node list
      expect(headingNode).toHaveClass("text-5xl");
      expect(headingNode).toHaveClass("md:text-7xl");
    });
  });

  describe("Subheading Component Elements", () => {
    it("should mount subtext contents applying default font text alignment styles cleanly", () => {
      const { container } = render(<Subheading>High frequency thyrister control loops.</Subheading>);
      
      const element = screen.getByText("High frequency thyrister control loops.");
      expect(element).toBeInTheDocument();
      
      const subHeadingNode = container.firstChild as HTMLElement;
      expect(subHeadingNode).toHaveClass("text-muted");
      expect(subHeadingNode).toHaveClass("text-center");
    });
  });
});