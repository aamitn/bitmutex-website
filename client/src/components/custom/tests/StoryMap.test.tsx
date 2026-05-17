import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import StoryMap from "../StoryMap"; // Adjust path
import React from "react";

vi.mock("leaflet", () => {
  return {
    Icon: class MockIcon {
      public options: Record<string, any>;
      constructor(options: any) {
        this.options = options || {};
      }
    }
  };
});

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children, center, zoom }: any) => (
    <div data-testid="map-shell" data-center={JSON.stringify(center)} data-zoom={zoom}>{children}</div>
  ),
  TileLayer: ({ url }: any) => <div data-testid="tile-layer" data-url={url} />,
  Marker: ({ children, position }: any) => (
    <div data-testid="map-marker" data-position={JSON.stringify(position)}>{children}</div>
  ),
  Popup: ({ children }: any) => <div data-testid="map-popup">{children}</div>,
}));

describe("StoryMap Geospatial Mapping Atom", () => {
  const mockLocation = { lat: "22.5726", lon: "88.3639", name: "Kolkata Lab" };

  it("should convert locations properties arrays into coordinates vectors safely", () => {
    render(<StoryMap location={mockLocation} />);
    
    const mapShell = screen.getByTestId("map-shell");
    expect(mapShell).toBeInTheDocument();
    expect(mapShell).toHaveAttribute("data-center", JSON.stringify([22.5726, 88.3639]));

    expect(screen.getByTestId("map-marker")).toHaveAttribute("data-position", JSON.stringify([22.5726, 88.3639]));
    expect(screen.getByTestId("map-popup")).toHaveTextContent("Kolkata Lab");
  });
});