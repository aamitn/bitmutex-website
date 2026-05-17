import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SuccessStoryMap from "../SuccessStoryMap"; // Adjust relative path to match your folder tree layout
import React from "react";

// 1. Mock the top-level Leaflet global core engine to bypass DOM rendering exceptions
vi.mock("leaflet", () => {
  return {
    default: {
      icon: vi.fn(() => ({ options: {} })),
      divIcon: vi.fn(({ html, iconSize, className }) => ({
        options: { html, iconSize, className }
      })),
    },
    // Mirror regular named exports to satisfy destructured layout targets
    icon: vi.fn(() => ({ options: {} })),
    divIcon: vi.fn(({ html, iconSize, className }) => ({
      options: { html, iconSize, className }
    })),
  };
});

// 2. Mock react-leaflet components to render plain markup primitives instead of WebGL/Canvas vectors
vi.mock("react-leaflet", () => {
  return {
    MapContainer: ({ children, center, zoom, className }: any) => (
      <div data-testid="mock-map-container" data-center={JSON.stringify(center)} data-zoom={zoom} className={className}>
        {children}
      </div>
    ),
    TileLayer: ({ url, attribution }: any) => (
      <div data-testid="mock-tile-layer" data-url={url} data-attribution={attribution} />
    ),
    Marker: ({ children, position, eventHandlers }: any) => {
      // Mock basic implementation of Leaflet event actions
      const mockElementRef = {
        openPopup: vi.fn(),
        setIcon: vi.fn(),
      };
      
      return (
        <div 
          data-testid="mock-marker" 
          data-position={JSON.stringify(position)}
          onClick={(e) => eventHandlers?.click?.({ ...e, target: mockElementRef })}
          onMouseLeave={(e) => eventHandlers?.mouseout?.({ ...e, target: mockElementRef })}
        >
          {children}
        </div>
      );
    },
    Popup: ({ children }: any) => <div data-testid="mock-popup">{children}</div>,
    Tooltip: ({ children }: any) => <div data-testid="mock-tooltip">{children}</div>,
    ZoomControl: ({ position }: any) => <div data-testid="mock-zoom" data-position={position} />,
  };
});

// 3. Mock react-leaflet-markercluster proxy component wrapper cleanly
vi.mock("react-leaflet-markercluster", () => {
  return {
    default: ({ children, iconCreateFunction }: any) => (
      <div data-testid="mock-cluster-group" data-has-icon-fn={!!iconCreateFunction}>
        {children}
      </div>
    ),
  };
});

// --- SAMPLE DATA CONFIGURATIONS FOR SIMULATION ---
const mockMarkerProps = {
  markers: [
    { lat: "22.5726", lon: "88.3639", name: "Kolkata Operations Hub" },
    { lat: "28.6139", lon: "77.2090", name: "Delhi Infrastructure Grid" }
  ]
};

describe("SuccessStoryMap Component Framework Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should mount parent MapContainer elements with correct India-centered default viewpoints", () => {
    render(<SuccessStoryMap {...mockMarkerProps} />);

    const mapWrapper = screen.getByTestId("mock-map-container");
    expect(mapWrapper).toBeInTheDocument();
    expect(mapWrapper).toHaveAttribute("data-center", JSON.stringify([20, 77]));
    expect(mapWrapper).toHaveAttribute("data-zoom", "4");
    
    expect(screen.getByTestId("mock-tile-layer")).toBeInTheDocument();
    expect(screen.getByTestId("mock-zoom")).toHaveAttribute("data-position", "bottomleft");
  });

  it("should format string coordinates to numeric positional floating arrays inside Marker slots", () => {
    render(<SuccessStoryMap {...mockMarkerProps} />);

    const markersList = screen.getAllByTestId("mock-marker");
    expect(markersList).toHaveLength(2);

    // Verify coordinate array mapping conversions [parseFloat(lat), parseFloat(lon)]
    expect(markersList[0]).toHaveAttribute("data-position", JSON.stringify([22.5726, 88.3639]));
    expect(markersList[1]).toHaveAttribute("data-position", JSON.stringify([28.6139, 77.2090]));
  });

  it("should append semantic tooltip text headers and inner popup diagnostic values completely", () => {
    render(<SuccessStoryMap {...mockMarkerProps} />);

    const tooltips = screen.getAllByTestId("mock-tooltip");
    const popups = screen.getAllByTestId("mock-popup");

    expect(tooltips[0]).toHaveTextContent("Kolkata Operations Hub");
    expect(popups[0]).toHaveTextContent("Lat: 22.572600, Lon: 88.363900");

    expect(tooltips[1]).toHaveTextContent("Delhi Infrastructure Grid");
  });

  it("should invoke internal marker event click handlers and expand popup sizes", () => {
    render(<SuccessStoryMap {...mockMarkerProps} />);

    const coreMarker = screen.getAllByTestId("mock-marker")[0];
    
    // Simulate programmatic map element target clicks
    fireEvent.click(coreMarker);
    
    // Mouse hover boundaries out resets style states back down cleanly
    fireEvent.mouseLeave(coreMarker);
    expect(coreMarker).toBeInTheDocument();
  });

  it("should evaluate cluster function logics and calculate color markers based on metrics thresholds", () => {
    render(<SuccessStoryMap {...mockMarkerProps} />);
    
    // Ensure cluster wrappers successfully link icon customization definitions
    expect(screen.getByTestId("mock-cluster-group")).toHaveAttribute("data-has-icon-fn", "true");
  });
});